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
}) => (
  // TODO: Every dom elements might need overrides
  // TODO: Specifiy for what dom elements what can be the override
  // For the Box as label, we might only need space and typography. We don't need border background or any of them
  // we can add it in future if we require it later

  <Box
    as="label"
    lineHeight="checkbox"
    cursor={isDisabled ? 'not-allowed' : 'pointer'}
    {...getAllowedProps(override.wrapper, ['space', 'typography'])}
  >
    {/* This is the sibling input, it's visually hidden */}
    <VisuallyHidden
      as="input"
      type="checkbox"
      id={id}
      name={name}
      value={value}
      disabled={isDisabled}
      checked={isChecked}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      defaultChecked={defaultIsChecked}
      {...getAllowedProps(override.visuallyHidden, [])}
    />

    {/* This is the control box with a check icon as children */}
    <ControlBox
      size="checkbox"
      borderWidth="checkbox"
      borderColor="borderColor.checkbox.default"
      rounded="md"
      _checked={{
        bg: 'bg.checkbox.checked',
        color: 'white',
        borderColor: 'borderColor.checkbox.checked',
      }}
      _disabled={{ borderColor: 'borderColor.checkbox.disabled' }}
      _checkedAndDisabled={{}}
      _focus={{ borderColor: 'outline' }}
      _hover={{
        borderColor: 'borderColor.checkbox.hover',
        shadow: 'checkbox.hover',
      }}
      _checkedAndHover={{}}
      {...getAllowedProps(override.controlBox)}
    >
      <Icon name="customCheck" size="10px" />
    </ControlBox>

    {/* You can pass additional text */}
    <Box
      as="span"
      ml={2}
      fontFamily="body"
      fontSize="checkbox"
      fontWeight="medium"
      color={isDisabled ? 'font.checkbox.disabled' : 'font.checkbox.default'}
      letterSpacing="checkbox"
      {...getAllowedProps(override.additionalText)}
    >
      {children}
    </Box>
  </Box>
);

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
  override: {
    wrapper: {},
    visuallyHidden: {},
    controlBox: {},
    additionalText: {},
  },
};

export default Checkbox;
