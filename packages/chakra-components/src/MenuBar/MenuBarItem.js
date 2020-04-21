import React, { forwardRef } from "react";
import { Link, Flex } from "@chakra-ui/core";

import { useMenuBarContext } from "./useMenuBarContext";
import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for MenuBarItem
  ========================================================================== */

const MenuBarItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuBarItemStyle();

  return <Link ref={ref} width="full" {...styleProps} {...props} />;
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
      mode,
    } = useMenuBarContext();

    let arrows = ["ArrowRight", "ArrowLeft"];

    if (mode === "vertical") {
      arrows = ["ArrowDown", "ArrowUp"];
    }

    const handleOnClick = event => {
      if (focusableMenuBarItems && focusableMenuBarItems.current.length > 0) {
        let nextIndex = focusableMenuBarItems.current.indexOf(
          event.currentTarget,
        );
        setActiveIndex(nextIndex);
      }

      onClick && onClick(event);
    };

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === arrows[0]) {
        event.preventDefault();

        if (index === -1) {
          nextIndex = (index + 2) % count;
        } else {
          nextIndex = (index + 1) % count;
        }

        setActiveIndex(nextIndex);

        focusableMenuBarItems.current[nextIndex] &&
          focusableMenuBarItems.current[nextIndex].focus();
      }

      if (event.key === arrows[1]) {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);

        focusableMenuBarItems.current[nextIndex] &&
          focusableMenuBarItems.current[nextIndex].focus();
      }

      if (event.key === "Home") {
        setActiveIndex(0);
      }

      if (event.key === "End") {
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
      <Flex as="li" role="none" align="center">
        <Comp
          ref={ref}
          role={role}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={handleOnClick}
          data-menubar-item={true}
          {...props}
        />
      </Flex>
    );
  },
);

MenuBarItem.displayName = "MenuBarItem";

export { MenuBarItem };
