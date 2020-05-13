import { useState, useEffect, useRef } from "react";
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

  if (initialValues) {
    if (Array.isArray(initialValues)) {
      _initialValues = initialValues;
    } else {
      if (initialValues) {
        _initialValues = [initialValues];
      }
    }
  }

  // States
  const [values, setValues] = useState(_initialValues);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [listBoxInputValue, setListBoxInputValue] = useState("");
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notSelectedOptions, setNotSelectedOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(notSelectedOptions);

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
    listRef.current && listRef.current.scrollToItem(focusedOptionIndex);
  }, [isOpen, focusedOptionIndex]);

  useEffect(() => {
    if (!isMulti) {
      const selectedIndex = options.indexOf(selectedOptions[0]);

      if (selectedIndex !== -1) {
        setFocusedOptionIndex(selectedIndex);
      }
    }
  }, [isMulti, options, selectedOptions]);

  useEffect(() => {
    if (isListBox) {
      const optionsFiltered = filteredBy(options, listBoxInputValue);
      const filteredIndex = options.indexOf(optionsFiltered[0]);
      if (listBoxInputValue && filteredIndex !== -1) {
        if (!isOpen) {
          setValues([optionsFiltered[0].value]);
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
      onClick: e => {
        if (!isFocused) {
          inputRef.current.focus();
        }

        if (inputIsHidden) {
          setInputIsHidden(false);
        }

        if (isOpen) {
          setIsOpen(false);
          setInputValue("");
        } else {
          setIsOpen(true);

          if (!isMulti) {
            if (!values.length) {
              setFocusedOptionIndex(0);
            } else {
              const selectedOption = filteredOptions.find(
                option => option.value === values[0],
              );

              const selectedIndex = filteredOptions.indexOf(selectedOption);

              if (selectedIndex !== -1) {
                setFocusedOptionIndex(selectedIndex);
              }
            }
          } else {
            setFocusedOptionIndex(0);
          }
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

        setInputValue(event.currentTarget.value);

        if (inputIsHidden) {
          setInputIsHidden(false);
        }

        if (focusedOptionIndex !== 0) {
          setFocusedOptionIndex(0);
        }

        if (!isOpen) {
          setIsOpen(true);
        }
      },
      onFocus: event => {
        if (!isFocused) {
          setIsFocused(true);
        }

        if (inputIsHidden) {
          setInputIsHidden(false);
        }
      },
      onKeyDown: event => {
        const count = filteredOptions.length;
        let nextIndex;

        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (filteredOptions.length) {
            if (inputIsHidden) {
              setInputIsHidden(false);
            }

            if (!isOpen) {
              setIsOpen(true);

              if (!isMulti) {
                if (!values.length) {
                  setFocusedOptionIndex(0);
                } else {
                  const selectedOption = filteredOptions.find(
                    option => option.value === values[0],
                  );

                  const selectedIndex = filteredOptions.indexOf(selectedOption);

                  if (selectedIndex !== -1) {
                    setFocusedOptionIndex(selectedIndex);
                  }
                }
              } else {
                setFocusedOptionIndex(0);
              }

              return;
            }

            nextIndex = (focusedOptionIndex + 1) % count;
            setFocusedOptionIndex(nextIndex);
          }
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (filteredOptions.length) {
            if (inputIsHidden) {
              setInputIsHidden(false);
            }

            if (!isOpen) {
              setIsOpen(true);

              if (!isMulti) {
                if (!values.length) {
                  setFocusedOptionIndex(filteredOptions.length - 1);
                } else {
                  const selectedOption = filteredOptions.find(
                    option => option.value === values[0],
                  );

                  const selectedIndex = filteredOptions.indexOf(selectedOption);

                  if (selectedIndex !== -1) {
                    setFocusedOptionIndex(selectedIndex);
                  }
                }
              } else {
                setFocusedOptionIndex(filteredOptions.length - 1);
              }

              return;
            }

            nextIndex = (focusedOptionIndex - 1 + count) % count;
            setFocusedOptionIndex(nextIndex);
          }
        }

        if (event.key === "Enter") {
          if (filteredOptions.length) {
            const focusedOption = filteredOptions[focusedOptionIndex];

            if (focusedOption.disabled && focusedOption.disabled) {
              return;
            }

            if (isOpen) {
              if (!isMulti) {
                setValues([focusedOption.value]);

                if (!inputIsHidden) {
                  setInputIsHidden(true);
                }
              } else {
                setValues(oldOptions => {
                  if (oldOptions.includes(focusedOption.value)) {
                    return oldOptions;
                  }

                  return [...oldOptions, focusedOption.value];
                });
              }
            }

            setInputValue("");

            if (isOpen) {
              setIsOpen(false);
            }
          }
        }

        if (event.key === "Escape") {
          if (isOpen) {
            setIsOpen(false);
          }
        }

        if (event.key === "Backspace") {
          if (!inputValue) {
            if (inputIsHidden) {
              setInputIsHidden(false);
            }

            if (!isMulti) {
              setValues([]);
            } else {
              if (values.length) {
                const newValues = values.slice(0, values.length - 1);
                setValues(newValues);
              }
            }
          }
        }
      },
      onBlur: event => {
        if (!isOpen && !multiSelectRef.current.contains(event.relatedTarget)) {
          if (isFocused) {
            setIsFocused(false);
          }

          setInputValue("");

          return;
        }

        if (
          isOpen &&
          !popperRef.current.contains(event.relatedTarget) &&
          !multiSelectRef.current.contains(event.relatedTarget)
        ) {
          if (isFocused) {
            setIsFocused(false);
          }

          if (isOpen) {
            setIsOpen(false);
          }

          setInputValue("");

          return;
        }

        inputRef.current.focus();
      },
    };
  };

  const getOptionProps = ({ index, disabled, option, ...rest }) => {
    return {
      onClick: event => {
        if (disabled) {
          return;
        }

        if (!isMulti) {
          setValues([option.value]);

          if (!inputIsHidden) {
            setInputIsHidden(true);
          }
        } else {
          setValues(oldOptions => {
            if (oldOptions.includes(option.value)) {
              return oldOptions;
            }

            return [...oldOptions, option.value];
          });
        }
        setInputValue("");

        if (isOpen) {
          setIsOpen(false);
        }
      },
      onMouseEnter: event => {
        if (disabled) {
          return;
        }

        setFocusedOptionIndex(index);
      },
      ...rest,
    };
  };

  // Extra Functions
  const removeOneSelectedOption = (event, value) => {
    event.stopPropagation();
    setValues(oldValues =>
      oldValues.filter(oldValue => !oldValue.includes(value)),
    );

    if (!isFocused) {
      inputRef.current.focus();
    }
  };

  const removeAllSelectedOption = event => {
    event.stopPropagation();
    setValues([]);

    if (isOpen) {
      setIsOpen(false);
    }

    if (!isFocused) {
      inputRef.current.focus();
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
    removeOneSelectedOption,
    removeAllSelectedOption,
  };
};
