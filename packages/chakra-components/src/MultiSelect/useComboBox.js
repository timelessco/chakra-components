import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import debounce from "lodash.debounce";
import { useForkRef } from "@chakra-ui/core/dist/utils";
import { useConstant } from "./useConstant";

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
  isAsync,
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

  // Reducers
  const initialState = {
    values: _initialValues,
    originalOptions: options,
    selectedOptions: [],
    notSelectedOptions: options,
    filteredOptions: options,
    inputValue: "",
    focusedOptionIndex: 0,
  };

  const reducer = (state, { type, payload }) => {
    const _selectedIndex = state.notSelectedOptions.indexOf(
      state.selectedOptions[0],
    );
    const selectedIndex =
      _selectedIndex !== -1 ? _selectedIndex : state.focusedOptionIndex;

    switch (type) {
      case "SET_ORIGINAL_OPTIONS":
        return {
          ...state,
          originalOptions: payload.data,
          selectedOptions: state.values.map(value =>
            payload.data.find(option => option.value === value),
          ),
          focusedOptionIndex: !isMulti
            ? selectedIndex
            : state.focusedOptionIndex,
        };

      case "SET_NOT_SELECTED_OPTIONS":
        return {
          ...state,
          notSelectedOptions: isMulti
            ? payload.data.filter(
                option => !state.values.includes(option.value),
              )
            : payload.data,
          filteredOptions: isMulti
            ? payload.data.filter(
                option => !state.values.includes(option.value),
              )
            : payload.data,
          focusedOptionIndex: !isMulti
            ? selectedIndex
            : state.focusedOptionIndex,
        };

      case "SET_VALUES":
        return {
          ...state,
          values: payload.data,
          selectedOptions: payload.data.map(value =>
            state.originalOptions.find(option => option.value === value),
          ),
          notSelectedOptions: isMulti
            ? state.notSelectedOptions.filter(
                option => !payload.data.includes(option.value),
              )
            : state.notSelectedOptions,
          focusedOptionIndex: !isMulti
            ? selectedIndex
            : state.focusedOptionIndex,
        };

      case "SET_INPUT_VALUE":
        return {
          ...state,
          inputValue: payload.data,
          filteredOptions: isAsync
            ? state.notSelectedOptions
            : filteredBy(state.notSelectedOptions, payload.data),
        };

      case "SET_FOCUSEDOPTION_INDEX":
        return {
          ...state,
          focusedOptionIndex: payload.data,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("%c state", "color: #00bf00", state);

  const {
    values,
    selectedOptions,
    filteredOptions,
    inputValue,
    focusedOptionIndex,
  } = state;

  const setOriginalOptions = useCallback(
    data =>
      dispatch({
        type: "SET_ORIGINAL_OPTIONS",
        payload: { data },
      }),
    [],
  );

  const setValues = useCallback(
    data =>
      dispatch({
        type: "SET_VALUES",
        payload: { data },
      }),
    [],
  );

  const setNotSelectedOptions = useCallback(
    data =>
      dispatch({
        type: "SET_NOT_SELECTED_OPTIONS",
        payload: { data },
      }),
    [],
  );

  const setInputValue = useCallback(
    data =>
      dispatch({
        type: "SET_INPUT_VALUE",
        payload: { data },
      }),
    [],
  );

  const setFocusedOptionIndex = useCallback(
    data =>
      dispatch({
        type: "SET_FOCUSEDOPTION_INDEX",
        payload: { data },
      }),
    [],
  );

  // States
  const [listBoxInputValue, setListBoxInputValue] = useState("");
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);

  // Functions needed before useEffect
  const focusSelectedOption = useCallback(() => {
    const selectedIndex = options.indexOf(selectedOptions[0]);

    if (selectedIndex !== -1) setFocusedOptionIndex(selectedIndex);
  }, [options, selectedOptions, setFocusedOptionIndex]);

  const debouncedResetListBoxInputvalue = useConstant(() =>
    debounce(() => setListBoxInputValue(""), 700),
  );

  // Effects
  useEffect(() => {
    if (!isMulti) {
      onChange(values[0] || "");
    } else {
      onChange(values);
    }
  }, [isMulti, onChange, values]);

  useEffect(() => {
    setNotSelectedOptions(options);
  }, [setNotSelectedOptions, options]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollToItem(focusedOptionIndex);
  }, [isOpen, focusedOptionIndex]);

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
  }, [
    isListBox,
    options,
    filteredBy,
    setValues,
    isOpen,
    listBoxInputValue,
    setFocusedOptionIndex,
  ]);

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
        // TODO: find a way to handle it better with single inputValue
        if (isListBox) {
          setListBoxInputValue(event.currentTarget.value);
          debouncedResetListBoxInputvalue();

          return;
        }

        if (inputIsHidden) setInputIsHidden(false);
        if (focusedOptionIndex !== 0) setFocusedOptionIndex(0);

        if (isAsync) {
          if (isOpen) setIsOpen(false);
        } else {
          if (!isOpen) setIsOpen(true);
        }

        setInputValue(event.currentTarget.value);
      },
      onFocus: () => {
        if (!isFocused) setIsFocused(true);
        if (inputIsHidden) setInputIsHidden(false);
      },
      onKeyDown: event => {
        if (event.key === "ArrowDown") {
          if (inputIsHidden) setInputIsHidden(false);

          if (!isOpen) {
            setIsOpen(true);
            focusOption(0);

            return;
          }

          if (filteredOptions && filteredOptions.length) {
            const count = filteredOptions.length;
            const nextIndex = (focusedOptionIndex + 1) % count;
            setFocusedOptionIndex(nextIndex);
          }
        }

        if (event.key === "ArrowUp") {
          if (inputIsHidden) setInputIsHidden(false);

          if (!isOpen) {
            setIsOpen(true);
            focusOption(filteredOptions.length - 1);

            return;
          }

          if (filteredOptions.length) {
            const count = filteredOptions.length;
            const nextIndex = (focusedOptionIndex - 1 + count) % count;
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
      if (values.includes(option.value)) return;

      setValues([...values, option.value]);
    }
  };

  const removeLastSelectedValue = () => {
    if (!isMulti) {
      setValues([]);
    } else {
      if (values.length) setValues(values.slice(0, values.length - 1));
    }
  };

  const removeSelectedValue = value => {
    setValues(values.filter(oldValue => oldValue !== value));

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
    setOriginalOptions,
    setIsOpen,
  };
};
