/* eslint-disable indent */
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  forwardRef,
  createContext,
} from 'react';
import { useId } from '@reach/auto-id';
import {
  useColorMode,
  PseudoBox,
  ColorModeProvider,
  theme,
  Box,
  LightMode,
  ThemeProvider,
  usePrevious,
  Divider,
  Text,
} from '@chakra-ui/core';

import {
  useForkRef,
  getFocusables,
  wrapEvent,
} from '@chakra-ui/core/dist/utils';
import Popper from '@chakra-ui/core/dist/Popper';
import {
  useMenuItemStyle,
  useMenuListStyle,
} from '@chakra-ui/core/dist/Menu/styles';

console.log('%ctheme', 'color: #733d00', theme);

//////////////////////////////////////////////////////////////////////////////////////////

const MenuContext = createContext();

//////////////////////////////////////////////////////////////////////////////////////////

const Menu = ({
  children,
  isOpen: isOpenProp,
  defaultIsOpen,
  onOpen,
  onClose,
  autoSelect = true,
  closeOnBlur = true,
  closeOnSelect = true,
  defaultActiveIndex,
  placement,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || -1);
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);
  const { current: isControlled } = useRef(isOpenProp != null);

  const _isOpen = isControlled ? isOpenProp : isOpen;
  const wasPreviouslyOpen = usePrevious(_isOpen);

  const menuId = `menu-${useId()}`;
  const buttonId = `menubutton-${useId()}`;

  const focusableItems = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { colorMode } = useColorMode();

  useEffect(() => {
    if (_isOpen && menuRef && menuRef.current) {
      let focusables = getFocusables(menuRef.current).filter((node) =>
        ['menuitem', 'menuitemradio', 'menuitemcheckbox'].includes(
          node.getAttribute('role'),
        ),
      );

      focusableItems.current = menuRef.current ? focusables : [];
      initTabIndex();
    }
  }, [_isOpen]);

  useEffect(() => {
    if (activeIndex !== -1) {
      focusableItems.current[activeIndex] &&
        focusableItems.current[activeIndex].focus();
      updateTabIndex(activeIndex);
    }

    if (activeIndex === -1 && !_isOpen && wasPreviouslyOpen) {
      buttonRef.current && buttonRef.current.focus();
    }

    if (activeIndex === -1 && _isOpen) {
      menuRef.current && menuRef.current.focus();
    }
  }, [activeIndex, _isOpen, buttonRef, menuRef, wasPreviouslyOpen]);

  const initTabIndex = () => {
    focusableItems.current.forEach(
      ({ node, index }) => index === 0 && node.setAttribute('tabindex', 0),
    );
  };

  const updateTabIndex = (index) => {
    if (focusableItems.current.length > 0) {
      let nodeAtIndex = focusableItems.current[index];

      focusableItems.current.forEach((node) => {
        if (node !== nodeAtIndex) {
          node.setAttribute('tabindex', -1);
        }
      });

      nodeAtIndex.setAttribute('tabindex', 0);
    }
  };

  const resetTabIndex = () => {
    if (focusableItems.current) {
      focusableItems.current.forEach((node) =>
        node.setAttribute('tabindex', -1),
      );
    }
  };

  const focusOnFirstItem = () => {
    openMenu();
    setActiveIndex(0);
  };

  const openMenu = () => {
    if (!isControlled) {
      setIsOpen(true);
    }

    if (onOpen) {
      onOpen();
    }
  };

  const focusAtIndex = (index) => {
    setActiveIndex(index);
  };

  const focusOnLastItem = () => {
    openMenu();
    setActiveIndex(focusableItems.current.length - 1);
  };

  const closeMenu = () => {
    if (!isControlled) {
      setIsOpen(false);
    }

    if (onClose) {
      onClose();
    }

    setActiveIndex(-1);
    resetTabIndex();
  };

  const context = {
    activeIndex,
    isOpen: _isOpen,
    focusAtIndex,
    focusOnLastItem,
    focusOnFirstItem,
    closeMenu,
    buttonRef,
    menuRef,
    focusableItems,
    placement,
    menuId,
    buttonId,
    openMenu,
    autoSelect,
    closeOnSelect,
    closeOnBlur,
    colorMode,
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Box fontFamily="body">
          <LightMode>
            <MenuContext.Provider value={context}>
              {typeof children === 'function'
                ? children({ isOpen: _isOpen, onClose: closeMenu })
                : children}
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

const MenuButton = forwardRef(
  ({ onClick, onKeyDown, as: Comp = PseudoButton, ...rest }, ref) => {
    const {
      isOpen,
      focusOnLastItem,
      focusOnFirstItem,
      closeMenu,
      menuId,
      buttonId,
      autoSelect,
      openMenu,
      buttonRef,
    } = useMenuContext();

    const menuButtonRef = useForkRef(buttonRef, ref);

    return (
      <Comp
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        id={buttonId}
        role="button"
        ref={menuButtonRef}
        onClick={wrapEvent(onClick, () => {
          if (isOpen) {
            closeMenu();
          } else {
            if (autoSelect) {
              focusOnFirstItem();
            } else {
              openMenu();
            }
          }
        })}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onKeyDown={wrapEvent(onKeyDown, (event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusOnFirstItem();
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusOnLastItem();
          }
        })}
        {...rest}
      />
    );
  },
);

