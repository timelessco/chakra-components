import React, { forwardRef } from "react";
import { Link, Flex } from "@chakra-ui/core";
import { useMenuBarContext } from "./useMenuBarContext";

import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for MenuBarItem
  ========================================================================== */

const MenuBarItemLink = forwardRef((props, ref) => {
  return <Link ref={ref} {...props} />;
});

MenuBarItemLink.displayName = "MenuBarItemLink";

/* =========================================================================
  MenuBarItem Component
  ========================================================================== */

const MenuBarItem = forwardRef(
  (
    {
      role = "menuitem",
      as: Comp = MenuBarItemLink,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      focusAtIndex,
      mode,
    } = useMenuBarContext();

    let switchArrowsOnMode = ["ArrowRight", "ArrowLeft"];

    if (mode === "vertical") {
      switchArrowsOnMode = ["ArrowDown", "ArrowUp"];
    }

    const handleOnClick = event => {
      let nextIndex = focusableMenuBarItems.current.indexOf(
        event.currentTarget,
      );
      setActiveIndex(nextIndex);

      onClick && onClick(event);
    };

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === switchArrowsOnMode[0]) {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      if (event.key === switchArrowsOnMode[1]) {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      if (event.key === "Home") {
        setActiveIndex(0);
        focusAtIndex(0);
      }

      if (event.key === "End") {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
        focusAtIndex(focusableMenuBarItems.current.length - 1);
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
          focusAtIndex(nextIndex);
        }
      }

      onKeyDown && onKeyDown(event);
    };

    const styleProps = useMenuBarItemStyle();

    return (
      <Flex as="li" role="none" align="center">
        <Comp
          ref={ref}
          role={role}
          tabIndex={0}
          data-menubar-item={true}
          onKeyDown={handleKeyDown}
          onClick={handleOnClick}
          {...styleProps}
          {...props}
        />
      </Flex>
    );
  },
);

MenuBarItem.displayName = "MenuBarItem";

export { MenuBarItem };
