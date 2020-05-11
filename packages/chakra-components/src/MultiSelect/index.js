import React, {
  forwardRef,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Flex,
  Avatar,
  Box,
  PseudoBox,
  Icon,
  Tag,
  TagLabel,
  TagCloseButton,
  useTheme,
  useColorMode,
} from "@chakra-ui/core";
import { useForkRef, cleanChildren } from "@chakra-ui/core/dist/utils";
import Popper from "@chakra-ui/core/dist/Popper";
import { useMultiSelectContext } from "./useMultiSelectContext";
import { FixedSizeList as List } from "react-window";
import AutosizeInput from "react-input-autosize";

import {
  useMultiSelectStyle,
  useMultiSelectListStyle,
  useMultiSelectOptionStyle,
  useMultiSelectInputStyle,
} from "./styles";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MultiSelectContext = createContext();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelect = forwardRef(
  (
    {
      options,
      id,
      name,
      value: initialValues,
      onChange,
      isMulti,
      focusBorderColor = "blue.500",
      errorBorderColor = "red.500",
      children,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [inputIsHidden, setInputIsHidden] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);

    let _initialValues = [];

    if (initialValues) {
      if (typeof initialValue === "string" || initialValues instanceof String) {
        _initialValues = [initialValues];
      } else if (Array.isArray(initialValues)) {
        _initialValues = initialValues;
      }
    }

    const [values, setValues] = useState(_initialValues);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [notSelectedOptions, setNotSelectedOptions] = useState(options);
    const [filteredOptions, setFilteredOptions] = useState(notSelectedOptions);

    const multiSelectWrapperRef = useRef(null);
    const multiSelectRef = useRef(null);
    const inputRef = useRef(null);
    const popperRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
      setSelectedOptions(
        options.filter(option => values.includes(option.value)),
      );
    }, [options, values]);

    useEffect(() => {
      if (isMulti) {
        setNotSelectedOptions(
          options.filter(option => !values.includes(option.value)),
        );
      }
    }, [isMulti, options, values]);

    const filter = (options, input) => {
      if (input) {
        return options.filter(option =>
          option.label.toLowerCase().includes(input.toLowerCase()),
        );
      } else {
        return options;
      }
    };

    useEffect(() => {
      setFilteredOptions(filter(notSelectedOptions, inputValue));
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

    const handleOnClick = e => {
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
    };

    const context = {
      id,
      name,
      options,
      values,
      setValues,
      onChange,
      multiSelectRef,
      multiSelectWrapperRef,
      isMulti,
      inputRef,
      setIsFocused,
      isFocused,
      isOpen,
      setIsOpen,
      popperRef,
      inputValue,
      setInputValue,
      inputIsHidden,
      setInputIsHidden,
      filteredOptions,
      setFilteredOptions,
      listRef,
      focusedOptionIndex,
      setFocusedOptionIndex,
      selectedOptions,
    };

    const styleProps = useMultiSelectStyle({
      isFocused,
      focusBorderColor,
      errorBorderColor,
    });

    const _multiSelectRef = useForkRef(multiSelectRef, ref);

    const validChildren = cleanChildren(children);

    const InputGroup = validChildren.find(
      child => child.type === MultiSelectInputGroup,
    );
    const RightElements = validChildren.find(
      child => child.type === MultiSelectRightElements,
    );
    const List = validChildren.find(child => child.type === MultiSelectList);

    return (
      <MultiSelectContext.Provider value={context}>
        <PseudoBox pos="relative">
          <PseudoBox
            ref={_multiSelectRef}
            tabIndex={-1}
            onClick={handleOnClick}
            {...styleProps}
            {...rest}
          >
            {InputGroup || <MultiSelectInputGroup />}
            {RightElements || <MultiSelectRightElements />}
          </PseudoBox>
          {List || <MultiSelectList />}
          <MultiSelectHiddenInput />
        </PseudoBox>
      </MultiSelectContext.Provider>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInputGroup = ({ children, ...props }) => {
  const validChildren = cleanChildren(children);

  const SelectedOption = validChildren.find(
    child => child.type === MultiSelectSelectedOption,
  );
  const Placeholder = validChildren.find(
    child => child.type === MultiSelectPlaceholder,
  );
  const Input = validChildren.find(child => child.type === MultiSelectInput);

  return (
    <PseudoBox
      position="relative"
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      flex=" 1 1 0%"
      px={2}
      overflow="hidden"
      {...props}
    >
      {SelectedOption || <MultiSelectSelectedOption />}
      {Placeholder || <MultiSelectPlaceholder />}
      {Input || <MultiSelectInput />}
    </PseudoBox>
  );
};

MultiSelectInputGroup.displayName = "MultiSelectInputGroup";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DefaultMultiSelectOptions = forwardRef(
  ({ selectedOptions, onClick, ...props }, ref) => {
    return (
      <>
        {selectedOptions.map((selectedOption, i) => (
          <Box
            key={`i-${i}`}
            ref={ref}
            display="flex"
            alignItems="center"
            justifyContent="center"
            m="2px"
            {...props}
          >
            <Tag size="md" variant="solid" variantColor="blue">
              <TagLabel>{selectedOption.label}</TagLabel>
              <TagCloseButton
                tabIndex={-1}
                onClick={e => onClick(e, selectedOption.value)}
              />
            </Tag>
          </Box>
        ))}
      </>
    );
  },
);

DefaultMultiSelectOptions.displayName = "DefaultMultiSelectOptions";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectSelectedOption = ({ children, ...props }) => {
  const {
    isMulti,
    inputValue,
    isFocused,
    inputRef,
    setValues,
    selectedOptions,
  } = useMultiSelectContext();

  const handleOnClick = (event, value) => {
    event.stopPropagation();
    setValues(oldValues =>
      oldValues.filter(oldValue => !oldValue.includes(value)),
    );

    if (!isFocused) {
      inputRef.current.focus();
    }
  };

  if (isMulti) {
    return (
      <>
        {typeof children === "function" ? (
          children({
            selectedOptions: selectedOptions,
            onClick: handleOnClick,
          })
        ) : (
          <DefaultMultiSelectOptions
            selectedOptions={selectedOptions}
            onClick={handleOnClick}
          />
        )}
      </>
    );
  }

  if (inputValue) {
    return null;
  }

  if (selectedOptions.length) {
    return (
      <PseudoBox
        position="absolute"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        top="50%"
        transform="translateY(-50%)"
        mx="2px"
        maxW="calc(100% - 8px)"
        {...props}
      >
        {typeof children === "function"
          ? children({
              selectedOption: selectedOptions[0],
            })
          : selectedOptions[0].label}
      </PseudoBox>
    );
  }

  return null;
};

MultiSelectSelectedOption.displayName = "MultiSelectSelectedOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectPlaceholder = props => {
  const { values, inputValue } = useMultiSelectContext();

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const placeholderColor = {
    light: theme.colors.gray[400],
    dark: theme.colors.whiteAlpha[400],
  };

  if (!values.length) {
    return inputValue ? null : (
      <PseudoBox
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        mx="2px"
        color={placeholderColor[colorMode]}
        {...props}
      >
        Select One...
      </PseudoBox>
    );
  }

  return null;
};

MultiSelectPlaceholder.displayName = "MultiSelectPlaceholder";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInput = forwardRef(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      isReadOnly,
      isDisabled,
      isInvalid,
      isRequired,
      ...props
    },
    ref,
  ) => {
    const {
      inputRef,
      isFocused,
      setIsFocused,
      isOpen,
      setIsOpen,
      multiSelectRef,
      popperRef,
      inputValue,
      setInputValue,
      inputIsHidden,
      setInputIsHidden,
      filteredOptions,
      focusedOptionIndex,
      setFocusedOptionIndex,
      isMulti,
      values,
      setValues,
    } = useMultiSelectContext();

    // const formControl = useFormControl(props);
    const _inputRef = useForkRef(inputRef, ref);

    const handleOnChange = event => {
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
    };

    const handleOnFocus = event => {
      if (!isFocused) {
        setIsFocused(true);
      }

      if (inputIsHidden) {
        setInputIsHidden(false);
      }
    };

    const handleOnKeyDown = event => {
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
    };

    const handleOnBlur = event => {
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
    };

    const ariaAttributes = {
      "aria-autocomplete": "list",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    };

    const { inputWrapperStyle, inputStyle } = useMultiSelectInputStyle({
      isDisabled,
      inputIsHidden,
    });

    return (
      <PseudoBox {...inputWrapperStyle}>
        <AutosizeInput
          type="text"
          inputRef={_inputRef}
          disabled={isDisabled}
          value={inputValue}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyDown={handleOnKeyDown}
          inputStyle={inputStyle}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          {...ariaAttributes}
          {...props}
        />
      </PseudoBox>
    );
  },
);