MenuButton.displayName = 'MenuButton';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuList = ({ onKeyDown, onBlur, ...props }) => {
  const {
    activeIndex: index,
    isOpen,
    focusAtIndex,
    focusOnFirstItem,
    focusOnLastItem,
    closeMenu,
    focusableItems,
    buttonRef,
    menuId,
    buttonId,
    menuRef,
    closeOnBlur,
    placement,
  } = useMenuContext();

  const handleKeyDown = (event) => {
    const count = focusableItems.current.length;
    let nextIndex;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = (index + 1) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = (index - 1 + count) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === 'Home') {
      focusOnFirstItem();
    } else if (event.key === 'End') {
      focusOnLastItem();
    } else if (event.key === 'Tab') {
      event.preventDefault();
    } else if (event.key === 'Escape') {
      closeMenu();
    }

    // Set focus based on first character
    if (/^[a-z0-9_-]$/i.test(event.key)) {
      event.stopPropagation();
      event.preventDefault();
      let foundNode = focusableItems.current.find((item) =>
        item.textContent.toLowerCase().startsWith(event.key),
      );
      if (foundNode) {
        nextIndex = focusableItems.current.indexOf(foundNode);
        focusAtIndex(nextIndex);
      }
    }

    onKeyDown && onKeyDown(event);
  };

  // Close the menu on blur
  const handleBlur = (event) => {
    if (
      closeOnBlur &&
      isOpen &&
      menuRef.current &&
      buttonRef.current &&
      !menuRef.current.contains(event.relatedTarget) &&
      !buttonRef.current.contains(event.relatedTarget)
    ) {
      closeMenu();
    }

    onBlur && onBlur(event);
  };

  const styleProps = useMenuListStyle();

  return (
    <Popper
      usePortal={false}
      isOpen={isOpen}
      anchorEl={buttonRef.current}
      placement={placement}
      modifiers={{
        preventOverflow: {
          enabled: true,
          boundariesElement: 'viewport',
        },
      }}
      minW="3xs"
      rounded="md"
      role="menu"
      ref={menuRef}
      id={menuId}
      py={2}
      aria-labelledby={buttonId}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      tabIndex={-1}
      zIndex="1"
      _focus={{
        outline: 0,
      }}
      fontFamily="Inter"
      fontSize="md"
      {...styleProps}
      {...props}
    />
  );
};

MenuList.displayName = 'MenuList';

//////////////////////////////////////////////////////////////////////////////////////////
const MenuItem = forwardRef(
  (
    {
      isDisabled,
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
      role = 'menuitem',
      ...props
    },
    ref,
  ) => {
    const {
      focusableItems,
      focusAtIndex,
      closeOnSelect,
      closeMenu,
    } = useMenuContext();

    const styleProps = useMenuItemStyle();

    return (
      <PseudoBox
        as="button"
        ref={ref}
        display="flex"
        textDecoration="none"
        color="inherit"
        minHeight="32px"
        alignItems="center"
        textAlign="left"
        outline="none"
        px={4}
        role={role}
        tabIndex={-1}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={wrapEvent(onClick, (event) => {
          if (isDisabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
          }
          if (closeOnSelect) {
            closeMenu();
          }
        })}
        onMouseEnter={wrapEvent(onMouseEnter, (event) => {
          if (isDisabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
          }
          if (focusableItems && focusableItems.current.length > 0) {
            let nextIndex = focusableItems.current.indexOf(event.currentTarget);
            focusAtIndex(nextIndex);
          }
        })}
        onMouseLeave={wrapEvent(onMouseLeave, () => {
          focusAtIndex(-1);
        })}
        onKeyDown={wrapEvent(onKeyDown, (event) => {
          if (isDisabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (onClick) {
              onClick();
            }

            if (closeOnSelect) {
              closeMenu();
            }
          }
        })}
        {...styleProps}
        {...props}
      />
    );
  },
);

MenuItem.displayName = 'MenuItem';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuDivider = forwardRef((props, ref) => (
  <Divider ref={ref} orientation="horizontal" {...props} />
));

MenuDivider.displayName = 'MenuDivider';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuGroup = forwardRef(({ children, title, ...rest }, ref) => (
  <Box ref={ref} role="group">
    {title && (
      <Text mx={4} my={2} fontWeight="semibold" fontSize="sm" {...rest}>
        {title}
      </Text>
    )}
    {children}
  </Box>
));

MenuGroup.displayName = 'MenuGroup';

//////////////////////////////////////////////////////////////////////////////////////////

export { Menu, MenuButton, MenuList, MenuItem };
