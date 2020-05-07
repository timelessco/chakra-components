import React, { forwardRef, createContext, useRef, useState } from "react";
import {
  Box,
  PseudoBox,
  Icon,
  useFormControl,
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

import {
  useMultiSelectStyle,
  useMultiSelectListStyle,
  useMultiSelectOptionStyle,
} from "./styles";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MultiSelectContext = createContext();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelect = forwardRef(
  (
    {
      options,
      value: initialValue,
      onChange,
      isMulti,
      focusBorderColor = "blue.500",
      errorBorderColor = "red.500",
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(initialValue);

    const multiSelectWrapperRef = useRef(null);
    const multiSelectRef = useRef(null);
    const inputRef = useRef(null);
    const popperRef = useRef(null);

    const handleOnClick = e => {
      if (!isFocused) {
        inputRef.current.focus();
      }

      if (inputRef.current && inputRef.current.style.opacity === "0") {
        inputRef.current.style.opacity = 1;
      }

      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    const context = {
      options,
      value,
      setValue,
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
    };

    const styleProps = useMultiSelectStyle({
      isFocused,
      focusBorderColor,
      errorBorderColor,
    });

    const _multiSelectRef = useForkRef(multiSelectRef, ref);

    return (
      <MultiSelectContext.Provider value={context}>
        <PseudoBox pos="relative">
          <PseudoBox
            ref={_multiSelectRef}
            height={10}
            tabIndex={-1}
            onClick={handleOnClick}
            {...styleProps}
            {...rest}
          >
            <MultiSelectInputGroup />
            <MultiSelectRightElements />
          </PseudoBox>
          <MultiSelectList />
          <MultiSelectHiddenInput />
        </PseudoBox>
      </MultiSelectContext.Provider>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInput = forwardRef((props, ref) => {
  const {
    inputRef,
    isFocused,
    setIsFocused,
    isOpen,
    setIsOpen,
    multiSelectRef,
    popperRef,
  } = useMultiSelectContext();
  const {
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    isReadOnly,
    isDisabled,
    isInvalid,
    isRequired,
    ...rest
  } = props;

  const formControl = useFormControl(props);
  const _inputRef = useForkRef(inputRef, ref);

  const handleOnFocus = event => {
    if (!isFocused) {
      setIsFocused(true);
    }

    if (inputRef.current && inputRef.current.style.opacity === "0") {
      inputRef.current.style.opacity = 1;
    }
  };

  const handleOnBlur = event => {
    if (!isOpen && !multiSelectRef.current.contains(event.relatedTarget)) {
      if (isFocused) {
        setIsFocused(false);
      }

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

      return;
    }

    inputRef.current.focus();
  };

  return (
    <PseudoBox display="inline-block" py="2px" m="2px" visibility="visible">
      <PseudoBox
        as="input"
        ref={_inputRef}
        readOnly={formControl.isReadOnly}
        aria-readonly={isReadOnly}
        disabled={formControl.isDisabled}
        aria-label={ariaLabel}
        aria-invalid={formControl.isInvalid}
        required={formControl.isRequired}
        aria-required={formControl.isRequired}
        aria-disabled={formControl.isDisabled}
        aria-describedby={ariaDescribedby}
        width="2px"
        opacity={1}
        cursor="default"
        outline="none"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...rest}
      />
      <PseudoBox
        position="absolute"
        top="0px"
        left="0px"
        visibility="hidden"
        height="0px"
        overflow="scroll"
        whiteSpace="pre"
        fontSize="16px"
        fontFamily="system-ui"
        fontWeight="400"
        fontStyle="normal"
        letterSpacing="normal"
        textTransform="none"
      ></PseudoBox>
    </PseudoBox>
  );
});

MultiSelectInput.displayName = "MultiSelectInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectOption = forwardRef(({ index, style, ...rest }, ref) => {
  const {
    options,
    setValue,
    isOpen,
    setIsOpen,
    inputRef,
  } = useMultiSelectContext();

  const option = options[index];

  const handleOnClick = event => {
    setValue(option.value);

    if (isOpen) {
      setIsOpen(false);
    }

    inputRef.current.style.opacity = 0;
  };

  const styleProps = useMultiSelectOptionStyle();

  return (
    <PseudoBox
      ref={ref}
      style={style}
      tabIndex={-1}
      onClick={handleOnClick}
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
      options,
      isOpen,
      popperRef,
    } = useMultiSelectContext();

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

    const _popperRef = useForkRef(popperRef, ref);

    const height = options.length * itemHeight;
    const styleProps = useMultiSelectListStyle();

    return (
      <Popper
        ref={_popperRef}
        usePortal={false}
        anchorEl={multiSelectRef.current}
        isOpen={isOpen}
        placement={placement}
        modifiers={popperModifiers}
        {...styleProps}
        {...props}
      >
        <List
          itemSize={itemHeight}
          itemCount={options.length}
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

const MultiSelectTagAddons = forwardRef(({ children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      alignItems="center"
      justifyContent="center"
      m="2px"
      {...props}
    >
      {children}
    </Box>
  );
});

MultiSelectTagAddons.displayName = "MultiSelectTagAddons";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInputGroup = props => {
  const { value } = useMultiSelectContext();

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
      {value ? <MultiSelectSelectedOption /> : <MultiSelectPlaceholder />}
      <MultiSelectInput />
    </PseudoBox>
  );
};

MultiSelectInputGroup.displayName = "MultiSelectInputGroup";

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
  return (
    <PseudoBox
      display="flex"
      alignItems="center"
      alignSelf="stretch"
      flexShrink="0"
      {...props}
    >
      <MultiSelectRightAddons>
        <Icon name="chevron-down" fontSize="1.5rem" />
      </MultiSelectRightAddons>
    </PseudoBox>
  );
};

MultiSelectRightElements.displayName = "MultiSelectRightElements";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectHiddenInput = props => {
  return <input type="hidden" name="color" value="red" {...props} />;
};

MultiSelectHiddenInput.displayName = "MultiSelectHiddenInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectSelectedOption = ({ ...props }) => {
  const { isMulti, value } = useMultiSelectContext();

  if (isMulti) {
    return (
      <>
        {value.map(val => (
          <MultiSelectTagAddons>
            <Tag size="md" variant="solid" variantColor="cyan">
              <TagLabel>{val}</TagLabel>
              <TagCloseButton />
            </Tag>
          </MultiSelectTagAddons>
        ))}
      </>
    );
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
      {value}
    </PseudoBox>
  );
};

MultiSelectSelectedOption.displayName = "MultiSelectSelectedOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectPlaceholder = props => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const placeholderColor = {
    light: theme.colors.gray[400],
    dark: theme.colors.whiteAlpha[400],
  };

  return (
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
};

MultiSelectPlaceholder.displayName = "MultiSelectPlaceholder";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export { MultiSelect };
