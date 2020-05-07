import React, { forwardRef } from "react";
import { get } from "styled-system";
import {
  PseudoBox,
  Icon,
  useFormControl,
  useTheme,
  useColorMode,
} from "@chakra-ui/core";

const Input = forwardRef((props, ref) => {
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

Input.displayName = "Input";

Input.defaultProps = {
  size: "md",
  as: "input",
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MultiSelect = ({
  size,
  focusBorderColor,
  errorBorderColor,
  ...rest
}) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const wrapperStyleProps = wrapperStyle({
    theme,
    colorMode,
    size,
    focusBorderColor,
    errorBorderColor,
  });

  return (
    <>
      <PseudoBox pos="relative">
        <PseudoBox {...wrapperStyleProps} {...rest}>
          <PseudoBox
            position="relative"
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            flex=" 1 1 0%"
            p="2px 8px"
            overflow="hidden"
          >
            {/* <PseudoBox
              position="absolute"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              top="50%"
              transform="translateY(-50%)"
              mx="2px"
              maxW="calc(100% - 8px)"
            >
              Orange
            </PseudoBox> */}
            {/* <PseudoBox
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              mx="2px"
            >
              Select One...
            </PseudoBox> */}
            <PseudoBox
              py="2px"
              m="2px"
              color="rgb(51, 51, 51)"
              visibility="visible"
            >
              <PseudoBox display="inline-block">
                <Input />
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
        <input type="hidden" name="color" value="red" />
      </PseudoBox>
    </>
  );
};

MultiSelect.displayName = "MultiSelect";

MultiSelect.defaultProps = {
  size: "md",
  focusBorderColor: "blue.500",
  errorBorderColor: "red.500",
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const wrapperStyle = ({
  theme,
  colorMode,
  size,
  focusBorderColor,
  errorBorderColor,
}) => {
  const bg = { light: "white", dark: "whiteAlpha.100" };
  const borderColor = { light: "inherit", dark: "whiteAlpha.50" };

  const baseProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    position: "relative",
    cursor: "default",
    transition: "all 0.2s",
    outline: "none",
    appearance: "none",
    bg: bg[colorMode],
    border: "1px",
    borderColor: borderColor[colorMode],
  };

  const inputSizes = {
    lg: {
      fontSize: "lg",
      height: 12,
      rounded: "md",
    },
    md: {
      fontSize: "md",
      height: 10,
      rounded: "md",
    },
    sm: {
      fontSize: "sm",
      height: 8,
      rounded: "sm",
    },
  };

  const sizeProps = inputSizes[size];

  /**
   * styled-system's get takes 3 args
   * - object or array to read from
   * - key to get
   * - fallback value
   */
  const hoverColor = { light: "gray.300", dark: "whiteAlpha.200" };
  const _focusBorderColor = get(
    theme.colors,
    focusBorderColor,
    focusBorderColor, // If color doesn't exist in theme, use it's raw value
  );
  const _errorBorderColor = get(
    theme.colors,
    errorBorderColor,
    errorBorderColor,
  );

  const interactionProps = {
    _hover: {
      borderColor: hoverColor[colorMode],
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed",
    },
    _focus: {
      zIndex: 1,
      borderColor: _focusBorderColor,
      boxShadow: `0 0 0 1px ${_focusBorderColor}`,
    },
    _invalid: {
      borderColor: _errorBorderColor,
      boxShadow: `0 0 0 1px ${_errorBorderColor}`,
    },
    _readOnly: {
      bg: "transparent",
      boxShadow: "none !important",
      userSelect: "all",
    },
  };

  return {
    ...baseProps,
    ...sizeProps,
    ...interactionProps,
  };
};
