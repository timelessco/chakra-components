import React, {
  useContext,
  useRef,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { createContext } from 'react';
import {
  Box,
  PseudoBox,
  Flex,
  ThemeProvider,
  ColorModeProvider,
  LightMode,
  theme,
  usePrevious,
  useColorMode,
  Text,
  Divider,
  Link,
  Icon,
} from '@chakra-ui/core';
import { useId } from '@reach/auto-id';

import {
  useForkRef,
  getFocusables,
  wrapEvent,
} from '@chakra-ui/core/dist/utils';
import {
  useMenuBarStyle,
  useMenuBarItemStyle,
  useMenuItemStyle,
} from './styles';
import { useMenuListStyle } from '@chakra-ui/core/dist/Menu/styles';
import Popper from '@chakra-ui/core/dist/Popper';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBarContext = createContext();

//////////////////////////////////////////////////////////////////////////////////////////

const PseudoUnorderedList = forwardRef(({ ...props }, ref) => {
  return <Flex as="ul" ref={ref} {...props} />;
});

PseudoUnorderedList.displayName = 'PseudoUnorderedList';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBar = ({
  children,
  role = 'menubar',
  ariaLabel,
  defaultActiveIndex,
  as: Comp = PseudoUnorderedList,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || -1);

  const menuBarId = `menubar-${useId()}`;

  const focusableMenuBarItems = useRef(null);
  const menuBarRef = useRef(null);

  const styleProps = useMenuBarStyle();

  useEffect(() => {
    if (menuBarRef && menuBarRef.current) {
      let focusables = getFocusables(menuBarRef.current).filter((node) =>
        ['menuitem', 'menuitemradio', 'menuitemcheckbox'].includes(
          node.getAttribute('role'),
        ),
      );

      focusableMenuBarItems.current = menuBarRef.current ? focusables : [];
      initTabIndex();
    }
  }, []);

  useEffect(() => {
    if (activeIndex !== -1) {
      focusableMenuBarItems.current[activeIndex] &&
        focusableMenuBarItems.current[activeIndex].focus();

      updateTabIndex(activeIndex);
    }
  }, [activeIndex]);

  const initTabIndex = () => {
    focusableMenuBarItems.current.forEach(
      ({ node, index }) => index === 0 && node.setAttribute('tabindex', 0),
    );
  };

  const updateTabIndex = (index) => {
    if (focusableMenuBarItems.current.length > 0) {
      let nodeAtIndex = focusableMenuBarItems.current[index];

      focusableMenuBarItems.current.forEach((node) => {
        if (node !== nodeAtIndex) {
          node.setAttribute('tabindex', -1);
        }
      });

      nodeAtIndex.setAttribute('tabindex', 0);
    }
  };

  const resetTabIndex = () => {
    if (focusableMenuBarItems.current) {
      focusableMenuBarItems.current.forEach((node) =>
        node.setAttribute('tabindex', -1),
      );
    }
  };

  const context = {
    focusableMenuBarItems,
    activeIndex,
    setActiveIndex,
    initTabIndex,
    updateTabIndex,
    resetTabIndex,
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Box fontFamily="body">
          <LightMode>
            <MenuBarContext.Provider value={context}>
              <Box as="nav" ariaLabel={ariaLabel}>
                <Comp
                  ref={menuBarRef}
                  id={menuBarId}
                  role={role}
                  ariaLabel={ariaLabel}
                  {...styleProps}
                  {...props}
                  onFocus={() => {
                    if (activeIndex === -1) {
                      setActiveIndex(0);
                    }
                  }}
                >
                  {children}
                </Comp>
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

const MenuBarItemLink = forwardRef(
  ({ isActive, isDisabled, ...props }, ref) => {
    const stylePropsArgs = { isActive, isDisabled };

    const styleProps = useMenuBarItemStyle(stylePropsArgs);
    return <Link ref={ref} {...styleProps} {...props} />;
  },
);

MenuBarItemLink.displayName = 'MenuBarItemLink';

//////////////////////////////////////////////////////////////////////////////////////////
const MenuBarItem = forwardRef(
  (
    {
      onKeyDown,
      onClick,
      isActive,
      isDisabled,
      role = 'menuitem',
      as: Comp = MenuBarItemLink,
      ...props
    },
    ref,
  ) => {
    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
    } = useMenuBarContext();

    const handleKeyDown = (event) => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
      } else if (event.key === 'Home') {
        setActiveIndex(0);
      } else if (event.key === 'End') {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
      }

      // Set focus based on first character
      if (/^[a-z0-9_-]$/i.test(event.key)) {
        event.stopPropagation();
        event.preventDefault();
        let foundNode = focusableMenuBarItems.current.find((item) =>
          item.textContent.toLowerCase().startsWith(event.key),
        );
        if (foundNode) {
          nextIndex = focusableMenuBarItems.current.indexOf(foundNode);
          setActiveIndex(nextIndex);
        }
      }

      onKeyDown && onKeyDown(event);
    };

    return (
      <PseudoBox as="li" role="none" display="flex" alignItems="center">
        <Comp
          ref={ref}
          role={role}
          tabIndex={0}
          aria-disabled={isDisabled}
          onKeyDown={handleKeyDown}
          onClick={wrapEvent(onClick, (event) => {
            if (isDisabled) {
              event.stopPropagation();
              event.preventDefault();
              return;
            }
            if (
              focusableMenuBarItems &&
              focusableMenuBarItems.current.length > 0
            ) {
              let nextIndex = focusableMenuBarItems.current.indexOf(
                event.currentTarget,
              );
              setActiveIndex(nextIndex);
            }
          })}
          {...props}
        />
      </PseudoBox>
    );
  },
);

