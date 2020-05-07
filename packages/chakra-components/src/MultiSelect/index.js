import React, { forwardRef, createContext } from "react";
import {
  Box,
  PseudoBox,
  Icon,
  useFormControl,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/core";

import { useMultiSelectStyle } from "./styles";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectContext = createContext();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MultiSelect = ({
  size = "md",
  focusBorderColor = "blue.500",
  errorBorderColor = "red.500",
  ...rest
}) => {
  const context = {};

  const { border, borderColor, rounded, ...styleProps } = useMultiSelectStyle({
    size,
    focusBorderColor,
    errorBorderColor,
  });

  return (
    <MultiSelectContext.Provider value={context}>
      <PseudoBox pos="relative" {...{ border, borderColor, rounded }}>
        <PseudoBox height={10} {...styleProps} {...{ rounded }} {...rest}>
          <MultiSelectInputGroup />
          <MultiSelectRightElements />
        </PseudoBox>
        <MultiSelectHiddenInput />
      </PseudoBox>
    </MultiSelectContext.Provider>
  );
};

MultiSelect.displayName = "MultiSelect";

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
      <MultiSelectTagAddons>
        <Tag size={size} variant="solid" variantColor="cyan">
          <TagLabel>Cyan</TagLabel>
          <TagCloseButton />
        </Tag>
      </MultiSelectTagAddons>
      <MultiSelectTagAddons>
        <Tag size={size} variant="solid" variantColor="cyan">
          <TagLabel>Cyan</TagLabel>
          <TagCloseButton />
        </Tag>
      </MultiSelectTagAddons>
      <MultiSelectTagAddons>
        <Tag size={size} variant="solid" variantColor="cyan">
          <TagLabel>Cyan</TagLabel>
          <TagCloseButton />
        </Tag>
      </MultiSelectTagAddons>
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

const MultiSelectSelectedOption = props => {
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
      Orange
    </PseudoBox>
  );
};

MultiSelectSelectedOption.displayName = "MultiSelectSelectedOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectPlaceholder = props => {
  return (
    <PseudoBox
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      mx="2px"
      {...props}
    >
      Select One...
    </PseudoBox>
  );
};

MultiSelectPlaceholder.displayName = "MultiSelectPlaceholder";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
