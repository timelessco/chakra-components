import React, {
  useContext,
  useRef,
  forwardRef,
  useEffect,
  useState,
  createContext,
} from "react";
import {
  Box,
  PseudoBox,
  usePrevious,
  useColorMode,
  Text,
  Divider,
  Link,
} from "@chakra-ui/core";
import { useId } from "@reach/auto-id";

import {
  useForkRef,
  getFocusables,
  wrapEvent,
} from "@chakra-ui/core/dist/utils";
import { useMenuBarItemStyle } from "./styles";
import {
  useMenuListStyle,
  useMenuItemStyle,
} from "@chakra-ui/core/dist/Menu/styles";
import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";

import { useMenuBarContext } from "./useMenuBarContext";
import MenuBar from "./menubar";

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBarItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuBarItemStyle();
  return <Link ref={ref} {...styleProps} {...props} />;
});

MenuBarItemLink.displayName = "MenuBarItemLink";

//////////////////////////////////////////////////////////////////////////////////////////
const MenuBarItem = forwardRef(
  (
    {
      onKeyDown,
      onClick,
      role = "menuitem",
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

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
      } else if (event.key === "Home") {
        setActiveIndex(0);
      } else if (event.key === "End") {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
      }

      // Set focus based on first character
      if (/^[a-z0-9_-]$/i.test(event.key)) {
        event.stopPropagation();
        event.preventDefault();
        let foundNode = focusableMenuBarItems.current.find(item =>
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
          onKeyDown={handleKeyDown}
          onClick={wrapEvent(onClick, event => {
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

MenuBarItem.displayName = "MenuBarItem";

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

  const { colorMode } = useColorMode();

  useEffect(() => {
    if (_isOpen && menuRef && menuRef.current) {
      let focusables = getFocusables(menuRef.current).filter(node =>
        ["menuitem", "menuitemradio", "menuitemcheckbox"].includes(
          node.getAttribute("role"),
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
      ({ node, index }) => index === 0 && node.setAttribute("tabindex", 0),
    );
  };

  const updateTabIndex = index => {
    if (focusableItems.current.length > 0) {
      let nodeAtIndex = focusableItems.current[index];

      focusableItems.current.forEach(node => {
        if (node !== nodeAtIndex) {
          node.setAttribute("tabindex", -1);
        }
      });

      nodeAtIndex.setAttribute("tabindex", 0);
    }
  };

  const resetTabIndex = () => {
    if (focusableItems.current) {
      focusableItems.current.forEach(node => node.setAttribute("tabindex", -1));
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

  const focusAtIndex = index => {
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
  };

  return (
    <SubMenuContext.Provider value={context}>
      <PseudoBox as="li" role="none" display="flex">
        {typeof children === "function"
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
      "useMenuContext must be used within a MenuContext Provider",
    );
  }

  return context;
}

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuTitleLink = forwardRef((props, ref) => {
  const styleProps = useMenuBarItemStyle();
  return <Link ref={ref} {...styleProps} {...props} />;
});

SubMenuTitleLink.displayName = "SubMenuTitleLink";

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuTitle = forwardRef(
  (
    {
      onClick,
      onKeyDown,
      onMouseLeave,
      onMouseEnter,
      onMouseDown,
      as: Comp = SubMenuTitleLink,
      role = "menuitem",
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
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      resetTabIndex,
    } = useMenuBarContext();

    const openTimeout = useRef(null);

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusOnFirstItem();
        resetTabIndex();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusOnLastItem();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
      }

      if (event.key === "Home") {
        setActiveIndex(0);
      }

      if (event.key === "End") {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
      }

      if (event.key === "Enter" || event.key === " ") {
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
        let foundNode = focusableMenuBarItems.current.find(item =>
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
        onClick={wrapEvent(onClick, event => {
          if (
            focusableMenuBarItems &&
            focusableMenuBarItems.current.length > 0
          ) {
            let nextIndex = focusableMenuBarItems.current.indexOf(
              event.currentTarget,
            );
            setActiveIndex(nextIndex);
          }

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
        onMouseEnter={() => {
          mouseOnSubMenuTitle.current = true;

          openTimeout.current = setTimeout(() => {
            if (!isOpen) {
              if (autoSelect) {
                focusOnFirstItem();
              } else {
                openMenu();
              }
            }
          }, 300);
        }}
        onMouseLeave={wrapEvent(onMouseLeave, () => {
          mouseOnSubMenuTitle.current = false;

          if (openTimeout.current) {
            clearTimeout(openTimeout.current);
            openTimeout.current = null;
          }

          setTimeout(() => {
            if (mouseOnSubMenuTitle.current === false) {
              if (isOpen) {
                closeMenu();
              }
            }
          }, 300);
        })}
        onMouseDown={wrapEvent(onMouseDown, event => {
          event.preventDefault();
        })}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

SubMenuTitle.displayName = "SubMenuTitle";

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuList = ({
  onKeyDown,
  onBlur,
  as: Comp = "ul",
  ariaLabel,
  gutter,
  skid,
  width,
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
  } = useSubMenuContext();

  const handleKeyDown = event => {
    const count = focusableItems.current.length;
    let nextIndex;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (index + 1) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (index - 1 + count) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "Home") {
      focusOnFirstItem();
    } else if (event.key === "End") {
      focusOnLastItem();
    } else if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "Escape") {
      closeMenu();
    }

    // Set focus based on first character
    if (/^[a-z0-9_-]$/i.test(event.key)) {
      event.stopPropagation();
      event.preventDefault();
      let foundNode = focusableItems.current.find(item =>
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
  const handleBlur = event => {
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

    if (width === "full" || width === "100%") {
      newData.offsets.popper.left = 0;
    }

    return newData;
  }

  return (
    <Popper
      as={Comp}
      bg="inherit"
      usePortal={false}
      isOpen={isOpen}
      anchorEl={titleRef.current}
      placement={placement}
      modifiers={{
        preventOverflow: {
          enabled: true,
          boundariesElement: "viewport",
        },
        fixedWidth: {
          enabled: true,
          fn: fixedWidth,
          order: 840,
        },
        offset: { enabled: true, offset: `${skid}, ${gutter}` },
      }}
      minW="3xs"
      rounded="md"
      role="menu"
      ref={menuRef}
      py={2}
      aria-label={ariaLabel}
      onMouseEnter={() => {
        mouseOnSubMenuTitle.current = true;
      }}
      onMouseLeave={() => {
        mouseOnSubMenuTitle.current = false;

        setTimeout(() => {
          if (mouseOnSubMenuTitle.current === false) {
            closeMenu();
          }
        }, 300);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      tabIndex={-1}
      zIndex="2"
      _focus={{
        outline: 0,
      }}
      fontFamily="Inter"
      fontSize="md"
      width={width}
      {...styleProps}
      {...props}
    />
  );
};

SubMenuList.displayName = "SubMenuList";

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuItemStyle();
  return <Link ref={ref} {...props} {...styleProps} />;
});

SubMenuItemLink.displayName = "SubMenuItemLink";

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuItem = forwardRef(
  (
    {
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
      role = "menuitem",
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
          onClick={wrapEvent(onClick, event => {
            if (closeOnSelect) {
              closeMenu();
            }
          })}
          onMouseEnter={wrapEvent(onMouseEnter, event => {
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
          onKeyDown={wrapEvent(onKeyDown, event => {
            if (event.key === "Enter" || event.key === " ") {
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

            if (event.key === "ArrowRight") {
              event.preventDefault();
              nextIndex = (index + 1) % menuBarItemscount;
              setActiveIndex(nextIndex);
              closeMenu();
            }

            if (event.key === "ArrowLeft") {
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

SubMenuItem.displayName = "SubMenuItem";

//////////////////////////////////////////////////////////////////////////////////////////

const SubMenuListArrow = props => <PopperArrow {...props} />;

const SubMenuDivider = forwardRef((props, ref) => (
  <Divider ref={ref} orientation="horizontal" {...props} />
));

SubMenuDivider.displayName = "SubMenuDivider";

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

SubMenuGroup.displayName = "SubMenuGroup";

//////////////////////////////////////////////////////////////////////////////////////////

export default MenuBar;
export {
  MenuBarItem,
  SubMenu,
  SubMenuTitle,
  SubMenuList,
  SubMenuListArrow,
  SubMenuItem,
  SubMenuDivider,
  SubMenuGroup,
};
