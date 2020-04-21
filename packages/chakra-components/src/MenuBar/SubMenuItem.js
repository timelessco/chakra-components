import React, { forwardRef } from "react";
import { Box, Text, Divider, Link, Flex } from "@chakra-ui/core";

import { useMenuItemStyle } from "./styles";

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
    const { closeOnSelect, closeMenu, titleRef } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      isCollapsable,
    } = useMenuBarContext();

    const handleOnClick = event => {
      if (closeOnSelect) {
        closeMenu();
        if (focusableMenuBarItems && focusableMenuBarItems.current.length > 0) {
          let nextIndex = focusableMenuBarItems.current.indexOf(
            titleRef.current,
          );
          setActiveIndex(nextIndex);
          focusableMenuBarItems.current[nextIndex] &&
            focusableMenuBarItems.current[nextIndex].focus();
        }
      }

      onClick && onClick(event);
    };

    const handleOnKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
        focusableMenuBarItems.current[nextIndex] &&
          focusableMenuBarItems.current[nextIndex].focus();
        closeMenu();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
        focusableMenuBarItems.current[nextIndex] &&
          focusableMenuBarItems.current[nextIndex].focus();
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

    if (isCollapsable) {
      return (
        <Flex as="li" role="none" align="center">
          <Comp
            ref={ref}
            display="flex"
            alignItems="center"
            textDecoration="none"
            color="inherit"
            textAlign="left"
            outline="none"
            px={4}
            role={role}
            tabIndex={-1}
            onClick={handleOnClick}
            onKeyDown={handleOnKeyDown}
            {...styleProps}
            {...props}
          />
        </Flex>
      );
    }

    return (
      <Flex as="li" role="none" align="center">
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
          onKeyDown={handleOnKeyDown}
          {...styleProps}
          {...props}
        />
      </Flex>
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
