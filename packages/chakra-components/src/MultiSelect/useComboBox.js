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
   * Initial Values should be converted to an array if a value is given for basic & listbox
   */
  const setInitialValues = (values, options) => {
    if (values !== undefined && values !== null) {
      /**
       * Single Select - Accepts only string/number.
       */
      if (!isMulti) {
        /**
         * Check if the provided initial value/values are valid against the given options.
         */
        const isValuesValid = options.some(option => option.value === values);

        if (!Array.isArray(values) && isValuesValid) {
          return [values];
        } else if (Array.isArray(values)) {
          /**
           * Allow only the valid values to be passed to the OriginalValues Array.
           * Invalid values are neglected.
           */
          let validValues = values.filter(value =>
            options.some(option => option.value === value),
          );

          return validValues;
        } else {
          return [];
        }
      } else {
        /**
         * Multi Select - Accepts only an array.
         */
        if (Array.isArray(values)) {
          /**
           * Allow only the valid values to be passed to the OriginalValues Array.
           * Invalid values are neglected.
           */
          let validValues = values.filter(value =>
            options.some(option => option.value === value),
          );

          return validValues;
        } else {
          return [];
        }
      }
    } else {
      return [];
    }
  };

  // Reducers
  const initialState = {
    values: setInitialValues(initialValues, options),
    originalValues: initialValues,
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
    switch (type) {
      case "SET_ORIGINAL_OPTIONS":
        const setOriginalValues = setInitialValues(
          state.originalValues,
          payload.data,
        );
        const setOriginalSelectedOptions = setOriginalValues.map(value =>
          payload.data.find(option => option.value === value),
        );
        const setOriginalOptionsIndex = payload.data.indexOf(
          setOriginalSelectedOptions[0],
        );

        return {
          ...state,
          values: setOriginalValues,
          originalOptions: payload.data,
          selectedOptions: setOriginalSelectedOptions,
          focusedOptionIndex: !isMulti
            ? setOriginalOptionsIndex !== -1
              ? setOriginalOptionsIndex
              : 0
            : 0,
        };

      case "SET_NOT_SELECTED_OPTIONS":
        /**
         * Selected Option should only be selected from Original Options.
         */
        const _originalSelectedOptions = state.values.map(value =>
          state.originalOptions.find(option => option.value === value),
        );

        /**
         * Get the selectedOptions from the newly fetched options.
         */
        const _payloadDataSelectedOptions = state.values.map(value =>
          payload.data.find(option => option.value === value),
        );

        /**
         * Set the index based on the newly fetched options.
         */
        const setNotSelectedOptionsIndex = payload.data.indexOf(
          _payloadDataSelectedOptions[0],
        );

        return {
          ...state,
          selectedOptions: _originalSelectedOptions,
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
            ? setNotSelectedOptionsIndex !== -1
              ? setNotSelectedOptionsIndex
              : 0
            : 0,
        };

      case "SET_VALUES":
        /**
         * Selected Option should only be selected from Original Options.
         */
        const _selectedOption = payload.data.map(value =>
          state.originalOptions.find(option => option.value === value),
        );

        /**
         * ?Note: indexOf only works with the same set of arrays.
         */
        const setValuesIndex = state.notSelectedOptions.indexOf(
          _selectedOption[0],
        );

        return {
          ...state,
          values: payload.data,
          selectedOptions: _selectedOption,
          notSelectedOptions: isMulti
            ? state.notSelectedOptions.filter(
                option => !payload.data.includes(option.value),
              )
            : state.notSelectedOptions,
          focusedOptionIndex: !isMulti
            ? setValuesIndex !== -1
              ? setValuesIndex
              : 0
            : 0,
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
    originalOptions,
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

  /**
   * Scroll to focusedOptionIndex when dropdown opens.
   */
  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollToItem(focusedOptionIndex);
    }
  }, [isOpen, focusedOptionIndex]);

  useEffect(() => {
    if (isListBox) {
      const optionsFiltered = filteredBy(options, listBoxInputValue)[0];
      const filteredIndex = options.indexOf(optionsFiltered);

      if (listBoxInputValue && filteredIndex !== -1) {
        if (!isOpen) {
          /**
           * Cannot set disabled values.
           */
          if (
            optionsFiltered.hasOwnProperty("disabled") &&
            optionsFiltered.disabled
          ) {
            return;
          }

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
          /**
           * When listBoxInputValue is empty and space bar is pressed, return.
           * It will be handled via onKeyDown handler
           */
          if (!listBoxInputValue && event.target.value === " ") {
            return;
          }

          // ? Separate InputValue state is essential for selecting option as we type
          setListBoxInputValue(event.currentTarget.value);
          debouncedResetListBoxInputvalue();

          return;
        }

        /**
         * When inputValue is empty and space bar is pressed, return.
         * It will be handled via onKeyDown handler
         */
        if (!inputValue && event.target.value === " ") {
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

        if (event.key === " ") {
          /**
           * When there is an inputValue/listBoxInputValue, return.
           * Space Bar will insert a space in the existing inputValue.
           */
          if (inputValue || listBoxInputValue) {
            return;
          }

          /**
           * When there is no inputValue.
           * If the dropdown is closed, show the input and open the dropdown.
           */
          if (!isOpen) {
            if (isInputHidden) setIsInputHidden(false);
            setIsOpen(true);
          }

          handleCurrentOptionSelection();
        }

        if (event.key === "Enter") {
          handleCurrentOptionSelection();
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
        const selectedIndex = originalOptions.indexOf(selectedOptions[0]);

        if (selectedIndex !== -1) setFocusedOptionIndex(selectedIndex);
      }
    } else {
      setFocusedOptionIndex(index);
    }
  };

  /**
   * If the dropdown is open, get the focusedOption.
   *
   * If the focusedOption is disabled, return.
   *
   * Reset the inputValue and hide the input.
   *
   * Select the Option and close the dropdown.
   */
  const handleCurrentOptionSelection = () => {
    if (isOpen) {
      if (filteredOptions.length) {
        const focusedOption = filteredOptions[focusedOptionIndex];

        if (
          focusedOption.hasOwnProperty("disabled") &&
          focusedOption.disabled
        ) {
          return;
        }

        if (!isInputHidden) setIsInputHidden(true);
        selectOption(focusedOption);
        setIsOpen(false);

        /**
         * You should not reset the input value before selectOption which introduces a bug.
         */
        setInputValue("");
      }
    }
  };

  /**
   * Debounce and reset the listboxInputValue.
   */
  const debouncedResetListBoxInputvalue = useConstant(() =>
    debounce(() => setListBoxInputValue(""), 700),
  );

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
    originalOptions,
    setOriginalOptions,
    setIsOpen,
  };
};