MultiSelectInput.displayName = "MultiSelectInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectOption = forwardRef(({ index, style, ...rest }, ref) => {
  const {
    values,
    setValues,
    isOpen,
    setIsOpen,
    setInputValue,
    inputIsHidden,
    setInputIsHidden,
    isMulti,
    filteredOptions,
    focusedOptionIndex,
    setFocusedOptionIndex,
  } = useMultiSelectContext();

  const option = filteredOptions[index];
  const selected = option ? values.includes(option.value) : false;
  const focused = option ? focusedOptionIndex === index : false;
  const disabled = option ? option.disabled : false;

  const handleOnClick = event => {
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
  };

  const handleOnMouseEnter = event => {
    if (disabled) {
      return;
    }

    setFocusedOptionIndex(index);
  };

  const styleProps = useMultiSelectOptionStyle({ selected, focused, disabled });

  if (!filteredOptions.length) {
    return (
      <PseudoBox
        ref={ref}
        style={style}
        tabIndex={-1}
        {...styleProps}
        _active={{
          bg: "transparent",
        }}
        {...rest}
      >
        No results found...
      </PseudoBox>
    );
  }

  return (
    <PseudoBox
      ref={ref}
      style={style}
      tabIndex={-1}
      onClick={handleOnClick}
      onMouseEnter={handleOnMouseEnter}
      {...styleProps}
      {...rest}
    >
      {option.label}
    </PseudoBox>
  );
});

