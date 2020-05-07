import React, {
  forwardRef,
  cloneElement,
  useRef,
  createContext,
  useEffect,
  useState,
} from "react";
import {
  Box,
  PseudoBox,
  Icon,
  Input,
  InputRightElement,
  InputLeftElement,
  InputLeftAddon,
  InputRightAddon,
  useTheme,
  Spinner,
} from "@chakra-ui/core";
import Popper from "@chakra-ui/core/dist/Popper";
import matchSorter from "match-sorter";
import { FixedSizeList } from "react-window";
import { useForkRef, cleanChildren } from "@chakra-ui/core/dist/utils";
import { useComboBoxContext } from "./useComboBoxContext";
import { useComboBoxPopupContext } from "./useComboBoxPopupContext";
import useSelect from "./useSelect";
import splitProps from "./utils";

import { inputSizes } from "@chakra-ui/core/dist/Input/styles";
import { useComboBoxPopperStyle, useComboBoxOptionStyle } from "./styles";
import useAsyncFetching from "./useAsyncFetching";
import debounce from "./debounce";

/* =========================================================================
  ComboBoxContext
  ========================================================================== */

export const ComboBoxContext = createContext();
export const ComboBoxPopupContext = createContext();

/* =========================================================================
  ComboBox
  ========================================================================== */

const ComboBox = forwardRef(
  (
    {
      value,
      options,
      cacheOptions = [],
      onChange,
      multi = false,
      async,
      loadOptions = null, // Boolean to ind
      children,
      size = "md",
      enableGhost = "true",
      isListBox,
      ...props
    },
    ref,
  ) => {
    const reactWindowInstanceRef = useRef(null);
    const optionsRef = useRef(null);

    const {
      state: {
        data: asyncOptions,
        initiated: isAsyncInitiated,
        success: isAsyncSuccess,
        failed: isAsyncFailure,
        completedOnce: isAsyncCompletedOnce,
        errorMessage: asyncErrorMessage,
      },
      onAsyncStart,
      onAsyncSuccess,
      onAsyncFailure,
    } = useAsyncFetching(loadOptions);

    const [debounceState, setDebounceState] = useState(false);

    // Position can be top / center / end
    const scrollToIndex = (index, position) => {
      if (!reactWindowInstanceRef.current) {
        return;
      }
      reactWindowInstanceRef.current.scrollToItem(index, position);
    };

    const {
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
      inputRef,
      deselectIndex,
      setOpen,
    } = useSelect({
      isListBox,
      multi,
      cacheOptions,
      options: async ? asyncOptions : options,
      async,
      isAsyncSuccess,
      isAsyncCompletedOnce,
      value,
      onChange,
      scrollToIndex,
      optionsRef,
      filterFn: (options, value) =>
        matchSorter(options, value, { keys: ["label"] }),
    });

    const inputValue = getInputProps().value;

    useEffect(() => {
      if (
        loadOptions !== null &&
        inputValue &&
        selectedOption.value !== inputValue // Prevent refetch when selected
      ) {
        //TODO:
        // 1. Debounce need to be on hook
        // 2. Need a better way and encapsulate this
        // 3. Remove these 3 and call directly. Just written for clarity.

        // Callback when the actual fetch started
        const fetchStartCb = () => onAsyncStart(true);

        // Callback that is exposed outside
        const fetchCompleteCb = data => onAsyncSuccess(data);

        // Callback when fetch failed
        const fetchErrorCb = message => onAsyncFailure(message);

        debounce(
          inputValue,
          loadOptions,
          setDebounceState,
          fetchStartCb,
          fetchCompleteCb,
          fetchErrorCb,
          800,
        );
      }
    }, [inputValue]);

    const context = {
      multi,
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
      inputRef,
      optionsRef,
      reactWindowInstanceRef,
      enableGhost,
      isAsyncInitiated,
      isAsyncSuccess,
      isAsyncFailure,
      asyncErrorMessage,
      isInputDebouncing: debounceState,
      deselectIndex,
      isListBox,
      setOpen,
    };

    const { sizes } = useTheme();
    const height = inputSizes[size] && inputSizes[size]["height"];
    let pl = null;
    let pr = null;
    let right = null;
    const validChildren = cleanChildren(children);

    return (
      <ComboBoxContext.Provider value={context}>
        <Box display="flex" position="relative" ref={ref} {...props}>
          {validChildren.map(child => {
            if (child.type === ComboBoxLeftElement) {
              pl = height;

              return cloneElement(child, { size });
            }

            if (child.type === ComboBoxRightElement) {
              pr = height;

              return cloneElement(child, { size });
            }

            if (child.type === ComboBoxClearElement) {
              right = sizes[height];
              pr += height;

              return cloneElement(child, { size, right });
            }

            if (child.type === ComboBoxInput) {
              return cloneElement(child, {
                size,
                pl: child.props.pl || pl,
                pr: child.props.pr || pr,
              });
            }

            return cloneElement(child);
          })}
        </Box>
      </ComboBoxContext.Provider>
    );
  },
);