MenuBarItem.displayName = 'MenuBarItem';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuContext = createContext();

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenu = ({
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
  const titleRef = useRef(null);
  const mouseOnSubMenuTitle = useRef(false);
  const mouseOnSubMenuList = useRef(false);

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
      titleRef.current && titleRef.current.focus();
    }

    if (activeIndex === -1 && _isOpen) {
      menuRef.current && menuRef.current.focus();
    }
  }, [activeIndex, _isOpen, titleRef, menuRef, wasPreviouslyOpen]);

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
    titleRef,
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
    mouseOnSubMenuTitle,
    mouseOnSubMenuList,
  };

  return (
    <SubMenuContext.Provider value={context}>
      <PseudoBox as="li" role="none" display="flex">
        {typeof children === 'function'
          ? children({ isOpen: _isOpen, onClose: closeMenu })
          : children}
      </PseudoBox>
    </SubMenuContext.Provider>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////

export function useSubMenuContext() {
  const context = useContext(SubMenuContext);

  if (context === undefined) {
    throw new Error(
      'useMenuContext must be used within a MenuContext Provider',
    );
  }

  return context;
}

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuTitleLink = forwardRef(
  ({ isActive, isDisabled, children, ...props }, ref) => {
    const stylePropsArgs = { isActive, isDisabled };

    const styleProps = useMenuBarItemStyle(stylePropsArgs);
    return (
      <React.Fragment>
        <Link ref={ref} {...styleProps} {...props}>
          {children}
        </Link>
      </React.Fragment>
    );
  },
);

SubMenuTitleLink.displayName = 'SubMenuTitleLink';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuTitle = forwardRef(
  (
    {
      isDisabled,
      onClick,
      onKeyDown,
      onMouseLeave,
      onMouseEnter,
      onMouseDown,
      as: Comp = SubMenuTitleLink,
      role = 'menuitem',
      ...rest
    },
    ref,
  ) => {
    const {
      isOpen,
      focusOnLastItem,
      focusOnFirstItem,
      closeMenu,
      buttonId,
      autoSelect,
      openMenu,
      titleRef,
      mouseOnSubMenuTitle,
      mouseOnSubMenuList,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      resetTabIndex,
    } = useMenuBarContext();

    const handleKeyDown = (event) => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (isDisabled) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusOnFirstItem();
        resetTabIndex();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusOnLastItem();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
      }

      if (event.key === 'Home') {
        setActiveIndex(0);
      }

      if (event.key === 'End') {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (isOpen) {
          closeMenu();
        } else {
          if (autoSelect) {
            focusOnFirstItem();
          } else {
            openMenu();
          }
        }
      }

      // Set focus based on first character
      if (/^[a-z0-9_-]$/i.test(event.key)) {
        event.stopPropagation();
        event.preventDefault();
        let foundNode = focusableMenuBarItems.current.find((item) =>
          item.textContent.toLowerCase().startsWith(event.key),
        );
        if (foundNode) {
          nextIndex = focusableMenuBarItems.current.indexOf(foundNode);
          setActiveIndex(nextIndex);
        }
      }

      onKeyDown && onKeyDown(event);
    };

    const menutitleRef = useForkRef(titleRef, ref);

    return (
      <Comp
        aria-haspopup="true"
        aria-expanded={isOpen}
        id={buttonId}
        ref={menutitleRef}
        role={role}
        tabIndex={0}
        onClick={wrapEvent(onClick, (event) => {
          if (isDisabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
          }
          if (
            focusableMenuBarItems &&
            focusableMenuBarItems.current.length > 0
          ) {
            let nextIndex = focusableMenuBarItems.current.indexOf(
              event.currentTarget,
            );
            setActiveIndex(nextIndex);
          }
        })}
        onMouseEnter={() => {
          mouseOnSubMenuTitle.current = true;

          if (autoSelect) {
            focusOnFirstItem();
          } else {
            openMenu();
          }
        }}
        onMouseLeave={wrapEvent(onMouseLeave, () => {
          mouseOnSubMenuTitle.current = false;

          setTimeout(() => {
            if (!mouseOnSubMenuTitle.current && !mouseOnSubMenuList.current) {
              closeMenu();
            }
          }, 150);
        })}
        onMouseDown={wrapEvent(onMouseDown, (event) => {
          event.preventDefault();
        })}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

SubMenuTitle.displayName = 'SubMenuTitle';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuList = ({
  onKeyDown,
  onBlur,
  as: Comp = 'ul',
  ariaLabel,
  ...props
}) => {
  const {
    activeIndex: index,
    isOpen,
    focusAtIndex,
    focusOnFirstItem,
    focusOnLastItem,
    closeMenu,
    focusableItems,
    titleRef,
    menuRef,
    closeOnBlur,
    placement,
    mouseOnSubMenuTitle,
    mouseOnSubMenuList,
  } = useSubMenuContext();

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
      titleRef.current &&
      !menuRef.current.contains(event.relatedTarget) &&
      !titleRef.current.contains(event.relatedTarget)
    ) {
      closeMenu();
    }

    onBlur && onBlur(event);
  };

  const styleProps = useMenuListStyle();

  function fixedWidth(data) {
    const newData = data;
    newData.offsets.popper.left = 0;
    return newData;
  }

  return (
    <Popper
      as={Comp}
      usePortal={false}
      isOpen={isOpen}
      anchorEl={titleRef.current}
      placement={placement}
      modifiers={{
        preventOverflow: {
          enabled: true,
          boundariesElement: 'viewport',
        },
        fixedWidth: {
          enabled: true,
          fn: fixedWidth,
          order: 840,
        },
      }}
      minW="3xs"
      width="full"
      rounded="md"
      role="menu"
      marginTop="0 !important"
      ref={menuRef}
      py={2}
      aria-label={ariaLabel}
      onMouseEnter={() => {
        mouseOnSubMenuList.current = true;
      }}
      onMouseLeave={() => {
        mouseOnSubMenuList.current = false;

        setTimeout(() => {
          if (!mouseOnSubMenuTitle.current && !mouseOnSubMenuList.current) {
            closeMenu();
          }
        }, 150);
      }}
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

SubMenuList.displayName = 'SubMenuList';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuItemStyle();
  return <Link ref={ref} {...props} {...styleProps} />;
});

