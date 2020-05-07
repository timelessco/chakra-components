import React, { forwardRef, createContext, useRef } from "react";
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

export const MultiSelect = forwardRef(
  (
    {
      options,
      value,
      onChange,
      isMulti,
      size = "md",
      focusBorderColor = "blue.500",
      errorBorderColor = "red.500",
      ...rest
    },
    ref,
  ) => {
    const multiSelectRef = useRef(null);

    const context = { options, value, onChange, multiSelectRef, isMulti };

    const { border, borderColor, rounded, ...styleProps } = useMultiSelectStyle(
      {
        size,
        focusBorderColor,
        errorBorderColor,
      },
    );

    const _multiSelectRef = useForkRef(multiSelectRef, ref);

    return (
      <MultiSelectContext.Provider value={context}>
        <PseudoBox
          ref={_multiSelectRef}
          pos="relative"
          {...{ border, borderColor, rounded }}
        >
          <PseudoBox height={10} {...styleProps} {...{ rounded }} {...rest}>
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

const MultiSelectOption = forwardRef(({ index, style, ...rest }, ref) => {
  const { options } = useMultiSelectContext();

  const styleProps = useMultiSelectOptionStyle();

  return (
    <PseudoBox ref={ref} style={style} {...styleProps} {...rest}>
      {options[index].label}
    </PseudoBox>
  );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectList = forwardRef(
  (
    { placement, skid, gutter, itemHeight = 40, pageSize = 10, ...props },
    ref,
  ) => {
    const { multiSelectRef, options } = useMultiSelectContext();

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

    const height = options.length * itemHeight;
    const styleProps = useMultiSelectListStyle();

    return (
      <Popper
        usePortal={false}
        anchorEl={multiSelectRef.current}
        isOpen={true}
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

const MultiSelectInputGroup = ({ size = "md", ...rest }) => {
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
      {...rest}
    >
      {value ? <MultiSelectSelectedOption /> : <MultiSelectPlaceholder />}
      <MultiSelectInput />
    </PseudoBox>
  );
};

MultiSelectInputGroup.displayName = "MultiSelectInputGroup";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInput = forwardRef((props, ref) => {
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

  return (
    <PseudoBox display="inline-block" py="2px" m="2px" visibility="visible">
      <PseudoBox
        as="input"
        ref={ref}
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

const MultiSelectRightAddons = forwardRef(({ children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
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
