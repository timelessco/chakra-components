import { useColorMode } from "@chakra-ui/core";

/* =========================================================================
  useMenuBarStyle
  ========================================================================== */

export const useMenuBarStyle = () => {
  const baseProps = {
    alignItems: "center",
    fontWeight: "medium",
    fontSize: "md",
    lineHeight: "shorter",
  };

  return { ...baseProps };
};

/* =========================================================================
  useMenuBarItemStyle
  ========================================================================== */

export const useMenuBarItemStyle = () => {
  const baseProps = () => {
    return {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "inherit",
      textAlign: "left",
      outline: "none",
      px: 2,
    };
  };

  const interactionProps = ({ colorMode }) => {
    const _focusColor = { light: "gray.100", dark: "whiteAlpha.100" };
    const _activeColor = { light: "gray.200", dark: "whiteAlpha.200" };

    return {
      _active: {
        bg: _activeColor[colorMode],
      },
      _focus: {
        bg: _focusColor[colorMode],
        outline: 0,
      },
    };
  };

  const { colorMode } = useColorMode();
  const interactionPropsArga = { colorMode };

  return {
    ...baseProps(),
    ...interactionProps(interactionPropsArga),
  };
};

/* =========================================================================
  useSubMenuTitleStyle
  ========================================================================== */

export const useSubMenuTitleStyle = useMenuBarItemStyle;
