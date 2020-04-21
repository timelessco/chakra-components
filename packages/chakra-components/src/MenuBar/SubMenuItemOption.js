/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, forwardRef, useRef, useState } from "react";
import { SubMenuGroup } from "./SubMenuItem";
import { Box, Icon, PseudoBox, Flex } from "@chakra-ui/core";
import { cleanChildren } from "@chakra-ui/core/dist/utils";
import { useMenuItemStyle } from "./styles";
import { useSubMenuContext } from "./useSubMenuContext";
import { useMenuBarContext } from "./useMenuBarContext";

/* =========================================================================
  SubMenuItemOption
  ========================================================================== */

export const SubMenuItemOption = forwardRef(
  (
    {
      type,
      isChecked,
      isDisabled,
      onClick,
      onMouseLeave,
      onMouseEnter,
      onKeyDown,
      children,
      ...rest
    },
    ref,
  ) => {
    const {
      focusableItems,
      focusAtIndex,
      closeMenu,
      closeOnSelect,
    } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
    } = useMenuBarContext();

    const role = `menuitem${type}`;

    const handleSelect = () => {
      onClick && onClick();
      closeOnSelect && closeMenu();
    };

    const handleClick = event => {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      handleSelect();
    };

    const handleKeyDown = event => {
      if (isDisabled) return;

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

      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        handleSelect();
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
    };

    const handleMouseEnter = event => {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      let nextIndex = focusableItems.current.indexOf(event.currentTarget);
      focusAtIndex(nextIndex);

      if (onMouseEnter) {
        onMouseEnter(event);
      }
    };

    const styleProps = useMenuItemStyle();

    return (
      <Flex as="li" role="none" align="center">
        <PseudoBox
          ref={ref}
          as="button"
          display="flex"
          minHeight="32px"
          alignItems="center"
          onClick={handleClick}
          role={role}
          tabIndex={-1}
          aria-checked={isChecked}
          disabled={isDisabled}
          aria-disabled={isDisabled ? "" : undefined}
          onMouseEnter={handleMouseEnter}
          onKeyDown={handleKeyDown}
          {...styleProps}
          {...rest}
        >
          <Icon
            name="check"
            opacity={isChecked ? 1 : 0}
            color="currentColor"
            size="1em"
            ml="1rem"
            mr="-4px"
            aria-hidden
            data-menuitem-icon=""
          />
          <Box textAlign="left" as="span" mx="1rem" flex="1">
            {children}
          </Box>
        </PseudoBox>
      </Flex>
    );
  },
);

SubMenuItemOption.displayName = "SubMenuItemOption";

/* =========================================================================
  SubMenuOptionGroup
  ========================================================================== */

export const SubMenuOptionGroup = ({
  children,
  type = "radio",
  name,
  title,
  value: valueProp,
  defaultValue,
  onChange,
  ...rest
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const { current: isControlled } = useRef(valueProp != null);

  const derivedValue = isControlled ? valueProp : value;

  const handleChange = _value => {
    if (type === "radio") {
      !isControlled && setValue(_value);
      onChange && onChange(_value);
    }

    if (type === "checkbox") {
      let newValue = derivedValue.includes(_value)
        ? derivedValue.filter(itemValue => itemValue !== _value)
        : [...derivedValue, _value];

      !isControlled && setValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const fallbackName = `radio-${useId()}`;

  const validChildren = cleanChildren(children);

  return (
    <SubMenuGroup title={title} {...rest}>
      {validChildren.map(child => {
        if (type === "radio") {
          return cloneElement(child, {
            type,
            key: child.props.value,
            onClick: event => {
              handleChange(child.props.value);
              if (child.props.onClick) {
                child.props.onClick(event);
              }
            },
            name: name || fallbackName,
            isChecked: child.props.value === derivedValue,
          });
        }

        if (type === "checkbox") {
          return cloneElement(child, {
            type,
            key: child.props.value,
            onClick: event => {
              handleChange(child.props.value);
              if (child.props.onClick) {
                child.props.onClick(event);
              }
            },
            isChecked: derivedValue.includes(child.props.value),
          });
        }
      })}
    </SubMenuGroup>
  );
};

SubMenuOptionGroup.displayName = "SubMenuOptionGroup";
