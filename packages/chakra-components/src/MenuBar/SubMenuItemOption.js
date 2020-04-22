/** @jsx jsx */
import { cloneElement, forwardRef, useRef, useState } from "react";
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { SubMenuGroup } from "./SubMenuItem";
import { Box, Icon, PseudoBox, Flex } from "@chakra-ui/core";
import { cleanChildren } from "@chakra-ui/core/dist/utils";
import { useSubMenuContext } from "./useSubMenuContext";
import { useMenuBarContext } from "./useMenuBarContext";

import { useMenuItemStyle } from "./styles";

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
    const { closeMenu, closeOnSelect, titleRef } = useSubMenuContext();

    const {
      focusableMenuBarItems,
      activeIndex: index,
      setActiveIndex,
      focusAtIndex,
    } = useMenuBarContext();

    const role = `menuitem${type}`;

    const handleSelect = () => {
      if (closeOnSelect) {
        closeMenu();

        let nextIndex = focusableMenuBarItems.current.indexOf(titleRef.current);
        setActiveIndex(nextIndex);
        focusAtIndex(nextIndex);
      }
      onClick && onClick();
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

      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        handleSelect();
      }

      onKeyDown && onKeyDown(event);
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

        // fix Eslint no arrow function return
        return null;
      })}
    </SubMenuGroup>
  );
};

SubMenuOptionGroup.displayName = "SubMenuOptionGroup";
