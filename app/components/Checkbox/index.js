/* eslint-disable indent */
import React from 'react';
import { VisuallyHidden, ControlBox, Icon, Box } from '@chakra-ui/core';
import PropTypes from 'prop-types';

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
}) => (
  <Box lineHeight="14px">
    <label style={{ lineHeight: 'inherit' }}>
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
      />

      {/* This is the control box with a check icon as children */}
      <ControlBox
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        borderWidth="1.5px"
        size="14px"
        borderColor={
          isDisabled ? 'checkbox.disabled.borderColor' : 'checkbox.borderColor'
        }
        rounded="md"
        _checked={
          isDisabled
            ? {}
            : { bg: 'brand.500', color: 'white', borderColor: 'brand.500' }
        }
        _focus={{ borderColor: 'outline' }}
        _hover={
          isDisabled
            ? {}
            : {
                borderColor: 'brand.500',
                shadow: '0 0 0 2px #31a7d840, inset 0 0 0 2px #31a7d840',
              }
        }
      >
        <Icon name="customCheck" size="10px" />
      </ControlBox>

      {/* You can pass additional text */}
      <Box
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        as="span"
        ml={2}
        fontFamily="body"
        fontSize="13px"
        fontWeight="medium"
        color={isDisabled ? 'checkbox.disabled.color' : 'checkbox.color'}
        letterSpacing="0.13px"
      >
        {children}
      </Box>
    </label>
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
};

export default Checkbox;
