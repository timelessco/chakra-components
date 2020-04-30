import React, {
  forwardRef,
  cloneElement,
  useRef,
  createContext,
  useEffect,
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
} from "@chakra-ui/core";
import Popper from "@chakra-ui/core/dist/Popper";
import matchSorter from "match-sorter";
import { FixedSizeList } from "react-window";
import { useForkRef, cleanChildren } from "@chakra-ui/core/dist/utils";
import { useComboBoxContext } from "./useComboBoxContext";
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

/* =========================================================================
  ComboBox
  ========================================================================== */

const ComboBox = forwardRef(
  (
    {
      value,
      options,
      defaultOptions = [],
      onChange,
      multi = false,
      async,
      loadOptions = null, // Boolean to ind
      pageSize = 10,
      itemHeight = 40,
      children,
      size = "md",
      enableGhost = "true",
      children,
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
        completedOnce: isAsyncCompletedOnce,
      },
      onAsyncStart,
      onAsyncSuccess,
    } = useAsyncFetching(loadOptions);

    // Position can be top / center / end
    const scrollToIndex = (index, position) => {
      if (!reactWindowInstanceRef.current) {
        return;
      }
      reactWindowInstanceRef.current.scrollToItem(index, position);
    };
    const shiftAmount = pageSize;
    const {
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
      inputRef,
    } = useSelect({
      multi,
      options: async ? asyncOptions : options,
      options: async
        ? isAsyncSuccess
          ? asyncOptions
          : !isAsyncCompletedOnce
          ? defaultOptions
          : []
        : options,
      async,
      isAsyncSuccess,
      value,
      onChange,
      scrollToIndex,
      optionsRef,
      filterFn: (options, value) =>
        matchSorter(options, value, { keys: ["label"] }),
    });

    const Optionsheight =
      Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;

    const inputValue = getInputProps().value;

    useEffect(() => {
      if (
        loadOptions !== null &&
        inputValue &&
        selectedOption.value !== inputValue // Prevent refetch when selected
      ) {
        onAsyncStart(true);

        // Callback that is exposed outside
        const completeCb = data => onAsyncSuccess(data);

        //TODO: Debounce need to be on hook
        debounce(inputValue, loadOptions, completeCb, 800);
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

const ComboBoxInput = forwardRef(({ placeholder, ...props }, ref) => {
  const { getInputProps, selectedOption, enableGhost } = useComboBoxContext();
  const { value } = getInputProps();
  const ghostProps = splitProps(props);
  const _placeholder =
    !value && !selectedOption.value ? placeholder : undefined;

  const _enableGhost =
    enableGhost && !value && selectedOption && selectedOption.value;

  return (
    <>
      <Input
        cursor="default"
        placeholder={_placeholder}
        {...getInputProps({ ref })}
        {...props}
      />
      {_enableGhost ? (
        <ComboBoxSelectedGhost {...ghostProps}>
          {selectedOption.value}
        </ComboBoxSelectedGhost>
      ) : null}
    </>
  );
});

/* =========================================================================
  ComboBoxSelectedGhost
  ========================================================================== */

const ComboBoxSelectedGhost = forwardRef(({ size, ...props }, ref) => {
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
      pointerEvents="none"
      {...baseInputProps}
      {...props}
    />
  );
});

/* =========================================================================
  ComboBoxPopper
  ========================================================================== */

const ComboBoxPopper = forwardRef(
  ({ placement, skid, gutter = 0, ...props }, ref) => {
    const { inputRef, optionsRef, isOpen } = useComboBoxContext();

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
  } = useComboBoxContext();

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
        No options were found...
      </PseudoBox>
    );
  }

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
      isAsyncSuccess,
    } = useComboBoxContext();
    const height =
      Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;
    const _reactWindowInstanceRef = useForkRef(reactWindowInstanceRef, ref);
    if (isAsyncInitiated) {
      return <Box>Loading...</Box>;
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
  return (
    <InputRightElement
      ref={ref}
      children={<Icon name="chevron-down" fontSize="1.5rem" />}
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
  return (
    <InputRightElement
      ref={ref}
      children={<Icon name="close" fontSize="12px" />}
      cursor="default"
      pointerEvents="none"
      {...props}
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
  ComboBoxOption,
};
