import React, { forwardRef } from "react";
import { Box, PseudoBox, Text, Divider, Link } from "@chakra-ui/core";

import { useMenuItemStyle } from "@chakra-ui/core/dist/Menu/styles";

import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";

/* =========================================================================
  Default Link component when no `as` is not provided for SubMenuItemLink
  ========================================================================== */

const SubMenuItemLink = forwardRef((props, ref) => {
  return <Link ref={ref} {...props} />;
});

SubMenuItemLink.displayName = "SubMenuItemLink";

/* =========================================================================
  SubMenuItem Component
  ========================================================================== */

const SubMenuItem = forwardRef(
  (
    {
      role = "menuitem",
      as: Comp = SubMenuItemLink,
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
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

    const handleOnClick = event => {
      if (closeOnSelect) {
        closeMenu();
      }

      onClick && onClick(event);
    };

    const handleOnMouseEnter = event => {
      if (
        focusableItems &&
        focusableItems.current &&
        focusableItems.current.length > 0
      ) {
        let nextIndex = focusableItems.current.indexOf(event.currentTarget);
        focusAtIndex(nextIndex);
      }

      onMouseEnter && onMouseEnter(event);
    };

    const handleOnMouseLeave = event => {
      focusAtIndex(-1);

      onMouseLeave && onMouseLeave(event);
    };

    const handleOnKeyDown = event => {
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

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (onClick) {
          onClick();
        }

        if (closeOnSelect) {
          closeMenu();
        }
      }

      onKeyDown && onKeyDown(event);
    };

    const styleProps = useMenuItemStyle();

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
          onClick={handleOnClick}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onKeyDown={handleOnKeyDown}
          {...styleProps}
          {...props}
        />
      </PseudoBox>
    );
  },
);

SubMenuItem.displayName = "SubMenuItem";

/* =========================================================================
  SubMenuDivider
  ========================================================================== */

const SubMenuDivider = forwardRef((props, ref) => (
  <Divider ref={ref} orientation="horizontal" {...props} />
));

SubMenuDivider.displayName = "SubMenuDivider";

/* =========================================================================
  SubMenuGroup
  ========================================================================== */

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

export { SubMenuItem, SubMenuDivider, SubMenuGroup };
