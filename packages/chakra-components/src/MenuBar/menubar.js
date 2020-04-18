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
      as: Comp = PseudoUnorderedList,
      ariaLabel,
      spanParent,
      spanMenuBar,
      trigger = "hover",
      mode = "horizontal",
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const menuBarId = `menubar-${useId()}`;

    const focusableMenuBarItems = useRef(null);
    const menuBarRef = useRef(null);

    useEffect(() => {
      if (menuBarRef && menuBarRef.current) {
        let focusables = getFocusables(menuBarRef.current).filter(node =>
          ["menuitem"].includes(node.getAttribute("role")),
        );

        focusableMenuBarItems.current = focusables;
        updateTabIndex(0);

        if (spanParent) {
          menuBarRef.current.parentElement.style.position = "relative";
        }

        if (spanMenuBar) {
          menuBarRef.current.style.position = "relative";
        }
      }
    }, []);

    useEffect(() => {
      if (activeIndex !== -1) {
        focusableMenuBarItems.current[activeIndex] &&
          focusableMenuBarItems.current[activeIndex].focus();

        updateTabIndex(activeIndex);
      }
    }, [activeIndex]);

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

    const context = {
      focusableMenuBarItems,
      activeIndex,
      setActiveIndex,
      updateTabIndex,
      spanParent,
      spanMenuBar,
      trigger,
      menuBarRef,
    };
    const menuBarForkRef = useForkRef(menuBarRef, ref);
    const styleProps = useMenuBarStyle();

    return (
      <MenuBarContext.Provider value={context}>
        <Comp
          ref={menuBarForkRef}
          id={menuBarId}
          role={role}
          ariaLabel={ariaLabel}
          display="flex"
          flexDirection={mode && mode === "horizontal" ? "row" : "column"}
          {...styleProps}
          alignItems={mode && mode === "horizontal" ? "center" : "left"}
          {...props}
        />
      </MenuBarContext.Provider>
    );
  },
);

MenuBar.displayName = "MenuBar";

export { MenuBar };
