import React, { createContext, useState, useRef, useEffect } from "react";
import { useColorMode, Flex } from "@chakra-ui/core";
import { useId } from "@reach/auto-id";
import { getFocusables } from "@chakra-ui/core/dist/utils";
import { useMenuBarContext } from "./useMenuBarContext";

/* =========================================================================
  SubMenuContext
  ========================================================================== */

const SubMenuContext = createContext();

/* =========================================================================
  SubMenu Component
  ========================================================================== */

const SubMenu = ({
  autoSelect = true,
  closeOnBlur = true,
  closeOnSelect = true,
  isOpen: isOpenProp,
  defaultIsOpen,
  onOpen,
  onClose,
  defaultActiveIndex,
  children,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || -1);
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);
  const { current: isControlled } = useRef(isOpenProp != null);

  const _isOpen = isControlled ? isOpenProp : isOpen;

  const menuId = `menu-${useId()}`;

  const focusableItems = useRef(null);
  const menuRef = useRef(null);
  const titleRef = useRef(null);
  const mouseOnSubMenuTitle = useRef(false);

  const { colorMode } = useColorMode();

  const { isCollapsable } = useMenuBarContext();

  useEffect(() => {
    if (_isOpen && menuRef && menuRef.current) {
      let focusables = getFocusables(menuRef.current).filter(node =>
        ["menuitem", "menuitemradio", "menuitemcheckbox"].includes(
          node.getAttribute("role"),
        ),
      );

      focusableItems.current = menuRef.current ? focusables : [];
    }
  }, [_isOpen]);

  useEffect(() => {
    if (activeIndex !== -1 && _isOpen) {
      focusableItems.current[activeIndex] &&
        focusableItems.current[activeIndex].focus();
      updateTabIndex(activeIndex);
    }
  }, [activeIndex, _isOpen]);

  // const initTabIndex = () => {
  //   focusableItems.current.forEach(
  //     ({ node, index }) => index === 0 && node.setAttribute("tabindex", 0),
  //   );
  // };

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
    menuId,
    openMenu,
    autoSelect,
    closeOnSelect,
    closeOnBlur,
    colorMode,
    mouseOnSubMenuTitle,
  };

  let modeStyleProps = {};

  if (isCollapsable) {
    modeStyleProps = {
      flexDirection: "column",
    };
  }

  return (
    <SubMenuContext.Provider value={context}>
      <Flex as="li" role="none" {...modeStyleProps} {...props}>
        {typeof children === "function"
          ? children({
              isOpen: _isOpen,
              onClose: closeMenu,
            })
          : children}
      </Flex>
    </SubMenuContext.Provider>
  );
};

SubMenu.displayName = "SubMenu";

export { SubMenu, SubMenuContext };
