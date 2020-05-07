import React, { forwardRef, createContext } from "react";
import { Box, PseudoBox, Icon, useFormControl } from "@chakra-ui/core";

import { useMultiSelectStyle, inputSizes } from "./styles";

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

  const styleProps = useMultiSelectStyle({
    size,
    focusBorderColor,
    errorBorderColor,
  });

  return (
    <MultiSelectContext.Provider value={context}>
      <PseudoBox pos="relative">
        <PseudoBox {...styleProps} {...rest}>
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

const MultiSelectInputGroup = ({ size = "md", ...rest }) => {
  const height = inputSizes[size] && inputSizes[size]["height"];
  const px = inputSizes[size] && inputSizes[size]["px"];

  return (
    <PseudoBox
      position="relative"
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      flex=" 1 1 0%"
      px={px}
      height={height}
      overflow="hidden"
      {...rest}
    >
      {...rest}>
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

const MultiSelectAddons = forwardRef(
  ({ size = "md", children, disablePointerEvents = false, ...props }, ref) => {
    const height = inputSizes[size] && inputSizes[size]["height"];
    const fontSize = inputSizes[size] && inputSizes[size]["fontSize"];

    return (
      <Box
        ref={ref}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={height}
        width={height}
        fontSize={fontSize}
        {...(disablePointerEvents && { pointerEvents: "none" })}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

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
      <MultiSelectAddons>
        <Icon name="chevron-down" fontSize="1.5rem" />
      </MultiSelectAddons>
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
