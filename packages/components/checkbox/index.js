import React from 'react';
import {
  VisuallyHidden,
  ControlBox,
  Icon,
  Box,
  ThemeProvider,
} from '@chakra-ui/core';
import PropTypes from 'prop-types';

import getAllowedProps from 'helpers/getAllowedProps';
import {
  space,
  typography,
  color,
  layout,
  border,
  borderRadius,
  shadow,
  flex,
} from 'helpers/styleProps';
import theme from 'helpers/theme';
import { wrapper, controlBox, label } from './theme';

export const Checkbox = ({
  children,
  isDisabled,
  isChecked,
  onBlur,
  onFocus,
  onChange,
  defaultIsChecked,
  id,
  name,
  value,
  override,
  isReversed,
}) => {
  const Override = {
    wrapper: {
      alignItems: 'center',
      lineHeight: wrapper.lineHeight,
      display: 'inline-flex',
      flexDirection: isReversed ? 'row-reverse' : 'row',
      justifyContent: isReversed ? 'flex-end' : 'start',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...getAllowedProps(override.wrapper, [...layout, ...typography, ...flex]),
    },
    controlBox: {
      size: controlBox.normal.size,
      borderWidth: controlBox.normal.borderWidth,
      borderColor: controlBox.normal.borderColor,
      borderStyle: controlBox.normal.borderStyle,
      rounded: controlBox.normal.rounded,
      _focus: { borderColor: controlBox.focus.borderColor },
      _hover: {
        borderColor: controlBox.hover.borderColor,
        shadow: controlBox.hover.shadow,
      },
      _checked: {
        bg: controlBox.checked.bg,
        color: controlBox.checked.color,
        borderColor: controlBox.checked.borderColor,
      },
      _disabled: { borderColor: controlBox.disabled.borderColor },
      ...getAllowedProps(override.controlBox, [
        ...layout,
        ...border,
        ...borderRadius,
        ...color,
        ...shadow,
        '_checked',
        '_disabled',
        '_checkedAndDisabled',
        '_focus',
        '_hover',
      ]),
    },
    label: {
      ml: isReversed ? '0' : label.normal.margin,
      mr: isReversed ? label.normal.margin : '0',
      fontFamily: label.normal.fontFamily,
      fontSize: label.normal.fontSize,
      fontWeight: label.normal.fontWeight,
      letterSpacing: label.normal.letterSpacing,
      color: `${isDisabled ? label.disabled.color : label.normal.color}`,
      ...getAllowedProps(override.label, [...color, ...space, ...typography]),
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p="2">
        <Box as="label" {...Override.wrapper}>
          {/* This is the sibling input, it's visually hidden */}
          <VisuallyHidden
            as="input"
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={onChange}
            defaultChecked={defaultIsChecked}
          />

          {/* This is the control box with a check icon as children */}
          <ControlBox {...Override.controlBox}>
            <Icon name="customCheck" size="10px" />
          </ControlBox>

          {/* You can pass additional text */}
          <Box as="span" {...Override.label}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

Checkbox.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDisabled: PropTypes.bool,
  isChecked: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  defaultIsChecked: PropTypes.bool,
  override: PropTypes.any,
  isReversed: PropTypes.bool,
};

Checkbox.defaultProps = {
  isDisabled: false,
  isReversed: false,
  override: {
    wrapper: {},
    controlBox: {},
    label: {},
  },
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
};

export default Checkbox;
