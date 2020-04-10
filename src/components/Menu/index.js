/* eslint-disable indent */
import React, { createContext, useContext, useRef, forwardRef } from 'react';
import {
  useColorMode,
  PseudoBox,
  ColorModeProvider,
  theme,
  Box,
  LightMode,
  ThemeProvider,
} from '@chakra-ui/core';
import { useMenuItemStyle, useMenuListStyle } from './styles';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuContext = createContext();

//////////////////////////////////////////////////////////////////////////////////////////

const Menu = ({ children }) => {
  const { colorMode } = useColorMode();

  const focusableItems = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const context = {
    focusableItems,
    menuRef,
    buttonRef,
    colorMode,
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Box fontFamily="body">
          <LightMode>
            <MenuContext.Provider value={context}>
              {children}
            </MenuContext.Provider>
          </LightMode>
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////

export function useMenuContext() {
  const context = useContext(MenuContext);

  if (context === undefined) {
    throw new Error(
      'useMenyContext must be used within the MenuContext Provider',
    );
  }

  return context;
}

//////////////////////////////////////////////////////////////////////////////////////////

const PseudoButton = forwardRef((props, ref) => (
  <PseudoBox as="button" ref={ref} {...props} />
));

PseudoButton.displayName = 'PseudoButton';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuButton = forwardRef(({ as: Comp = PseudoButton, ...rest }, ref) => {
  const { buttonRef } = useMenuContext();
  console.log('%cuseMenuContext', 'color: #1d5673', useMenuContext());
  console.log('%cbuttonRef', 'color: #f200e2', buttonRef);
  return <Comp aria-haspopup="menu" ref={ref} {...rest} />;
});

MenuButton.displayName = 'MenuButton';

//////////////////////////////////////////////////////////////////////////////////////////

export { Menu, MenuButton };
