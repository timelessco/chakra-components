import React, { forwardRef } from "react";
import { Link, PseudoBox } from "@chakra-ui/core";

import { useMenuBarContext } from "./useMenuBarContext";
import { wrapEvent } from "@chakra-ui/core/dist/utils";
import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for MenuBarItem
  ========================================================================== */

const MenuBarItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuBarItemStyle();
  return <Link ref={ref} {...styleProps} {...props} />;
});

MenuBarItemLink.displayName = "MenuBarItemLink";

/* =========================================================================
  MenuBarItem Component
  ========================================================================== */

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

        if (index === -1) {
          nextIndex = (index + 2) % count;
        } else {
          nextIndex = (index + 1) % count;
        }

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

export { MenuBarItem };
