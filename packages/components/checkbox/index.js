import React from 'react';
import {
  VisuallyHidden,
  ControlBox,
  Icon,
  Box,
  ThemeProvider,
} from '@chakra-ui/core';

import PropTypes from 'prop-types';
import getAllowedProps from '../../helpers/getAllowedProps';
import {
  space,
  typography,
  color,
  layout,
  border,
  borderRadius,
  shadow,
  flex,
} from '../../helpers/styleProps';

import applyTheme from '../../helpers/applyTheme';

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
      alignItems:'center',
      lineHeight: 'checkbox',
      display: 'inline-flex',
      flexDirection: isReversed ? 'row-reverse' : 'row',
      justifyContent: isReversed ? 'flex-end' : 'start',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...getAllowedProps(override.wrapper, [...layout, ...typography, ...flex]),
    },
    controlBox: {
      size: 'checkbox',
      borderWidth: 'checkbox',
      borderColor: 'borderColor.checkbox.default',
      borderStyle: 'solid',
      rounded: 'md',
      _checked: {
        bg: 'bg.checkbox.checked',
        color: 'white',
        borderColor: 'borderColor.checkbox.checked',
      },
      _disabled: { borderColor: 'borderColor.checkbox.disabled' },
      _focus: { borderColor: 'outline' },
      _hover: {
        borderColor: 'borderColor.checkbox.hover',
        shadow: 'checkbox.hover',
      },
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
      ml: isReversed ? '0' : '2',
      mr: isReversed ? '2' : '0',
      fontFamily: 'body',
      fontSize: 'checkbox',
      fontWeight: 'medium',
      letterSpacing: 'checkbox',
      color: `${
        isDisabled ? 'font.checkbox.disabled' : 'font.checkbox.default'
      }`,
      ...getAllowedProps(override.label, [...color, ...space, ...typography]),
    },
  };

  return (
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
        {...Override.visuallyHidden}
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
    visuallyHidden: {},
    controlBox: {},
    label: {},
  },
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
};

export default applyTheme(Checkbox);