/* =========================================================================
  ComboBoxInput
  ========================================================================== */

const ComboBoxInput = forwardRef(
  ({ placeholder, renderSelectedOption, ...props }, ref) => {
    const {
      getInputProps,
      selectedOption,
      enableGhost,
      isOpen,
      isListBox,
    } = useComboBoxContext();
    const { value } = getInputProps();
    const ghostProps = splitProps(props);

    const _placeholder = () => {
      if (isListBox) {
        return undefined;
      }
      if (!enableGhost) {
        return placeholder;
      } else if (!value && !selectedOption.value) {
        return placeholder;
      } else {
        return undefined;
      }
    };

    // TODO: Ghost always get enabled when we don't type something
    // Also ghost get enabled when we typed something and set its value and the dropdown is closed
    // This is how use select handles that it sets the input value when we select an option
    const _enableGhost =
      (enableGhost &&
        selectedOption &&
        selectedOption.value &&
        (!value || (value && !isOpen))) ||
      isListBox;
    return (
      <>
        <Input
          cursor="default"
          placeholder={_placeholder()}
          {...getInputProps({ ref })}
          {...props}
          color={_enableGhost ? "transparent" : "inherit"}
          onClick={() => {
            console.log("clicked ");
          }}
        />

        {_enableGhost ? (
          renderSelectedOption && typeof renderSelectedOption === "function" ? (
            <ComboBoxSelectedGhost {...ghostProps}>
              {selectedOption.value
                ? renderSelectedOption(selectedOption)
                : _placeholder()}
            </ComboBoxSelectedGhost>
          ) : (
            <ComboBoxSelectedGhost {...ghostProps}>
              {selectedOption.value ? selectedOption.value : _placeholder()}
            </ComboBoxSelectedGhost>
          )
        ) : null}
      </>
    );
  },
);

/* =========================================================================
  ComboBoxSelectedGhost
  ========================================================================== */

const ComboBoxSelectedGhost = forwardRef(({ size, ...props }, ref) => {
  const { isListBox, isOpen, setOpen } = useComboBoxContext();

  const baseInputProps = inputSizes[size] && inputSizes[size];

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="0"
      left="1px"
      zIndex={2}
      ref={ref}
      width={isListBox ? "100%" : null}
      {...baseInputProps}
      {...props}
      onClick={() => setOpen(!isOpen)}
    />
  );
});

/* =========================================================================
  ComboBoxPopup
  ========================================================================== */
const ComboBoxPopup = forwardRef(
  (
    {
      placement,
      skid,
      gutter,
      itemHeight,
      pageSize,
      renderItem,
      renderOption,
      ...props
    },
    ref,
  ) => {
    // TODO: Reorganize this context, with the right props once the structure is confirmed

    const context = {
      renderItem, // Keeps the default root Psuedobox and styles. Just controls the inner element
      renderOption, // Gives the entire option itself
    };
    return (
      <ComboBoxPopupContext.Provider value={context}>
        <ComboBoxPopper placement={placement} skid={skid} gutter={gutter}>
          <ComboBoxList itemHeight={itemHeight} pageSize={pageSize}>
            <ComboBoxOption />
          </ComboBoxList>
        </ComboBoxPopper>
      </ComboBoxPopupContext.Provider>
    );
  },
);

/* =========================================================================
  ComboBoxPopper
  ========================================================================== */

const ComboBoxPopper = forwardRef(
  ({ placement, skid, gutter = 0, ...props }, ref) => {
    const {
      inputRef,
      optionsRef,
      isOpen,
      isInputDebouncing,
      isAsyncInitiated,
    } = useComboBoxContext();

    const popperModifiers = {
      preventOverflow: {
        enabled: true,
        boundariesElement: "viewport",
      },
      offset: {
        enabled: true,
        offset: `${skid}, ${gutter}`,
      },
    };

    const _optionsRef = useForkRef(optionsRef, ref);
    const styleProps = useComboBoxPopperStyle();

    // TODO: Need to prevent both list and popper from rendering
    if (isInputDebouncing || isAsyncInitiated) {
      return null;
    }

    return (
      <Popper
        usePortal={false}
        anchorEl={inputRef.current}
        ref={_optionsRef}
        isOpen={isOpen}
        placement={placement}
        modifiers={popperModifiers}
        {...styleProps}
        {...props}
      />
    );
  },
);

/* =========================================================================
  ComboBoxOption
  ========================================================================== */

