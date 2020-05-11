import { get } from "styled-system";
import { useTheme, useColorMode } from "@chakra-ui/core";

/* =========================================================================
  useMultiSelectStyle
  ========================================================================== */

export const useMultiSelectStyle = ({
  isFocused,
  focusBorderColor,
  errorBorderColor,
}) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const bg = { light: "white", dark: "whiteAlpha.100" };
  const borderColor = { light: "inherit", dark: "whiteAlpha.50" };

  const baseProps = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    bg: bg[colorMode],
    border: "1px",
    borderColor: borderColor[colorMode],
    rounded: "md",
    cursor: "default",
    transition: "all 0.2s",
    outline: "none",
    appearance: "none",
  };

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
      borderColor: isFocused ? _focusBorderColor : hoverColor[colorMode],
    },
    ...(isFocused && {
      zIndex: 1,
      borderColor: _focusBorderColor,
      boxShadow: `0 0 0 1px ${_focusBorderColor}`,
    }),
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed",
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
    ...interactionProps,
  };
};

/* =========================================================================
  useMultiSelectInputStyle
  ========================================================================== */

export const useMultiSelectInputStyle = ({ isDisabled, inputIsHidden }) => {
  const inputWrapperStyle = {
    m: "2px",
    py: "2px",
    visibility: isDisabled ? "hidden" : "visible",
    color: "inherit",
  };

  const inputStyle = {
    label: "input",
    background: 0,
    border: 0,
    fontSize: "inherit",
    opacity: inputIsHidden ? 0 : 1,
    outline: 0,
    padding: 0,
    color: "inherit",
  };

  return {
    inputWrapperStyle,
    inputStyle,
  };
};

/* =========================================================================
  useMultiSelectListStyle
  ========================================================================== */

export const useMultiSelectListStyle = () => {
  const { colorMode } = useColorMode();

  const baseProps = {
    color: "inherit",
    borderWidth: "1px",
    rounded: "md",
    py: 2,
    zIndex: 2,
    width: "full",
    marginTop: "1px !important",
    _focus: { outline: 0 },
  };

  const elevation = {
    light: {
      bg: "#fff",
      shadow: "sm",
    },
    dark: {
      bg: "gray.700",
      shadow: `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px`,
    },
  };

  return {
    ...baseProps,
    ...elevation[colorMode],
  };
};

/* =========================================================================
  useMultiSelectOptionStyle
  ========================================================================== */

export const useMultiSelectOptionStyle = optionState => {
  const { colorMode } = useColorMode();
  const props = { colorMode, ...optionState };

  const baseProps = {
    display: "flex",
    alignItems: "center",
    flex: " 0 0 auto",
    width: "full",
    userSelect: "none",
    transition: "background-color 220ms, color 220ms",
    rounded: "sm",
    textAlign: "left",
    px: 4,
  };

  const interactionProps = ({ colorMode, selected, focused, disabled }) => {
    const _focusColor = { light: "gray.100", dark: "whiteAlpha.100" };
    const _bgSelectedColor = { light: "blue.300", dark: "blue.500" };

    return {
      bg: `${
        selected
          ? _bgSelectedColor[colorMode]
          : focused
          ? _focusColor[colorMode]
          : "transparent"
      }`,
      _focus: {
        shadow: "outline",
        outline: 0,
      },
      ...(disabled && {
        opacity: 0.4,
        cursor: "not-allowed",
      }),
    };
  };

  return {
    ...baseProps,
    ...interactionProps(props),
  };
};
