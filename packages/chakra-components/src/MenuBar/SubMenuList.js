import React from "react";

import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";

import { useSubMenuContext } from "./useSubMenuContext";
import { useMenuListStyle } from "@chakra-ui/core/dist/Menu/styles";

/* =========================================================================
  SubMenuList
  ========================================================================== */

const SubMenuList = ({
  onKeyDown,
  onBlur,
  as: Comp = "ul",
  ariaLabel,
  gutter,
  skid,
  width,
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
    placement,
    mouseOnSubMenuTitle,
  } = useSubMenuContext();

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
      closeMenu();
    }

    onBlur && onBlur(event);
  };

  const styleProps = useMenuListStyle();

  function fixedWidth(data) {
    const newData = data;

    if (width === "full" || width === "100%") {
      newData.offsets.popper.left = 0;
    }

    return newData;
  }

  return (
    <Popper
      as={Comp}
      bg="inherit"
      usePortal={false}
      isOpen={isOpen}
      anchorEl={titleRef.current}
      placement={placement}
      modifiers={{
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
      }}
      minW="3xs"
      rounded="md"
      role="menu"
      ref={menuRef}
      py={2}
      aria-label={ariaLabel}
      onMouseEnter={() => {
        mouseOnSubMenuTitle.current = true;
      }}
      onMouseLeave={() => {
        mouseOnSubMenuTitle.current = false;

        setTimeout(() => {
          if (mouseOnSubMenuTitle.current === false) {
            closeMenu();
          }
        }, 300);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      tabIndex={-1}
      zIndex="2"
      _focus={{
        outline: 0,
      }}
      fontFamily="Inter"
      fontSize="md"
      width={width}
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
