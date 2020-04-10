/* eslint-disable indent */
import React, { createContext, useContext, useRef, forwardRef } from 'react';
import { useColorMode, PseudoBox } from '@chakra-ui/core';
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
    <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
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
  return <Comp ref={ref} {...rest} />;
});

MenuButton.displayName = 'MenuButton';

//////////////////////////////////////////////////////////////////////////////////////////

export { Menu, MenuButton };
