import { useColorMode } from '@chakra-ui/core';

export const useMenuBarStyle = () => {
  const baseProps = {
    alignItems: 'center',
    fontWeight: 'medium',
    fontSize: 'md',
    lineHeight: 'shorter',
  };

  return { ...baseProps };
};

export const useMenuBarItemStyle = ({ isActive, isDisabled }) => {
  const baseProps = () => {
    return {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'inherit',
      textAlign: 'left',
      outline: 'none',
      px: 2,
    };
  };

  const themeProps = ({ isActive, isDisabled }) => {
    return {
      p: '3',
      color: 'gray.700',
      _hover: {
        shadow: 'inset 0px -2px 0px #ff5d51',
      },
      ...(isActive && {
        shadow: 'inset 0px -2px 0px #ff5d51',
      }),
      ...(isDisabled && {
        cursor: 'not-allowed',
        opacity: '40%',
        _hover: {},
        _active: {},
        _focus: {},
      }),
    };
  };

  const interactionProps = ({ colorMode }) => {
    const _focusColor = { light: 'gray.100', dark: 'whiteAlpha.100' };
    const _activeColor = { light: 'gray.200', dark: 'whiteAlpha.200' };

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
  const themePropsArgs = { isActive, isDisabled };
  const interactionPropsArga = { colorMode };

  return {
    ...baseProps(),
    ...interactionProps(interactionPropsArga),
    ...themeProps(themePropsArgs),
  };
};

export const useSubMenuTitleStyle = ({ isActive, isDisabled }) => {
  const baseProps = () => {
    return {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'inherit',
      textAlign: 'left',
      outline: 'none',
      px: 4,
    };
  };

  const themeProps = ({ isActive, isDisabled }) => {
    return {
      p: 5,
      color: 'gray.700',
      _hover: {
        shadow: 'inset 0px -2px 0px #ff5d51',
      },
      ...(isActive && {
        shadow: 'inset 0px -2px 0px #ff5d51',
      }),
      ...(isDisabled && {
        cursor: 'not-allowed',
        opacity: '40%',
        _hover: {},
        _active: {},
        _focus: {},
      }),
    };
  };

  const interactionProps = ({ colorMode }) => {
    const _focusColor = { light: 'gray.100', dark: 'whiteAlpha.100' };
    const _activeColor = { light: 'gray.200', dark: 'whiteAlpha.200' };

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
  const themePropsArgs = { isActive, isDisabled };
  const interactionPropsArga = { colorMode };

  return {
    ...baseProps(),
    ...interactionProps(interactionPropsArga),
    ...themeProps(themePropsArgs),
  };
};

export const useMenuItemStyle = () => {
  const { colorMode } = useColorMode();
  const props = { colorMode };

  const baseProps = {
    width: 'full',
    flex: ' 0 0 auto',
    userSelect: 'none',
    transition: 'background-color 220ms, color 220ms',
  };

  const interactionProps = ({ colorMode }) => {
    const _focusColor = { light: 'gray.100', dark: 'whiteAlpha.100' };
    const _activeColor = { light: 'gray.200', dark: 'whiteAlpha.200' };

    return {
      _active: {
        bg: _activeColor[colorMode],
      },
      _focus: {
        bg: _focusColor[colorMode],
        outline: 0,
      },
      _hover: {
        bg: _activeColor[colorMode],
        textDecoration: 'none',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    };
  };

  return {
    ...baseProps,
    ...interactionProps(props),
  };
};