const ComboBoxOption = forwardRef(({ index, style, data, ...rest }, ref) => {
  const {
    visibleOptions,
    highlightedOption,
    selectedOption,
    getOptionProps,
    isAsyncFailure,
    asyncErrorMessage,
  } = useComboBoxContext();

  const { renderItem, renderOption } = useComboBoxPopupContext();

  const option = visibleOptions[index];
  const highlighted = option === highlightedOption;
  const selected = option === selectedOption;
  const disabled = option ? option.disabled : false;

  const styleProps = useComboBoxOptionStyle({
    selected,
    highlighted,
    disabled,
  });

  if (!visibleOptions.length) {
    return (
      <PseudoBox ref={ref} style={style} {...styleProps} {...data}>
        {isAsyncFailure
          ? asyncErrorMessage
            ? asyncErrorMessage
            : "No results found"
          : null}
      </PseudoBox>
    );
  }

  // Controls the entire option box. Need to set the entire style for every case when using this
  if (renderOption && typeof renderOption === "function") {
    return renderOption({
      index,
      data,
      option,
      selected,
      highlighted,
      disabled,
      style, // to expose the basic style by react-window
      getOptionProps, // All
    });
  }

  // Controls just the inner Box element, used for rendering the option
  if (renderItem && typeof renderItem === "function") {
    return (
      <PseudoBox
        ref={ref}
        style={style}
        {...getOptionProps({
          index,
          option,
        })}
        {...styleProps}
        {...data}
      >
        {renderItem({
          index,
          data,
          option,
          selected,
          highlighted,
          disabled,
        })}
      </PseudoBox>
    );
  }

  // Default renderer
  return (
    <PseudoBox
      ref={ref}
      style={style}
      {...getOptionProps({
        index,
        option,
      })}
      {...styleProps}
      {...data}
    >
      {option.label}
    </PseudoBox>
  );
});

/* =========================================================================
  ComboBoxList
  ========================================================================== */

const ComboBoxList = forwardRef(
  ({ itemHeight = 40, pageSize = 10, children, ...props }, ref) => {
    const {
      reactWindowInstanceRef,
      visibleOptions,
      isAsyncInitiated,
      isInputDebouncing,
    } = useComboBoxContext();

    const height =
      Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;

    const _reactWindowInstanceRef = useForkRef(reactWindowInstanceRef, ref);

    if (isInputDebouncing || isAsyncInitiated) {
      return null;
    }

    return (
      <FixedSizeList
        ref={_reactWindowInstanceRef}
        height={height}
        itemCount={visibleOptions.length || 1}
        itemSize={itemHeight}
        itemData={children.props}
        {...props}
      >
        {children.type}
      </FixedSizeList>
    );
  },
);

/* =========================================================================
  ComboBoxRightElement
  ========================================================================== */

const ComboBoxRightElement = forwardRef((props, ref) => {
  const { isOpen } = useComboBoxContext();
  return (
    <InputRightElement
      ref={ref}
      children={
        !isOpen ? (
          <Icon name="chevron-down" fontSize="1.5rem" />
        ) : (
          <Icon name="chevron-up" fontSize="1.5rem" />
        )
      }
      pointerEvents="none"
      {...props}
    />
  );
});

/* =========================================================================
  ComboBoxLeftElement
  ========================================================================== */

const ComboBoxLeftElement = forwardRef((props, ref) => {
  return <InputLeftElement pointerEvents="none" ref={ref} {...props} />;
});

/* =========================================================================
  ComboBoxLeftAddon
  ========================================================================== */

const ComboBoxLeftAddon = forwardRef((props, ref) => {
  return <InputLeftAddon ref={ref} {...props} />;
});

/* =========================================================================
  ComboBoxLeftAddon
  ========================================================================== */

const ComboBoxRightAddon = forwardRef((props, ref) => {
  return <InputRightAddon ref={ref} {...props} />;
});

/* =========================================================================
  ComboBoxLeftElement
  ========================================================================== */

const ComboBoxClearElement = forwardRef((props, ref) => {
  const {
    isAsyncInitiated,
    deselectIndex,
    inputRef,
    selectedOption,
  } = useComboBoxContext();

  return (
    <InputRightElement
      ref={ref}
      children={
        isAsyncInitiated ? (
          <Spinner size="sm" />
        ) : selectedOption.value ? (
          <Icon
            name="close"
            fontSize="12px"
            cursor="pointer"
            zIndex={200}
            onClick={() => {
              deselectIndex(null);
              inputRef.current.focus();
            }}
          />
        ) : null
      }
      cursor="default"
      {...props}
      onClick={() => {
        // TODO: without adding this the event is not getting bubbled
      }}
    />
  );
});

export {
  ComboBox,
  ComboBoxInput,
  ComboBoxSelectedGhost,
  ComboBoxLeftElement,
  ComboBoxRightElement,
  ComboBoxLeftAddon,
  ComboBoxRightAddon,
  ComboBoxClearElement,
  ComboBoxPopper,
  ComboBoxList,
  ComboBoxPopup,
  ComboBoxOption,
};
