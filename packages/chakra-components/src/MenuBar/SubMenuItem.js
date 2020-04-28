import React, { forwardRef } from "react";
import { Box, Text, Divider, Link, Flex } from "@chakra-ui/core";
import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";

import { useMenuItemStyle } from "./styles";

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
      focusAtIndex,
      isCollapsable,
      mode,
    } = useMenuBarContext();

    const handleOnClick = event => {
      if (closeOnSelect) {
        closeMenu();

        let nextIndex = focusableMenuBarItems.current.indexOf(titleRef.current);
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      onClick && onClick(event);
    };

    const handleOnKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        closeMenu();

        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        closeMenu();

        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        closeOnSelect && closeMenu();
        onClick && onClick(event);
      }

      onKeyDown && onKeyDown(event);
    };

    const styleProps = useMenuItemStyle();

    if (isCollapsable && mode === "vertical") {
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
