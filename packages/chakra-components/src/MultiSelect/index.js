import React, { forwardRef, createContext, useEffect, useRef } from "react";
import {
  Box,
  PseudoBox,
  Icon,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  useTheme,
  useColorMode,
} from "@chakra-ui/core";
import { useForkRef } from "@chakra-ui/core/dist/utils";
import Popper from "@chakra-ui/core/dist/Popper";
import { useMultiSelectContext } from "./useMultiSelectContext";
import { FixedSizeList as List } from "react-window";
import AutosizeInput from "react-input-autosize";
import { useComboBox } from "./useComboBox";
import debounce from "lodash.debounce";
import { useConstant } from "./useConstant";
import { useAsyncFetching } from "./useAsyncFetching";

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
      defaultOptions,
      cacheOptions,
      value,
      onChange,
      filteredBy,
      isListBox,
      isMulti,
      isAsync,
      loadOptions = null,
      placement,
      skid,
      gutter,
      itemHeight = 40,
      pageSize = 10,
      id,
      name,
      placeholder = "Select one...",
      renderCustomPlaceholder,
      renderCustomSelectedOption,
      renderCustomInput,
      renderCustomCloseButton,
      renderCustomSpinner,
      renderCustomToggleIcon,
      renderCustomOption,
      renderCustomNoOption,
      ...rest
    },
    ref,
  ) => {
    const cachedOptions = useRef({});

    const {
      state: {
        data: loadedOptions,
        initiated: isLoading,
        success: isAsyncSuccess,
        failed: isAsyncFailure,
        errorMessage: asyncErrorMessage,
      },
      onEmptyInputValue,
      setCachedOptions,
      onAsyncStart: setIsLoading,
      onAsyncSuccess,
      onAsyncEnd: setIsLoaded,
      onAsyncFailure,
    } = useAsyncFetching();

    const {
      values,
      isFocused,
      isOpen,
      inputValue,
      isInputHidden,
      focusedOptionIndex,
      selectedOptions,
      filteredOptions,
      multiSelectRef,
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
    } = useComboBox({
      options: isAsync ? loadedOptions : options,
      value,
      onChange,
      filteredBy,
      isListBox,
      isMulti,
      isAsync,
    });

    const debouncedLoadOptions = useConstant(() =>
      debounce(inputValue => {
        if (!inputValue) {
          setIsLoaded();
          return;
        }

        loadOptions(
          inputValue,
          options => {
            if (cacheOptions) cachedOptions.current[inputValue] = options;
            onAsyncSuccess(options);
          },
          errorMessage => {
            if (cacheOptions)
              cachedOptions.current[inputValue] = [{ label: errorMessage }];
            onAsyncFailure(errorMessage);
          },
        );
      }, 700),
    );

    useEffect(() => {
      if (isAsync) {
        if (!inputValue) {
          debouncedLoadOptions(inputValue);
          if (cacheOptions && cachedOptions.current.default) {
            onEmptyInputValue(cachedOptions.current.default);
          } else {
            const cacheAndSetOptions = (options, status) => {
              if (cacheOptions) {
                cachedOptions.current["default"] = {};
                if (status) {
                  cachedOptions.current["default"] = options;
                } else {
                  cachedOptions.current["default"] = [{ label: options }];
                }
              }
              onEmptyInputValue(options);
              if (!originalOptions.length) setOriginalOptions(options);
            };

            if (typeof defaultOptions === "boolean" && defaultOptions) {
              loadOptions(
                "a",
                options => cacheAndSetOptions(options, true),
                errorMessage => cacheAndSetOptions(errorMessage, false),
              );
            }

            if (defaultOptions && defaultOptions.length) {
              cacheAndSetOptions(defaultOptions);
            }
          }
        } else {
          if (cacheOptions && cachedOptions.current[inputValue]) {
            setCachedOptions(cachedOptions.current[inputValue]);
            setIsOpen(true);
          } else {
            setIsLoading();
            debouncedLoadOptions(inputValue);
          }
        }
      }
    }, [
      options,
      originalOptions,
      isAsync,
      defaultOptions,
      loadOptions,
      onEmptyInputValue,
      cacheOptions,
      setCachedOptions,
      setIsLoading,
      debouncedLoadOptions,
      inputValue,
      setOriginalOptions,
      setIsOpen,
    ]);

    useEffect(() => {
      if (isAsync) {
        if (isAsyncSuccess || isAsyncFailure) {
          setIsOpen(true);
        }
      }
    }, [isAsync, isAsyncSuccess, isAsyncFailure, setIsOpen]);

    const context = {
      id,
      name,
      options,
      onChange,
      isMulti,
      isListBox,
      placeholder,
      renderCustomPlaceholder,
      renderCustomSelectedOption,
      renderCustomInput,
      renderCustomCloseButton,
      renderCustomSpinner,
      renderCustomToggleIcon,
      renderCustomOption,
      renderCustomNoOption,
      values,
      isFocused,
      isOpen,
      inputValue,
      isInputHidden,
      focusedOptionIndex,
      selectedOptions,
      filteredOptions,
      multiSelectRef,
      popperRef,
      listRef,
      getWrapperProps,
      getInputProps,
      getOptionProps,
      removeSelectedValue,
      removeAllSelectedValues,
      isLoading,
      isAsyncFailure,
      asyncErrorMessage,
    };

    const styleProps = useMultiSelectStyle({
      isFocused,
      focusBorderColor: "blue.500",
      errorBorderColor: "red.500",
    });

    const _multiSelectRef = useForkRef(multiSelectRef, ref);

    return (
      <MultiSelectContext.Provider value={context}>
        <PseudoBox pos="relative">
          <PseudoBox
            ref={_multiSelectRef}
            {...getWrapperProps()}
            {...styleProps}
            {...rest}
          >
            <MultiSelectInputGroup />
            <MultiSelectRightElements />
          </PseudoBox>
          <MultiSelectList
            {...{ placement, skid, gutter, itemHeight, pageSize }}
          />
          <MultiSelectHiddenInput />
        </PseudoBox>
      </MultiSelectContext.Provider>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectSelectedOption = ({ children, ...props }) => {
  const {
    isMulti,
    inputValue,
    selectedOptions,
    removeSelectedValue,
  } = useMultiSelectContext();

  const handleOnClick = (event, value) => {
    event.stopPropagation();
    removeSelectedValue(value);
  };

  if (selectedOptions.length) {
    if (isMulti) {
      return (
        <>
          {selectedOptions.map((selectedOption, i) => (
            <Box
              key={`i-${i}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              m="2px"
              {...props}
            >
              {children({
                selectedOption,
                handleOnClick: e => handleOnClick(e, selectedOption.value),
              })}
            </Box>
          ))}
        </>
      );
    }

    if (inputValue) {
      return null;
    }

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
        {children({ selectedOption: selectedOptions[0] })}
      </PseudoBox>
    );
  }

  return null;
};

MultiSelectSelectedOption.displayName = "MultiSelectSelectedOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectPlaceholder = ({ children, ...props }) => {
  const { values, inputValue } = useMultiSelectContext();

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const placeholderColor = {
    light: theme.colors.gray[400],
    dark: theme.colors.whiteAlpha[400],
  };

  const placeholderProps = { values, inputValue };

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
        {typeof children === "function" ? children(placeholderProps) : children}
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
    const { isInputHidden, getInputProps, isListBox } = useMultiSelectContext();

    const ariaAttributes = {
      "aria-autocomplete": "list",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    };

    const { inputWrapperStyle, inputStyle } = useMultiSelectInputStyle({
      isDisabled,
      isInputHidden,
      isListBox,
    });

    return (
      <PseudoBox {...inputWrapperStyle} {...props}>
        <AutosizeInput
          type="text"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          inputStyle={inputStyle}
          disabled={isDisabled}
          {...ariaAttributes}
          {...getInputProps()}
        />
      </PseudoBox>
    );
  },
);

MultiSelectInput.displayName = "MultiSelectInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInputGroup = props => {
  const {
    isMulti,
    placeholder,
    renderCustomPlaceholder,
    renderCustomSelectedOption,
    renderCustomInput,
  } = useMultiSelectContext();

  const renderSelectedOption = () => {
    if (isMulti) {
      return (
        <MultiSelectSelectedOption>
          {({ selectedOption, handleOnClick }) => (
            <Tag size="md" variant="solid" variantColor="blue">
              <TagLabel>{selectedOption.label}</TagLabel>
              <TagCloseButton tabIndex={-1} onClick={handleOnClick} />
            </Tag>
          )}
        </MultiSelectSelectedOption>
      );
    }

    return (
      <MultiSelectSelectedOption>
        {({ selectedOption }) => selectedOption.label}
      </MultiSelectSelectedOption>
    );
  };

  return (
    <PseudoBox
      position="relative"
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      flex=" 1 1 0%"
      px={2}
      overflow="hidden"
      minHeight="2.5rem"
      {...props}
    >
      {renderCustomSelectedOption || renderSelectedOption()}
      {renderCustomPlaceholder || (
        <MultiSelectPlaceholder>{placeholder}</MultiSelectPlaceholder>
      )}
      {renderCustomInput || <MultiSelectInput />}
    </PseudoBox>
  );
};

MultiSelectInputGroup.displayName = "MultiSelectInputGroup";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectRightAddons = forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="2.5rem"
      width="2.5rem"
      p="7px"
      {...props}
    />
  );
});

MultiSelectRightAddons.displayName = "MultiSelectRightAddons";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectCloseButton = props => {
  const {
    values,
    isLoading,
    renderCustomCloseButton,
    removeAllSelectedValues,
  } = useMultiSelectContext();

  const handleOnClick = event => {
    event.stopPropagation();
    removeAllSelectedValues();
  };

  if (values.length && !isLoading) {
    return (
      <MultiSelectRightAddons onClick={handleOnClick} {...props}>
        {renderCustomCloseButton || <Icon name="close" fontSize="0.8rem" />}
      </MultiSelectRightAddons>
    );
  }

  return null;
};

MultiSelectCloseButton.displayName = "MultiSelectCloseButton";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectLoader = props => {
  const { isLoading, renderCustomSpinner } = useMultiSelectContext();

  if (isLoading) {
    return (
      <MultiSelectRightAddons {...props}>
        {renderCustomSpinner || <Spinner size="sm" />}
      </MultiSelectRightAddons>
    );
  }

  return null;
};

MultiSelectLoader.displayName = "MultiSelectLoader";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectToggleIcon = props => {
  const { renderCustomToggleIcon } = useMultiSelectContext();

  return (
    <MultiSelectRightAddons {...props}>
      {renderCustomToggleIcon || <Icon name="chevron-down" fontSize="1.5rem" />}
    </MultiSelectRightAddons>
  );
};

MultiSelectToggleIcon.displayName = "MultiSelectToggleIcon";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectRightElements = props => {
  return (
    <PseudoBox
      display="flex"
      alignItems="center"
      alignSelf="stretch"
      flexShrink="0"
      {...props}
    >
      <MultiSelectLoader />
      <MultiSelectCloseButton />
      <MultiSelectToggleIcon />
    </PseudoBox>
  );
};

MultiSelectRightElements.displayName = "MultiSelectRightElements";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectOption = forwardRef(({ index, style }, ref) => {
  const {
    values,
    filteredOptions,
    focusedOptionIndex,
    renderCustomOption,
    renderCustomNoOption,
    getOptionProps: _getOptionProps,
    isAsyncFailure,
    asyncErrorMessage,
  } = useMultiSelectContext();

  const option = filteredOptions[index];
  const selected = option ? values.includes(option.value) : false;
  const focused = option ? focusedOptionIndex === index : false;
  const disabled = option ? option.disabled : false;

  const styleProps = useMultiSelectOptionStyle({
    selected,
    focused,
    disabled,
  });

  const getOptionProps = _getOptionProps({
    index,
    disabled,
    option,
    ref,
    style,
    tabIndex: -1,
    ...styleProps,
  });

  const getNoOptionProps = {
    ref,
    style,
    tabIndex: -1,
    ...styleProps,
    _active: {
      bg: "transparent",
    },
  };

  if (!filteredOptions.length) {
    if (renderCustomNoOption && typeof renderCustomNoOption === "function") {
      return renderCustomNoOption({ getNoOptionProps });
    }

    if (isAsyncFailure) {
      return <PseudoBox {...getNoOptionProps}>{asyncErrorMessage}</PseudoBox>;
    }

    return <PseudoBox {...getNoOptionProps}>No results found...</PseudoBox>;
  }

  if (renderCustomOption && typeof renderCustomOption === "function") {
    return renderCustomOption({
      option,
      selected,
      focused,
      disabled,
      options: filteredOptions,
      getOptionProps,
    });
  }

  return <PseudoBox {...getOptionProps}>{option.label}</PseudoBox>;
});

MultiSelectOption.displayName = "MultiSelectOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectList = forwardRef(
  ({ placement, skid, gutter, itemHeight, pageSize, ...props }, ref) => {
    const {
      popperRef,
      multiSelectRef,
      isOpen,
      listRef,
      filteredOptions,
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
  MultiSelectRightAddons,
  MultiSelectCloseButton,
  MultiSelectToggleIcon,
  MultiSelectOption,
};
