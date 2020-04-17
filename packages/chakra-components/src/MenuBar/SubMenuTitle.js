import React, { forwardRef, useRef } from "react";
import { Link } from "@chakra-ui/core";

import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";
import { useForkRef, wrapEvent } from "@chakra-ui/core/dist/utils";

import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for SubMenuTitle
  ========================================================================== */

const SubMenuTitleLink = forwardRef((props, ref) => {
  const styleProps = useMenuBarItemStyle();
  return <Link ref={ref} {...styleProps} {...props} />;
});

SubMenuTitleLink.displayName = "SubMenuTitleLink";

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
      ...rest
    },
    ref,
  ) => {
    const {
      isOpen,
      focusOnLastItem,
      focusOnFirstItem,
      closeMenu,
      buttonId,
      autoSelect,
      openMenu,
      titleRef,
      mouseOnSubMenuTitle,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
    } = useMenuBarContext();

    const openTimeout = useRef(null);

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

    const menutitleRef = useForkRef(titleRef, ref);

    return (
      <Comp
        aria-haspopup="true"
        aria-expanded={isOpen}
        id={buttonId}
        ref={menutitleRef}
        role={role}
        tabIndex={0}
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

          if (isOpen) {
            closeMenu();
          } else {
            if (autoSelect) {
              focusOnFirstItem();
            } else {
              openMenu();
            }
          }
        })}
        onMouseEnter={() => {
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
        }}
        onMouseLeave={wrapEvent(onMouseLeave, () => {
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
          }, 300);
        })}
        onMouseDown={wrapEvent(onMouseDown, event => {
          event.preventDefault();
        })}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

SubMenuTitle.displayName = "SubMenuTitle";

export { SubMenuTitle };
