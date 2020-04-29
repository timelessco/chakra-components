import React, { forwardRef, cloneElement, useRef, createContext } from "react";
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

import { inputSizes } from "@chakra-ui/core/dist/Input/styles";
import { useComboBoxListStyle } from "./styles";

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
      onChange,
      pageSize = 10,
      itemHeight = 40,
      children,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const { sizes } = useTheme();
    const height = inputSizes[size] && inputSizes[size]["height"];
    let pl = null;
    let pr = null;
    let right = null;
    const validChildren = cleanChildren(children);

    const reactWindowInstanceRef = useRef(null);
    const optionsRef = useRef(null);

    const scrollToIndex = index => {
      if (!reactWindowInstanceRef.current) {
        return;
      }
      reactWindowInstanceRef.current.scrollToItem(index);
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
      options,
      value,
      onChange,
      scrollToIndex,
      optionsRef,
      shiftAmount,
      filterFn: (options, value) =>
        matchSorter(options, value, { keys: ["label"] }),
    });

    const Optionsheight =
      Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;
    const context = {
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
      height: Optionsheight,
      itemHeight,
      inputRef,
      optionsRef,
      reactWindowInstanceRef,
    };

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

const ComboBoxInput = forwardRef((props, ref) => {
  const { getInputProps } = useComboBoxContext();

  return <Input cursor="default" {...getInputProps({ ref })} {...props} />;
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

    const styleProps = useComboBoxListStyle();

    return (
      <Popper
        usePortal={false}
        anchorEl={inputRef.current}
        ref={_optionsRef}
        isOpen={isOpen}
        placement={placement}
        modifiers={popperModifiers}
        rounded="md"
        py={2}
        zIndex="2"
        width="full"
        marginTop="1px !important"
        _focus={{ outline: 0 }}
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

  if (!visibleOptions.length) {
    return (
      <PseudoBox
        ref={ref}
        display="flex"
        alignItems="center"
        flex="0 0 auto"
        color="inherit"
        px={4}
        rounded="sm"
        userSelect="none"
        transition="background-color 220ms, color 220ms"
        textAlign="left"
        textDecoration="none"
        outline="none"
        style={style}
        {...data}
      >
        No options were found...
      </PseudoBox>
    );
  }

  return (
    <PseudoBox
      ref={ref}
      display="flex"
      alignItems="center"
      flex="0 0 auto"
      color="inherit"
      px={4}
      rounded="sm"
      userSelect="none"
      bg={selected ? "blue.200" : highlighted ? "gray.100" : "transparent"}
      transition="background-color 220ms, color 220ms"
      textAlign="left"
      textDecoration="none"
      outline="none"
      _focus={{
        shadow: "outline",
        outline: 0,
      }}
      _active={{
        bg: "gray.200",
      }}
      style={style}
      {...getOptionProps({
        index,
        option,
      })}
      {...data}
    >
      {option.label}
    </PseudoBox>
  );
});

/* =========================================================================
  ComboBoxList
  ========================================================================== */

const ComboBoxList = forwardRef(({ children, ...props }, ref) => {
  const {
    reactWindowInstanceRef,
    height,
    visibleOptions,
    itemHeight,
  } = useComboBoxContext();

  const _reactWindowInstanceRef = useForkRef(reactWindowInstanceRef, ref);

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
});
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
  ComboBoxLeftElement,
  ComboBoxRightElement,
  ComboBoxLeftAddon,
  ComboBoxRightAddon,
  ComboBoxClearElement,
  ComboBoxPopper,
  ComboBoxList,
  ComboBoxOption,
};
