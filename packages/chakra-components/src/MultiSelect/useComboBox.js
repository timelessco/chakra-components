import { useEffect, useRef, useCallback, useReducer } from "react";
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

  /**
   * Check if the provided initial value/values are valid against the given options.
   */
  const isValuesValid = values =>
    options.find(option => option.value === values);

  /**
   * Warn users on the value provided being invalid.
   */
  const invalidValueWarning = value => {
    console.warn(`Provided value "${value}" is not valid`);
  };

  /**
   * Initial Values should be converted to an array if a value is given for basic & listbox
   */
  let _initialValues = [];

  if (initialValues !== undefined && initialValues !== null) {
    /**
     * Single Select - Accepts only string/number.
     */
    if (!isMulti) {
      if (!Array.isArray(initialValues) && isValuesValid(initialValues)) {
        _initialValues = [initialValues];
      } else {
        invalidValueWarning(initialValues);
      }
    } else {
      /**
       * Multi Select - Accepts only an array.
       */
      if (Array.isArray(initialValues)) {
        _initialValues = initialValues;
      } else {
        invalidValueWarning(initialValues);
      }
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
    listBoxInputValue: "",
    focusedOptionIndex: 0,
    isInputHidden: false,
    isFocused: false,
    isOpen: false,
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

      case "SET_LISTBOXINPUT_VALUE":
        return {
          ...state,
          listBoxInputValue: payload.data,
        };

      case "SET_FOCUSEDOPTION_INDEX":
        return {
          ...state,
          focusedOptionIndex: payload.data,
        };

      case "SET_IS_INPUT_HIDDEN":
        return {
          ...state,
          isInputHidden: payload.data,
        };

      case "SET_IS_FOCUSED":
        return {
          ...state,
          isFocused: payload.data,
        };

      case "SET_IS_OPEN":
        return {
          ...state,
          isOpen: payload.data,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    values,
    selectedOptions,
    filteredOptions,
    inputValue,
    listBoxInputValue,
    focusedOptionIndex,
    isFocused,
    isOpen,
    isInputHidden,
  } = state;

  const useDispatchCallback = type =>
    useCallback(data => dispatch({ type, payload: { data } }), [type]);

  const setOriginalOptions = useDispatchCallback("SET_ORIGINAL_OPTIONS");
  const setValues = useDispatchCallback("SET_VALUES");
  const setNotSelectedOptions = useDispatchCallback("SET_NOT_SELECTED_OPTIONS");
  const setInputValue = useDispatchCallback("SET_INPUT_VALUE");
  const setFocusedOptionIndex = useDispatchCallback("SET_FOCUSEDOPTION_INDEX");
  const setListBoxInputValue = useDispatchCallback("SET_LISTBOXINPUT_VALUE");
  const setIsInputHidden = useDispatchCallback("SET_IS_INPUT_HIDDEN");
  const setIsFocused = useDispatchCallback("SET_IS_FOCUSED");
  const setIsOpen = useDispatchCallback("SET_IS_OPEN");

  const debouncedResetListBoxInputvalue = useConstant(() =>
    debounce(() => setListBoxInputValue(""), 700),
  );

  // Effects
  useEffect(() => {
    setNotSelectedOptions(options);
  }, [setNotSelectedOptions, options]);

  useEffect(() => {
    if (!isMulti) {
      onChange(values[0] || "");
    } else {
      onChange(values);
    }
  }, [isMulti, onChange, values]);

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
        if (isInputHidden) setIsInputHidden(false);

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
          // ? Separate InputValue state is essential for selecting option as we type
          setListBoxInputValue(event.currentTarget.value);
          debouncedResetListBoxInputvalue();

          return;
        }

        if (isInputHidden) setIsInputHidden(false);
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
        if (isInputHidden) setIsInputHidden(false);
      },
      onKeyDown: event => {
        if (event.key === "ArrowDown") {
          if (isInputHidden) setIsInputHidden(false);

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
          if (isInputHidden) setIsInputHidden(false);

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
            if (isInputHidden) setIsInputHidden(false);

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
      if (!isInputHidden) setIsInputHidden(true);

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
        const selectedIndex = options.indexOf(selectedOptions[0]);

        if (selectedIndex !== -1) setFocusedOptionIndex(selectedIndex);
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
    isInputHidden,
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
