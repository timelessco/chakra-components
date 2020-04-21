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
  return <Link ref={ref} width="full" {...props} />;
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
      onBlur,
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
      autoSelect,
      openMenu,
      titleRef,
      handleMenu,
      mouseOnSubMenuTitle,
      closeOnBlur,
      menuRef,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      trigger,
      mode,
    } = useMenuBarContext();

    let menuBarArrows = ["ArrowRight", "ArrowLeft"];
    let subMenuArrows = ["ArrowDown", "ArrowUp"];

    if (mode === "vertical") {
      menuBarArrows = ["ArrowDown", "ArrowUp"];
      subMenuArrows = ["ArrowRight", "ArrowLeft"];
    }

    let eventHandlers = {};

    if (trigger === "click") {
      eventHandlers = {
        onClick: event => {
          if (isOpen) {
            handleMenu(false);
          } else {
            if (autoSelect) {
              setTimeout(() => {
                focusOnFirstItem();
              });
            } else {
              if (
                focusableMenuBarItems &&
                focusableMenuBarItems.current.length > 0
              ) {
                let nextIndex = focusableMenuBarItems.current.indexOf(
                  event.currentTarget,
                );
                setActiveIndex(nextIndex);
              }
              handleMenu(true);
            }
          }

          onClick && onClick(event);
        },
        onMouseDown: event => {
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
            setTimeout(() => {
              handleMenu(false);
            }, 300);
          }
          onBlur && onBlur(event);
        },
      };
    }

    if (trigger === "hover") {
      eventHandlers = {
        onMouseEnter: event => {
          mouseOnSubMenuTitle.current = true;

          if (!isOpen) {
            handleMenu(true);
          }

          onMouseEnter && onMouseEnter(event);
        },

        onMouseLeave: event => {
          mouseOnSubMenuTitle.current = false;

          setTimeout(() => {
            if (mouseOnSubMenuTitle.current === false) {
              if (isOpen) {
                handleMenu(false);
              }
            }
          }, 300);

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

      if (event.key === subMenuArrows[0]) {
        event.preventDefault();
        focusOnFirstItem();
      }

      if (event.key === subMenuArrows[1]) {
        event.preventDefault();
        focusOnLastItem();
      }

      if (event.key === menuBarArrows[0]) {
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

      if (event.key === menuBarArrows[1]) {
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
        data-menubar-item={true}
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
