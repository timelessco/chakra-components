import { useState, useEffect, useRef } from "react";

export const useComboBox = ({ options, initialValues, isMulti }) => {
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const multiSelectRef = useRef(null);
  const popperRef = useRef(null);

  let _initialValues = [];

  if (initialValues) {
    if (typeof initialValues === "string" || initialValues instanceof String) {
      _initialValues = [initialValues];
    } else if (Array.isArray(initialValues)) {
      _initialValues = initialValues;
    }
  }

  const [values, setValues] = useState(_initialValues);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notSelectedOptions, setNotSelectedOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(notSelectedOptions);

  const defaultFilter = (options, input) => {
    if (input) {
      return options.filter(option =>
        option.label.toLowerCase().includes(input.toLowerCase()),
      );
    } else {
      return options;
    }
  };

  useEffect(() => {
    setSelectedOptions(
      values.map((value, i) => options.find(option => option.value === value)),
    );
  }, [options, values]);

  useEffect(() => {
    if (isMulti) {
      setNotSelectedOptions(
        options.filter(option => !values.includes(option.value)),
      );
    }
  }, [isMulti, options, values]);

  useEffect(() => {
    setFilteredOptions(defaultFilter(notSelectedOptions, inputValue));
  }, [notSelectedOptions, inputValue]);

  useEffect(() => {
    listRef.current && listRef.current.scrollToItem(focusedOptionIndex);
  }, [isOpen, focusedOptionIndex]);

  useEffect(() => {
    if (!isMulti) {
      const selectedOption = filteredOptions.find(
        option => option.value === values[0],
      );

      const selectedIndex = filteredOptions.indexOf(selectedOption);

      if (selectedIndex !== -1) {
        setFocusedOptionIndex(selectedIndex);
      }
    }
  }, [isMulti, filteredOptions, values]);

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

  const getInputProps = () => {
    return {
      onChange: event => {
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

            if (focusedOption.disabled) {
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

  return {
    values,
    setValues,
    isFocused,
    setIsFocused,
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    inputIsHidden,
    setInputIsHidden,
    focusedOptionIndex,
    setFocusedOptionIndex,
    selectedOptions,
    filteredOptions,
    setFilteredOptions,
    multiSelectRef,
    inputRef,
    popperRef,
    listRef,
    getWrapperProps,
    getInputProps,
  };
};
