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
import { wrapper, controlBox, label } from './styles';

const Checkbox = ({
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
}) => (
  <ThemeProvider theme={theme}>
    <Box p="2">
      <Box
        as="label"
        alignItems="center"
        display="inline-flex"
        flexDirection={isReversed ? 'row-reverse' : 'row'}
        justifyContent={isReversed ? 'flex-end' : 'start'}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        {...wrapper}
        {...getAllowedProps(override.wrapper, [
          ...layout,
          ...typography,
          ...flex,
        ])}
      >
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
        <ControlBox
          {...controlBox.normal}
          _focus={controlBox.focus}
          _hover={controlBox.hover}
          _checked={controlBox.checked}
          _disabled={controlBox.disabled}
          {...getAllowedProps(override.controlBox, [
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
          ])}
        >
          <Icon name="customCheck" size="10px" />
        </ControlBox>

        {/* You can pass additional text */}
        <Box
          as="span"
          ml={isReversed ? '0' : label.normal.margin}
          mr={isReversed ? label.normal.margin : '0'}
          color={`${isDisabled ? label.disabled.color : label.normal.color}`}
          {...label.normal}
          {...getAllowedProps(override.label, [
            ...color,
            ...space,
            ...typography,
          ])}
        >
          {children}
        </Box>
      </Box>
    </Box>
  </ThemeProvider>
);

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
