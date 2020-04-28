import React, { forwardRef } from "react";
import { Link } from "@chakra-ui/core";
import { useMenuBarContext } from "./useMenuBarContext";
import { useSubMenuContext } from "./useSubMenuContext";
import { useForkRef } from "@chakra-ui/core/dist/utils";

import { useMenuBarItemStyle } from "./styles";

/* =========================================================================
  Default Link component when no `as` is not provided for SubMenuTitle
  ========================================================================== */

const SubMenuTitleLink = forwardRef((props, ref) => {
  return <Link ref={ref} {...props} />;
});

SubMenuTitleLink.displayName = "SubMenuTitleLink";

/* =========================================================================
  SubMenuTitle Component
  ========================================================================== */

const SubMenuTitle = forwardRef(
  (
    {
      as: Comp = SubMenuTitleLink,
      role = "menuitem",
      onClick,
      onKeyDown,
      onMouseLeave,
      onMouseEnter,
      onMouseDown,
      onBlur,
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
      closeOnBlur,
      menuRef,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      focusAtIndex,
      trigger,
      mode,
    } = useMenuBarContext();

    let switchMenuBarArrowsOnMode = ["ArrowRight", "ArrowLeft"];
    let switchSubMenuArrowsOnMode = ["ArrowDown", "ArrowUp"];

    if (mode === "vertical") {
      switchMenuBarArrowsOnMode = ["ArrowDown", "ArrowUp"];
      switchSubMenuArrowsOnMode = ["ArrowRight", "ArrowLeft"];
    }

    let eventHandlers = {};

    if (trigger === "click") {
      eventHandlers = {
        onClick: event => {
          if (isOpen) {
            closeMenu();

            let nextIndex = focusableMenuBarItems.current.indexOf(
              event.currentTarget,
            );
            setActiveIndex(nextIndex);
            focusAtIndex(nextIndex);
          } else {
            if (autoSelect) {
              focusOnFirstItem();
            } else {
              openMenu();

              let nextIndex = focusableMenuBarItems.current.indexOf(
                event.currentTarget,
              );
              setActiveIndex(nextIndex);
            }
          }

          onClick && onClick(event);
        },
        onMouseDown: event => {
          // Prevent focusing on SubMenuTitle when in autoSelect
          if (autoSelect) {
            event.preventDefault();
          }

          onMouseDown && onMouseDown(event);
        },
        onBlur: event => {
          if (
            closeOnBlur &&
            isOpen &&
            menuRef.current &&
            titleRef.current &&
            !menuRef.current.contains(event.relatedTarget) &&
            !titleRef.current.contains(event.relatedTarget)
          ) {
            let nextIndex = focusableMenuBarItems.current.indexOf(
              event.currentTarget,
            );
            setActiveIndex(nextIndex);

            setTimeout(() => {
              closeMenu();
            }, 300);
          }
          onBlur && onBlur(event);
        },
      };
    }

    // Set timeout for having a smooth transition when switching SubMenus
    if (trigger === "hover") {
      eventHandlers = {
        onMouseEnter: event => {
          mouseOnSubMenuTitle.current = true;

          setTimeout(() => {
            if (!isOpen) {
              openMenu();
            }
          }, 299);

          onMouseEnter && onMouseEnter(event);
        },

        onMouseLeave: event => {
          mouseOnSubMenuTitle.current = false;

          setTimeout(() => {
            if (mouseOnSubMenuTitle.current === false) {
              closeMenu();
            }
          }, 300);

          onMouseLeave && onMouseLeave(event);
        },

        onClick: event => {
          let nextIndex = focusableMenuBarItems.current.indexOf(
            event.currentTarget,
          );
          setActiveIndex(nextIndex);

          onClick && onClick(event);
        },
      };
    }

    const handleKeyDown = event => {
      const count = focusableMenuBarItems.current.length;
      let nextIndex;

      if (event.key === switchSubMenuArrowsOnMode[0]) {
        event.preventDefault();
        focusOnFirstItem();
      }

      if (event.key === switchSubMenuArrowsOnMode[1]) {
        event.preventDefault();
        focusOnLastItem();
      }

      if (event.key === switchMenuBarArrowsOnMode[0]) {
        event.preventDefault();
        nextIndex = (index + 1) % count;
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }

      if (event.key === switchMenuBarArrowsOnMode[1]) {
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
          focusAtIndex(nextIndex);
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
        data-menubar-item={true}
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
