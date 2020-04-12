import React, { useContext, forwardRef } from 'react';
import { createContext } from 'react';
import {
  Box,
  PseudoBox,
  Flex,
  ThemeProvider,
  ColorModeProvider,
  LightMode,
  theme,
} from '@chakra-ui/core';
import { useId } from '@reach/auto-id';

import { useMenuBarStyle, useMenuBarItemStyle } from './styles';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBarContext = createContext();

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBar = ({ children, role = 'menubar', ariaLabel, ...props }) => {
  const menuBarId = `menubar-${useId()}`;
  console.log('%cmenuBarId', 'color: #00a3cc', menuBarId);

  const styleProps = useMenuBarStyle();

  const context = { props };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Box fontFamily="body">
          <LightMode>
            <MenuBarContext.Provider value={context}>
              <Box as="nav" ariaLabel={ariaLabel}>
                <Flex
                  id={menuBarId}
                  role={role}
                  ariaLabel={ariaLabel}
                  {...styleProps}
                  {...props}
                >
                  {children}
                </Flex>
              </Box>
            </MenuBarContext.Provider>
          </LightMode>
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

MenuBar.displayName = 'MenuBar';

//////////////////////////////////////////////////////////////////////////////////////////

const useMenuBarContext = () => {
  const context = useContext(MenuBarContext);

  if (context === undefined) {
    throw new Error(
      'useMenuBarContext must be used within a MenuBarContext Provider',
    );
  }

  return context;
};

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBarItem = forwardRef(
  ({ isActive, isDisabled, role = 'menuitem', ...props }, ref) => {
    const context = useMenuBarContext();
    console.log('%ccontext', 'color: #f2ceb6', context);

    const stylePropsArgs = { isActive, isDisabled };

    const styleProps = useMenuBarItemStyle(stylePropsArgs);

    return (
      <PseudoBox
        as="button"
        ref={ref}
        role={role}
        tabIndex={0}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...styleProps}
        {...props}
      />
    );
  },
);
export { MenuBar, MenuBarItem };
