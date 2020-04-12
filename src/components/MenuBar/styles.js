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
      px: 4,
    };
  };

  const themeProps = ({ isActive, isDisabled }) => {
    return {
      p: 5,
      color: 'gray.400',
      _hover: {
        color: 'blue.500',
        shadow: 'inset 0px -2px 0px #3182CE;',
      },
      ...(isActive && {
        color: 'blue.500',
        shadow: 'inset 0px -2px 0px #3182CE;',
      }),
      ...(isDisabled && {
        cursor: 'not-allowed',
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
      color: 'gray.400',
      _hover: {
        color: 'blue.500',
        shadow: 'inset 0px -2px 0px #3182CE;',
      },
      ...(isActive && {
        color: 'blue.500',
        shadow: 'inset 0px -2px 0px #3182CE;',
      }),
      ...(isDisabled && {
        cursor: 'not-allowed',
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
