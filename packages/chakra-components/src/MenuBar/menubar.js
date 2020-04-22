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
      mode: _mode = "horizontal",
      isCollapsable,
      responsive,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mode, setMode] = useState(_mode);

    const menuBarId = `menubar-${useId()}`;

    const focusableMenuBarItems = useRef(null);
    const menuBarRef = useRef(null);

    if (isCollapsable && mode === "vertical") {
      trigger = "click";
    }

    useEffect(() => {
      if (menuBarRef && menuBarRef.current) {
        let focusables = getFocusables(menuBarRef.current).filter(node =>
          node.getAttribute("data-menubar-item"),
        );

        focusableMenuBarItems.current = focusables;

        if (spanParent) {
          menuBarRef.current.parentElement.style.position = "relative";
        }

        if (spanMenuBar) {
          menuBarRef.current.style.position = "relative";
        }

        if (responsive) {
          menuBarRef.current.style.flexDirection = "row";
          const menuBarChildrens = Array.from(menuBarRef.current.children);
          let width = 0;
          menuBarChildrens.forEach(node => {
            width += node.children[0].clientWidth;
          });

          const handleResize = () => {
            if (menuBarRef && menuBarRef.current) {
              const menuBarWidth = menuBarRef.current.clientWidth;
              if (menuBarWidth - width < 100) {
                setMode("vertical");
                menuBarRef.current.style.flexDirection = "column";
              } else {
                setMode("horizontal");
                menuBarRef.current.style.flexDirection = "row";
              }
            }
          };

          handleResize();
          window.addEventListener("resize", handleResize);
        }
      }
    }, [spanParent, spanMenuBar, responsive]);

    useEffect(() => {
      updateTabIndex(activeIndex);
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
      spanParent,
      spanMenuBar,
      trigger,
      mode,
      isCollapsable,
    };

    const menuBarForkRef = useForkRef(menuBarRef, ref);
    const styleProps = useMenuBarStyle();

    let modeStyleProps = {};

    if (mode === "vertical") {
      modeStyleProps = {
        flexDirection: "column",
      };
    } else {
      modeStyleProps = {
        flexDirection: "row",
      };
    }

    return (
      <MenuBarContext.Provider value={context}>
        <Comp
          ref={menuBarForkRef}
          id={menuBarId}
          role={role}
          ariaLabel={ariaLabel}
          ariaOrientation={mode}
          {...styleProps}
          {...modeStyleProps}
          {...props}
        />
      </MenuBarContext.Provider>
    );
  },
);

MenuBar.displayName = "MenuBar";

export { MenuBar };
