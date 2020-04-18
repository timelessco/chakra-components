import React, { forwardRef, useRef } from "react";
import { Link, Icon } from "@chakra-ui/core";

import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";
import { useForkRef, wrapEvent } from "@chakra-ui/core/dist/utils";

import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for SubMenuTitle
  ========================================================================== */

const SubMenuTitleLink = forwardRef((props, ref) => {
  return <Link ref={ref} {...props} />;
});

SubMenuTitleLink.displayName = "SubMenuTitleLink";

/* =========================================================================
  Styled Link component when no `as` is not provided for SubMenuTitle
  ========================================================================== */

const StyledSubMenuTitleLink = forwardRef(({ children, ...props }, ref) => {
  return (
    <Link
      rounded="md"
      px={1}
      py={1}
      _hover={{ bg: "gray.100" }}
      ref={ref}
      {...props}
    >
      {children}
      <Icon ml={0} name="chevron-down" color="gray.500" />
    </Link>
  );
});

StyledSubMenuTitleLink.displayName = "StyledSubMenuTitleLink";

/* =========================================================================
  SubMenuTitle Component
  ========================================================================== */

const SubMenuTitle = forwardRef(
  (
    {
      onClick,
      onKeyDown,
      onMouseLeave,
      onMouseEnter,
      onMouseDown,
      as: Comp = SubMenuTitleLink,
      role = "menuitem",
      variant,
      ...rest
    },
    ref,
  ) => {
    const {
      isOpen,
      focusOnLastItem,
      focusOnFirstItem,
      closeMenu,
      autoSelect,
      openMenu,
      titleRef,
      mouseOnSubMenuTitle,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      trigger,
    } = useMenuBarContext();

    if (variant === "styledTitle") {
      Comp = StyledSubMenuTitleLink;
    }

    let eventHandlers = {};

    if (trigger === "click") {
      eventHandlers = {
        onClick: event => {
          console.log("open");
          console.log("%cisOpen", "color: #0088cc", isOpen);
          if (isOpen) {
            closeMenu();
          } else {
            if (autoSelect) {
              focusOnFirstItem();
            } else {
              openMenu();
            }
          }

          onClick && onClick(event);
        },

        onMouseDown: wrapEvent(onMouseDown, event => {
          event.preventDefault();
        }),
      };
    }

    const openTimeout = useRef(null);

    if (trigger === "hover") {
      eventHandlers = {
        onMouseEnter: event => {
          mouseOnSubMenuTitle.current = true;

          openTimeout.current = setTimeout(() => {
            if (!isOpen) {
              if (autoSelect) {
                focusOnFirstItem();
              } else {
                openMenu();
              }
            }
          }, 300);

          onMouseEnter && onMouseEnter(event);
        },

        onMouseLeave: event => {
          mouseOnSubMenuTitle.current = false;

          if (openTimeout.current) {
            clearTimeout(openTimeout.current);
            openTimeout.current = null;
          }

          setTimeout(() => {
            if (mouseOnSubMenuTitle.current === false) {
              if (isOpen) {
                closeMenu();
              }
            }
          }, 150);

          onMouseLeave && onMouseLeave(event);
        },

        onClick: event => {
          if (
            focusableMenuBarItems &&
            focusableMenuBarItems.current.length > 0
          ) {
            let nextIndex = focusableMenuBarItems.current.indexOf(
              event.currentTarget,
            );
            setActiveIndex(nextIndex);
          }

          onClick && onClick(event);
        },
      };
    }

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusOnFirstItem();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusOnLastItem();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        if (index === -1) {
          nextIndex = (index + 2) % count;
        } else {
          nextIndex = (index + 1) % count;
        }

        setActiveIndex(nextIndex);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextIndex = (index - 1 + count) % count;
        setActiveIndex(nextIndex);
      }

      if (event.key === "Home") {
        setActiveIndex(0);
      }

      if (event.key === "End") {
        setActiveIndex(focusableMenuBarItems.current.length - 1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (isOpen) {
          closeMenu();
        } else {
          if (autoSelect) {
            focusOnFirstItem();
          } else {
            openMenu();
          }
        }
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

    const styleProps = useMenuBarItemStyle();

    const menutitleRef = useForkRef(titleRef, ref);

    return (
      <Comp
        ref={menutitleRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        role={role}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...eventHandlers}
        {...styleProps}
        {...rest}
      />
    );
  },
);

SubMenuTitle.displayName = "SubMenuTitle";

export { SubMenuTitle };
