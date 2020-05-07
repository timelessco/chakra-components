import React, { forwardRef, createContext } from "react";
import { PseudoBox, Icon, useFormControl } from "@chakra-ui/core";

import { useMultiSelectStyle } from "./styles";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectInput = forwardRef((props, ref) => {
  const {
    size,
    as,
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
    <PseudoBox
      ref={ref}
      as={as}
      readOnly={formControl.isReadOnly}
      aria-readonly={isReadOnly}
      disabled={formControl.isDisabled}
      aria-label={ariaLabel}
      aria-invalid={formControl.isInvalid}
      required={formControl.isRequired}
      aria-required={formControl.isRequired}
      aria-disabled={formControl.isDisabled}
      aria-describedby={ariaDescribedby}
      boxSizing="content-box"
      width="2px"
      background="0px center"
      border="0px"
      fontSize="inherit"
      opacity={1}
      outline="0px"
      padding="0px"
      color="inherit"
      cursor="default"
      {...rest}
    />
  );
});

MultiSelectInput.displayName = "MultiSelectInput";

MultiSelectInput.defaultProps = {
  size: "md",
  as: "input",
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectHiddenInput = () => {
  return <input type="hidden" name="color" value="red" />;
};

MultiSelectHiddenInput.displayName = "MultiSelectHiddenInput";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectSelectedOption = () => {
  return (
    <PseudoBox
      position="absolute"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      top="50%"
      transform="translateY(-50%)"
      mx="2px"
      maxW="calc(100% - 8px)"
    >
      Orange
    </PseudoBox>
  );
};

MultiSelectSelectedOption.displayName = "MultiSelectSelectedOption";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MultiSelectPlaceholder = () => {
  return (
    <PseudoBox
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      mx="2px"
    >
      Select One...
    </PseudoBox>
  );
};

MultiSelectPlaceholder.displayName = "MultiSelectPlaceholder";

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
          <PseudoBox
            position="relative"
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            flex=" 1 1 0%"
            p="2px 8px"
            overflow="hidden"
          >
            <PseudoBox
              py="2px"
              m="2px"
              color="rgb(51, 51, 51)"
              visibility="visible"
            >
              <PseudoBox display="inline-block">
                <MultiSelectInput />
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
            </PseudoBox>
          </PseudoBox>
          <PseudoBox
            display="flex"
            alignItems="center"
            alignSelf="stretch"
            flexShrink="0"
          >
            <Icon name="warning" />
          </PseudoBox>
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