SubMenuItemLink.displayName = 'SubMenuItemLink';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuItem = forwardRef(
  (
    {
      isDisabled,
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
      role = 'menuitem',
      as: Comp = SubMenuItemLink,
      ...props
    },
    ref,
  ) => {
    const {
      focusableItems,
      focusAtIndex,
      closeOnSelect,
      closeMenu,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
    } = useMenuBarContext();

    return (
      <PseudoBox as="li" role="none" display="flex" alignItems="center">
        <Comp
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
            if (
              focusableItems &&
              focusableItems.current &&
              focusableItems.current.length > 0
            ) {
              let nextIndex = focusableItems.current.indexOf(
                event.currentTarget,
              );
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

            const menuBarItemscount = focusableMenuBarItems.current.length;
            let nextIndex;

            if (event.key === 'ArrowRight') {
              event.preventDefault();
              nextIndex = (index + 1) % menuBarItemscount;
              setActiveIndex(nextIndex);
              closeMenu();
            }

            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              nextIndex = (index - 1 + menuBarItemscount) % menuBarItemscount;
              setActiveIndex(nextIndex);
              closeMenu();
            }
          })}
          {...props}
        />
      </PseudoBox>
    );
  },
);

SubMenuItem.displayName = 'SubMenuItem';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuDivider = forwardRef((props, ref) => (
  <Divider ref={ref} orientation="horizontal" {...props} />
));

SubMenuDivider.displayName = 'SubMenuDivider';

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuGroup = forwardRef(({ children, title, ...rest }, ref) => (
  <Box ref={ref} role="group">
    {title && (
      <Text mx={4} my={2} fontWeight="semibold" fontSize="sm" {...rest}>
        {title}
      </Text>
    )}
    {children}
  </Box>
));

SubMenuGroup.displayName = 'SubMenuGroup';

//////////////////////////////////////////////////////////////////////////////////////////

export {
  MenuBar,
  MenuBarItem,
  SubMenu,
  SubMenuTitle,
  SubMenuList,
  SubMenuItem,
  SubMenuDivider,
  SubMenuGroup,
};