MultiSelectOption.displayName = "MultiSelectOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectList = forwardRef(
  (
    { placement, skid, gutter, itemHeight = 40, pageSize = 10, ...props },
    ref,
  ) => {
    const {
      multiSelectRef,
      filteredOptions,
      isOpen,
      popperRef,
      listRef,
    } = useMultiSelectContext();

    const popperModifiers = {
      hide: {
        enabled: false,
      },
      preventOverflow: {
        enabled: false,
      },
      offset: {
        enabled: true,
        offset: `${skid}, ${gutter}`,
      },
    };

    const _popperRef = useForkRef(popperRef, ref);

    const height =
      Math.max(Math.min(pageSize, filteredOptions.length), 1) * itemHeight;
    const styleProps = useMultiSelectListStyle();

    return (
      <Popper
        ref={_popperRef}
        usePortal={false}
        anchorEl={multiSelectRef.current || 1}
        isOpen={isOpen}
        placement={placement}
        modifiers={popperModifiers}
        {...styleProps}
        {...props}
      >
        <List
          ref={listRef}
          itemSize={itemHeight}
          itemCount={filteredOptions.length || 1}
          height={height}
          {...props}
        >
          {MultiSelectOption}
        </List>
      </Popper>
    );
  },
);

MultiSelectList.displayName = "MultiSelectList";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectRightAddons = forwardRef(({ children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="7px"
      {...props}
    >
      {children}
    </Box>
  );
});

MultiSelectRightAddons.displayName = "MultiSelectRightAddons";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectRightElements = props => {
  const {
    values,
    setValues,
    isFocused,
    inputRef,
    isOpen,
    setIsOpen,
  } = useMultiSelectContext();

  const handleOnClick = event => {
    event.stopPropagation();
    setValues([]);

    if (isOpen) {
      setIsOpen(false);
    }

    if (!isFocused) {
      inputRef.current.focus();
    }
  };

  return (
    <PseudoBox
      display="flex"
      alignItems="center"
      alignSelf="stretch"
      flexShrink="0"
      {...props}
    >
      {!!values.length && (
        <MultiSelectRightAddons onClick={handleOnClick}>
          <Icon name="close" fontSize="0.75rem" />
        </MultiSelectRightAddons>
      )}
      <MultiSelectRightAddons>
        <Icon name="chevron-down" fontSize="1.5rem" />
      </MultiSelectRightAddons>
    </PseudoBox>
  );
};

MultiSelectRightElements.displayName = "MultiSelectRightElements";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectHiddenInput = props => {
  const { name, isDisabled, isMulti, values } = useMultiSelectContext();

  if (!name || isDisabled) {
    return null;
  }

  if (!isMulti) {
    const value = values[0] ? values[0] : "";

    return <input type="hidden" name={name} value={value} {...props} />;
  } else {
    const input =
      values.length > 0 ? (
        values.map((value, i) => (
          <input key={`i-${i}`} type="hidden" name={name} value={value} />
        ))
      ) : (
        <input type="hidden" name={name} />
      );

    return <div>{input}</div>;
  }
};

MultiSelectHiddenInput.displayName = "MultiSelectHiddenInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  MultiSelect,
  MultiSelectInputGroup,
  MultiSelectRightElements,
  MultiSelectList,
  MultiSelectSelectedOption,
  MultiSelectPlaceholder,
  MultiSelectInput,
};
