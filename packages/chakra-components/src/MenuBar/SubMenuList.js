import React from "react";

import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";
import { useMenuBarContext } from "./useMenuBarContext";
import { Box, Collapse } from "@chakra-ui/core";
import { useSubMenuContext } from "./useSubMenuContext";
import { useMenuListStyle } from "./styles";

/* =========================================================================
  SubMenuList
  ========================================================================== */

const SubMenuList = ({
  as: Comp = "ul",
  width,
  skid,
  gutter,
  placement,
  ariaLabel,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  onBlur,
  ...props
}) => {
  const {
    activeIndex: index,
    isOpen,
    focusAtIndex,
    focusOnFirstItem,
    focusOnLastItem,
    closeMenu,
    focusableItems,
    titleRef,
    menuRef,
    closeOnBlur,
    mouseOnSubMenuTitle,
  } = useSubMenuContext();

  const {
    spanParent,
    spanMenuBar,
    trigger,
    setActiveIndex,
    focusableMenuBarItems,
    mode,
    isCollapsable,
  } = useMenuBarContext();

  if (spanParent || spanMenuBar) {
    width = "full";
  }

  if (mode === "vertical") {
    placement = "right";
  }

  let eventHandlers = {};

  if (trigger === "hover") {
    eventHandlers = {
      onMouseEnter: event => {
        mouseOnSubMenuTitle.current = true;

        onMouseEnter && onMouseEnter(event);
      },
      onMouseLeave: event => {
        mouseOnSubMenuTitle.current = false;

        setTimeout(() => {
          if (mouseOnSubMenuTitle.current === false) {
            closeMenu(false);
          }
        }, 500);

        onMouseLeave && onMouseLeave(event);
      },
    };
  }

  const handleKeyDown = event => {
    const count = focusableItems.current.length;
    let nextIndex;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (index + 1) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (index - 1 + count) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "Home") {
      focusOnFirstItem();
    } else if (event.key === "End") {
      focusOnLastItem();
    } else if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "Escape") {
      closeMenu();
      if (focusableMenuBarItems && focusableMenuBarItems.current.length > 0) {
        let nextIndex = focusableMenuBarItems.current.indexOf(titleRef.current);
        setActiveIndex(nextIndex);
        focusableMenuBarItems.current[nextIndex] &&
          focusableMenuBarItems.current[nextIndex].focus();
      }
    }

    // Set focus based on first character
    if (/^[a-z0-9_-]$/i.test(event.key)) {
      event.stopPropagation();
      event.preventDefault();
      let foundNode = focusableItems.current.find(item =>
        item.textContent.toLowerCase().startsWith(event.key),
      );
      if (foundNode) {
        nextIndex = focusableItems.current.indexOf(foundNode);
        focusAtIndex(nextIndex);
      }
    }

    onKeyDown && onKeyDown(event);
  };

  // Close the menu on blur
  const handleBlur = event => {
    if (
      closeOnBlur &&
      isOpen &&
      menuRef.current &&
      titleRef.current &&
      !menuRef.current.contains(event.relatedTarget) &&
      !titleRef.current.contains(event.relatedTarget)
    ) {
      closeMenu();
      if (focusableMenuBarItems && focusableMenuBarItems.current.length > 0) {
        let nextIndex = focusableMenuBarItems.current.indexOf(
          event.currentTarget,
        );
        if (nextIndex !== -1) {
          setActiveIndex(nextIndex);
        }
      }
    }

    onBlur && onBlur(event);
  };

  function fixedWidth(data) {
    const newData = data;

    if (width === "full" || width === "100%") {
      newData.offsets.popper.left = 0;
    }

    return newData;
  }

  const popperModifiers = {
    preventOverflow: {
      enabled: true,
      boundariesElement: "viewport",
    },
    fixedWidth: {
      enabled: true,
      fn: fixedWidth,
      order: 840,
    },
    offset: { enabled: true, offset: `${skid}, ${gutter}` },
  };
  const styleProps = useMenuListStyle();

  if (isCollapsable && mode === "vertical") {
    return (
      <Collapse isOpen={isOpen}>
        <Box
          as="ul"
          ref={menuRef}
          role="menu"
          aria-label={ariaLabel}
          tabIndex={-1}
          _focus={{ outline: 0 }}
          width={width}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </Collapse>
    );
  }

  return (
    <Popper
      usePortal={false}
      as={Comp}
      anchorEl={titleRef.current}
      ref={menuRef}
      isOpen={isOpen}
      placement={placement}
      modifiers={popperModifiers}
      width={width}
      rounded="md"
      py={2}
      zIndex="2"
      _focus={{ outline: 0 }}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...eventHandlers}
      {...styleProps}
      {...props}
    />
  );
};

SubMenuList.displayName = "SubMenuList";

/* =========================================================================
  SubMenuListArrow
  ========================================================================== */

const SubMenuListArrow = props => <PopperArrow {...props} />;

SubMenuListArrow.displayName = "SubMenuListArrow";

export { SubMenuList, SubMenuListArrow };
