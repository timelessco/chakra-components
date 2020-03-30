/* eslint-disable indent */
import React from 'react';
import { VisuallyHidden, ControlBox, Icon, Box } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import getAllowedProps from '../../helpers/getAllowedProps';

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
}) => {
  // TODO: Every dom elements might need overrides
  // TODO: Specifiy for what dom elements what can be the override
  // For the Box as label, we might only need space and typography. We don't need border background or any of them
  // we can add it in future if we require it later

  const Override = {
    wrapper: {
      lineHeight: '14px', // TODO: should come from theme
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...getAllowedProps(override.wrapper, ['space', 'typography', 'layout']),
    },
    visuallyHidden: {},
    controlBox: {
      borderWidth: '1.5px', // TODO: should come from theme
      size: '14px', // TODO: should come from theme
      rounded: 'md',
      borderColor: isDisabled
        ? 'checkbox.disabled.borderColor'
        : 'checkbox.borderColor',
      _checked: isDisabled
        ? {}
        : { bg: 'brand.500', color: 'white', borderColor: 'brand.500' }, // TODO: Theme.disabled should have the styles
      _hover: isDisabled
        ? {}
        : {
            borderColor: 'brand.500', // Theme.border
            shadow: '0 0 0 2px #31a7d840, inset 0 0 0 2px #31a7d840',
          },
      ...getAllowedProps(override.controlBox, ['typography', 'color']),
    },
    additionalText: {
      ml: '2',
      fontFamily: 'body',
      fontSize: '13px',
      fontWeight: 'medium',
      letterSpacing: '0.13px',
      color: isDisabled ? 'checkbox.disabled.color' : 'checkbox.color',
      ...getAllowedProps(override.additionalText, [
        'color',
        'layout',
        'typography',
      ]),
    },
  };

  return (
    <Box id={id} as="label" {...Override.wrapper}>
      {/* This is the sibling input, it's visually hidden */}
      <VisuallyHidden
        as="input"
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        defaultChecked={defaultIsChecked}
        {...getAllowedProps(Override.visuallyHidden, [])}
      />

      {/* This is the control box with a check icon as children */}
      <ControlBox {...Override.controlBox}>
        <Icon name="customCheck" size="10px" />
      </ControlBox>

      {/* You can pass additional text */}
      <Box as="span" {...Override.additionalText}>
        {children}
      </Box>
    </Box>
  );
};

Checkbox.propTypes = {
  children: PropTypes.string,
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
};

Checkbox.defaultProps = {
  isDisabled: false,
  override: {
    wrapper: {},
    visuallyHidden: {},
    controlBox: {},
    additionalText: {},
  },
};

export default Checkbox;
