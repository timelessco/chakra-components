import React, { forwardRef } from "react";
import { Box, PseudoBox, Text, Divider, Link } from "@chakra-ui/core";

import { wrapEvent } from "@chakra-ui/core/dist/utils";
import { useMenuItemStyle } from "@chakra-ui/core/dist/Menu/styles";

import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";

/* =========================================================================
  Default Link component when no `as` is not provided for SubMenuItemLink
  ========================================================================== */

const SubMenuItemLink = forwardRef((props, ref) => {
  const styleProps = useMenuItemStyle();
  return <Link ref={ref} {...props} {...styleProps} />;
});

SubMenuItemLink.displayName = "SubMenuItemLink";

/* =========================================================================
  SubMenuItem Component
  ========================================================================== */

const SubMenuItem = forwardRef(
  (
    {
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
      role = "menuitem",
      as: Comp = SubMenuItemLink,
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
          onClick={wrapEvent(onClick, event => {
            if (closeOnSelect) {
              closeMenu();
            }
          })}
          onMouseEnter={wrapEvent(onMouseEnter, event => {
            if (
              focusableItems &&
              focusableItems.current &&
              focusableItems.current.length > 0
            ) {
              let nextIndex = focusableItems.current.indexOf(
                event.currentTarget,
              );
              focusAtIndex(nextIndex);
            }
          })}
          onMouseLeave={wrapEvent(onMouseLeave, () => {
            focusAtIndex(-1);
          })}
          onKeyDown={wrapEvent(onKeyDown, event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();

              if (onClick) {
                onClick();
              }

              if (closeOnSelect) {
                closeMenu();
              }
            }

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
          })}
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
