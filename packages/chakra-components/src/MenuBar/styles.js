import { useColorMode } from "@chakra-ui/core";

/* =========================================================================
  useMenuBarStyle
  ========================================================================== */

export const useMenuBarStyle = () => {
  const baseProps = {
    fontSize: "md",
    lineHeight: "shorter",
    whiteSpace: "nowrap",
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
      width: "full",
      textDecoration: "none",
      color: "inherit",
      textAlign: "left",
      outline: "none",
      px: 2,
      rounded: "sm",
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
        shadow: "outline",
        outline: 0,
      },
      _hover: {
        bg: _focusColor[colorMode],
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

/* =========================================================================
  useMenuListStyle
  ========================================================================== */

export const useMenuListStyle = () => {
  const { colorMode } = useColorMode();
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
    color: "inherit",
    borderWidth: "1px",
    ...elevation[colorMode],
  };
};

/* =========================================================================
  useMenuItemStyle
  ========================================================================== */

export const useMenuItemStyle = () => {
  const { colorMode } = useColorMode();
  const props = { colorMode };

  const baseProps = {
    width: "full",
    flex: " 0 0 auto",
    userSelect: "none",
    transition: "background-color 220ms, color 220ms",
    rounded: "sm",
  };

  const interactionProps = ({ colorMode }) => {
    const _focusColor = { light: "gray.100", dark: "whiteAlpha.100" };
    const _activeColor = { light: "gray.200", dark: "whiteAlpha.200" };

    return {
      _active: {
        bg: _activeColor[colorMode],
      },
      _focus: {
        shadow: "outline",
        outline: 0,
      },
      _hover: {
        bg: _focusColor[colorMode],
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
