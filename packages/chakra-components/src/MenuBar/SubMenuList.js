import React from "react";

import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";
import { useMenuBarContext } from "./useMenuBarContext";
import { Box } from "@chakra-ui/core";
import { useSubMenuContext } from "./useSubMenuContext";
import { useMenuListStyle } from "@chakra-ui/core/dist/Menu/styles";

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
    closeMenuWithoutIndex,
    focusableItems,
    titleRef,
    menuRef,
    closeOnBlur,
    mouseOnSubMenuTitle,
    isCollapsable,
  } = useSubMenuContext();

  const {
    spanParent,
    spanMenuBar,
    trigger,
    menuBarRef,
    mode,
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
            closeMenu();
          }
        }, 300);

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
      if (
        menuBarRef &&
        menuBarRef.current &&
        menuBarRef.current.contains(event.relatedTarget)
      ) {
        closeMenuWithoutIndex();
      } else {
        closeMenu();
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

  if (isCollapsable) {
    return (
      <Box
        as="ul"
        ref={menuRef}
        width={width}
        display={isOpen ? "block" : "none"}
        onKeyDown={handleKeyDown}
        {...eventHandlers}
        {...props}
      />
    );
  } else {
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
        _focus={{
          outline: 0,
        }}
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
  }
};

SubMenuList.displayName = "SubMenuList";

/* =========================================================================
  SubMenuListArrow
  ========================================================================== */

const SubMenuListArrow = props => <PopperArrow {...props} />;

SubMenuListArrow.displayName = "SubMenuListArrow";

export { SubMenuList, SubMenuListArrow };
