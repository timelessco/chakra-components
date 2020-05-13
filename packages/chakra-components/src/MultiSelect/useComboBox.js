import { useState, useEffect, useRef, useCallback } from "react";
import { useForkRef } from "@chakra-ui/core/dist/utils";

const defaultFilter = (options, input) => {
  if (input) {
    return options.filter(option =>
      option.label.toLowerCase().includes(input.toLowerCase()),
    );
  } else {
    return options;
  }
};

export const useComboBox = ({
  options,
  value: initialValues,
  onChange,
  filteredBy = defaultFilter,
  isMulti,
  isListBox,
}) => {
  // Refs
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const multiSelectRef = useRef(null);
  const popperRef = useRef(null);

  let _initialValues = [];

  // TODO: Check if this calculation for the initial value is battle proven
  if (initialValues) {
    if (Array.isArray(initialValues)) {
      _initialValues = initialValues;
    } else {
      if (initialValues) _initialValues = [initialValues];
    }
  }

  // States
  const [values, setValues] = useState(_initialValues);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notSelectedOptions, setNotSelectedOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(notSelectedOptions);
  const [inputValue, setInputValue] = useState("");
  const [listBoxInputValue, setListBoxInputValue] = useState("");
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);

  // Functions to be used in useEffect
  const focusSelectedOption = useCallback(() => {
    const selectedIndex = options.indexOf(selectedOptions[0]);

    if (selectedIndex !== -1) setFocusedOptionIndex(selectedIndex);
  }, [options, selectedOptions]);

  // Effects
  useEffect(() => {
    setSelectedOptions(
      values.map(value => options.find(option => option.value === value)),
    );
  }, [options, values]);

  useEffect(() => {
    if (!isMulti) {
      onChange(values[0] || "");
    } else {
      onChange(values);
    }
  }, [isMulti, onChange, values]);

  useEffect(() => {
    if (isMulti) {
      setNotSelectedOptions(
        options.filter(option => !values.includes(option.value)),
      );
    }
  }, [isMulti, options, values]);

  useEffect(() => {
    setFilteredOptions(filteredBy(notSelectedOptions, inputValue));
  }, [filteredBy, notSelectedOptions, inputValue]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollToItem(focusedOptionIndex);
  }, [isOpen, focusedOptionIndex]);

  useEffect(() => {
    if (!isMulti) focusSelectedOption();
  }, [isMulti, focusSelectedOption]);

  useEffect(() => {
    if (isListBox) {
      const optionsFiltered = filteredBy(options, listBoxInputValue)[0];
      const filteredIndex = options.indexOf(optionsFiltered);

      if (listBoxInputValue && filteredIndex !== -1) {
        if (!isOpen) {
          setValues([optionsFiltered.value]);
        } else {
          setFocusedOptionIndex(filteredIndex);
        }
      }
    }
  }, [isListBox, options, filteredBy, isOpen, listBoxInputValue]);

  // getters
  const getWrapperProps = () => {
    return {
      tabIndex: -1,
      onClick: () => {
        if (!isFocused) focusInput();
        if (inputIsHidden) setInputIsHidden(false);

        if (isOpen) {
          setIsOpen(false);
          setInputValue("");
        } else {
          setIsOpen(true);
          focusOption(0);
        }
      },
    };
  };

  const getInputProps = ref => {
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      inputRef: useForkRef(inputRef, ref),
      value: isListBox ? listBoxInputValue : inputValue,
      onChange: event => {
        if (isListBox) {
          setListBoxInputValue(event.currentTarget.value);

          setTimeout(() => {
            setListBoxInputValue("");
          }, 700);

          return;
        }

        if (inputIsHidden) setInputIsHidden(false);
        if (focusedOptionIndex !== 0) setFocusedOptionIndex(0);
        if (!isOpen) setIsOpen(true);

        setInputValue(event.currentTarget.value);
      },
      onFocus: () => {
        if (!isFocused) setIsFocused(true);
        if (inputIsHidden) setInputIsHidden(false);
      },
      onKeyDown: event => {
        const count = filteredOptions.length;
        let nextIndex;

        if (event.key === "ArrowDown") {
          if (filteredOptions.length) {
            if (inputIsHidden) setInputIsHidden(false);

            if (!isOpen) {
              setIsOpen(true);
              focusOption(0);

              return;
            }

            nextIndex = (focusedOptionIndex + 1) % count;
            setFocusedOptionIndex(nextIndex);
          }
        }

        if (event.key === "ArrowUp") {
          if (filteredOptions.length) {
            if (inputIsHidden) setInputIsHidden(false);

            if (!isOpen) {
              setIsOpen(true);
              focusOption(filteredOptions.length - 1);

              return;
            }

            nextIndex = (focusedOptionIndex - 1 + count) % count;
            setFocusedOptionIndex(nextIndex);
          }
        }

        if (event.key === "Enter") {
          if (filteredOptions.length) {
            const focusedOption = filteredOptions[focusedOptionIndex];

            if (
              focusedOption.hasOwnProperty("disabled") &&
              focusedOption.disabled
            ) {
              return;
            }

            if (isOpen) selectOption(focusedOption);
            if (isOpen) setIsOpen(false);

            setInputValue("");
          }
        }

        if (event.key === "Escape") {
          if (isOpen) setIsOpen(false);
        }

        if (event.key === "Backspace") {
          if (!inputValue) {
            if (inputIsHidden) setInputIsHidden(false);

            removeLastSelectedValue();
          }
        }
      },
      onBlur: event => {
        if (!isOpen && !multiSelectRef.current.contains(event.relatedTarget)) {
          if (isFocused) setIsFocused(false);

          setInputValue("");

          return;
        }

        if (
          isOpen &&
          !popperRef.current.contains(event.relatedTarget) &&
          !multiSelectRef.current.contains(event.relatedTarget)
        ) {
          if (isFocused) setIsFocused(false);
          if (isOpen) setIsOpen(false);

          setInputValue("");

          return;
        }

        focusInput();
      },
    };
  };

  const getOptionProps = ({ index, disabled, option, ...rest }) => {
    return {
      onClick: () => {
        if (disabled) return;

        selectOption(option);

        if (isOpen) setIsOpen(false);

        setInputValue("");
      },
      onMouseEnter: () => {
        if (disabled) return;

        setFocusedOptionIndex(index);
      },
      ...rest,
    };
  };

  // Extra Functions
  const selectOption = option => {
    if (!isMulti) {
      if (!inputIsHidden) setInputIsHidden(true);

      setValues([option.value]);
    } else {
      setValues(oldOptions => {
        if (oldOptions.includes(option.value)) {
          return oldOptions;
        }

        return [...oldOptions, option.value];
      });
    }
  };

  const removeLastSelectedValue = () => {
    if (!isMulti) {
      setValues([]);
    } else {
      if (values.length) {
        setValues(oldValues => oldValues.slice(0, oldValues.length - 1));
      }
    }
  };

  const removeSelectedValue = value => {
    setValues(oldValues =>
      oldValues.filter(oldValue => !oldValue.includes(value)),
    );
    if (!isFocused) focusInput();
  };

  const removeAllSelectedValues = () => {
    setValues([]);
    if (isOpen) setIsOpen(false);
    if (!isFocused) focusInput();
  };

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  };

  const focusOption = index => {
    if (!isMulti) {
      if (!values.length) {
        setFocusedOptionIndex(index);
      } else {
        focusSelectedOption();
      }
    } else {
      setFocusedOptionIndex(index);
    }
  };

  return {
    values,
    isFocused,
    isOpen,
    inputValue,
    listBoxInputValue,
    inputIsHidden,
    focusedOptionIndex,
    selectedOptions,
    filteredOptions,
    multiSelectRef,
    inputRef,
    popperRef,
    listRef,
    getWrapperProps,
    getInputProps,
    getOptionProps,
    removeSelectedValue,
    removeAllSelectedValues,
  };
};
