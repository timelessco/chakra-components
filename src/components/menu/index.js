import React, { useState } from 'react';
import { Menu, MenuTitle, MenuList, MenuItem } from './menu';

const MenuComponent = () => {
  const [menuState, setMenuState] = useState(false);
  return (
    <Menu>
      <MenuTitle
        as="button"
        cursor="pointer"
        onClick={() => setMenuState(!menuState)}
      >
        Menu Title
      </MenuTitle>
      <MenuList isOpen={menuState}>
        <MenuItem>First</MenuItem>
        <MenuItem>Second</MenuItem>
        <MenuItem>Third</MenuItem>
      </MenuList>
    </Menu>
  );
};

export { MenuComponent };
