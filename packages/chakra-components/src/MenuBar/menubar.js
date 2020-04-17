import React, {
  createContext,
  useState,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import { Flex } from "@chakra-ui/core";
import { useId } from "@reach/auto-id";

import { getFocusables, useForkRef } from "@chakra-ui/core/dist/utils";
import { useMenuBarStyle } from "./styles";

/* =========================================================================
  MenuBarContext
  ========================================================================== */

export const MenuBarContext = createContext();

/* =========================================================================
  Default ul component when no `as` is not provided for MenuBar
  ========================================================================== */

const PseudoUnorderedList = forwardRef(({ ...props }, ref) => {
  return <Flex as="ul" ref={ref} {...props} />;
});

PseudoUnorderedList.displayName = "PseudoUnorderedList";

/* =========================================================================
  MenuBar Component
  ========================================================================== */

const MenuBar = forwardRef(
  (
    {
      role = "menubar",
      ariaLabel,
      defaultActiveIndex,
      as: Comp = PseudoUnorderedList,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || -1);

    const menuBarId = `menubar-${useId()}`;

    const focusableMenuBarItems = useRef(null);
    const menuBarRef = useRef(null);

    const styleProps = useMenuBarStyle();

    useEffect(() => {
      if (menuBarRef && menuBarRef.current) {
        let focusables = getFocusables(menuBarRef.current).filter(node =>
          ["menuitem", "menuitemradio", "menuitemcheckbox"].includes(
            node.getAttribute("role"),
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
        ({ node, index }) => index === 0 && node.setAttribute("tabindex", 0),
      );
    };

    const updateTabIndex = index => {
      if (focusableMenuBarItems.current.length > 0) {
        let nodeAtIndex = focusableMenuBarItems.current[index];

        focusableMenuBarItems.current.forEach(node => {
          if (node !== nodeAtIndex) {
            node.setAttribute("tabindex", -1);
          }
        });

        nodeAtIndex.setAttribute("tabindex", 0);
      }
    };

    const resetTabIndex = () => {
      if (focusableMenuBarItems.current) {
        focusableMenuBarItems.current.forEach(node =>
          node.setAttribute("tabindex", -1),
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

    const menuBarForkRef = useForkRef(menuBarRef, ref);

    return (
      <MenuBarContext.Provider value={context}>
        <Comp
          ref={menuBarForkRef}
          id={menuBarId}
          role={role}
          ariaLabel={ariaLabel}
          {...styleProps}
          {...props}
        />
      </MenuBarContext.Provider>
    );
  },
);

MenuBar.displayName = "MenuBar";

export default MenuBar;
