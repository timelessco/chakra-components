import { get } from "styled-system";
import { useTheme, useColorMode } from "@chakra-ui/core";

export const useMultiSelectStyle = ({
  size,
  focusBorderColor,
  errorBorderColor,
}) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

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
