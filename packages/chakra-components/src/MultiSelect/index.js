import React, { forwardRef, createContext } from "react";
import { PseudoBox, Icon, useFormControl } from "@chakra-ui/core";

import { useMultiSelectStyle } from "./styles";

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

const MultiSelectRightElements = props => {
  return (
    <PseudoBox
      display="flex"
      alignItems="center"
      alignSelf="stretch"
      flexShrink="0"
      {...props}
    >
      <Icon name="warning" />
    </PseudoBox>
  );
};

MultiSelectRightElements.displayName = "MultiSelectRightElements";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInputGroup = props => {
  return (
    <PseudoBox
      position="relative"
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      flex=" 1 1 0%"
      p="2px 8px"
      overflow="hidden"
      {...props}
    >
      <MultiSelectInput />
    </PseudoBox>
  );
};

MultiSelectInputGroup.displayName = "MultiSelectInputGroup";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectContext = createContext();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MultiSelect = ({
  size,
  focusBorderColor,
  errorBorderColor,
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

MultiSelect.defaultProps = {
  size: "md",
  focusBorderColor: "blue.500",
  errorBorderColor: "red.500",
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
