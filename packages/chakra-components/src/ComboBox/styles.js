import { useColorMode } from "@chakra-ui/core";

/* =========================================================================
  useComboBoxPopperStyle
  ========================================================================== */

export const useComboBoxPopperStyle = () => {
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
  useComboBoxOptionStyle
  ========================================================================== */

export const useComboBoxOptionStyle = optionState => {
  const { colorMode } = useColorMode();
  const props = { colorMode, ...optionState };

  const baseProps = {
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
    width: "full",
    userSelect: "none",
    transition: "background-color 220ms, color 220ms",
    rounded: "sm",
    outline: "none",
    textAlign: "left",
    textDecoration: "none",
    color: "inherit",
    px: 4,
  };

  const interactionProps = ({ colorMode, selected, highlighted }) => {
    const _bgHighlightedColor = { light: "gray.100", dark: "whiteAlpha.100" };
    const _bgSelectedColor = { light: "blue.300", dark: "blue.500" };
    const _activeColor = { light: "gray.200", dark: "whiteAlpha.200" };

    return {
      bg: `${
        selected
          ? _bgSelectedColor[colorMode]
          : highlighted
          ? _bgHighlightedColor[colorMode]
          : "transparent"
      }`,
      _active: {
        bg: _activeColor[colorMode],
      },
      _focus: {
        shadow: "outline",
        outline: 0,
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
    };
  };

  return {
    ...baseProps,
    ...interactionProps(props),
  };
};
