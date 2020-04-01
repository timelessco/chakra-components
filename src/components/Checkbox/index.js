/* eslint-disable indent */
import React from 'react';
import {
  VisuallyHidden,
  ControlBox,
  Icon,
  Box,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
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

import theme from '../../theme';

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
  checkboxIcon,
  isReversed,
}) => {
  const Override = {
    wrapper: {
      textAlign: 'center',
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
    additionalText: {
      ml: isReversed ? '0' : '2',
      mr: isReversed ? '2' : '0',
      fontFamily: 'body',
      fontSize: 'checkbox',
      fontWeight: 'medium',
      letterSpacing: 'checkbox',
      color: `${
        isDisabled ? 'font.checkbox.disabled' : 'font.checkbox.default'
      }`,
      ...getAllowedProps(override.additionalText, [
        ...color,
        ...space,
        ...typography,
      ]),
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <Box p={2}>
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
              <Icon name={checkboxIcon} size="10px" />
            </ControlBox>

            {/* You can pass additional text */}
            <Box as="span" userSelect="none" {...Override.additionalText}>
              {children}
            </Box>
          </Box>
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export const propTypes = JSON.stringify({
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
});

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
  checkboxIcon: PropTypes.string,
  isReversed: PropTypes.bool,
};

Checkbox.defaultProps = {
  isDisabled: false,
  checkboxIcon: 'customCheck',
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
