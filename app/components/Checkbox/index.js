import React from 'react';
import { VisuallyHidden, ControlBox, Icon, Box } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const Checkbox = ({ label, iconName, iconSize }) => (
  <Box lineHeight="14px">
    <label style={{ lineHeight: 'inherit' }}>
      {/* This is the sibling input, it's visually hidden */}
      <VisuallyHidden as="input" type="checkbox" />

      {/* This is the control box with a check icon as children */}
      <ControlBox
        borderWidth="1.5px"
        size="14px"
        borderColor="checkbox.borderColor"
        rounded="md"
        _checked={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500' }}
        _focus={{ borderColor: 'outline' }}
        _hover={{
          borderColor: 'brand.500',
          shadow: '0 0 0 2px #31a7d840, inset 0 0 0 2px #31a7d840',
        }}
      >
        <Icon name={iconName} size={iconSize} />
      </ControlBox>

      {/* You can pass additional text */}
      <Box
        as="span"
        ml={2}
        fontFamily="body"
        fontSize="13px"
        fontWeight="medium"
        color="#333536"
        letterSpacing="0.13px"
      >
        {label}
      </Box>
    </label>
  </Box>
);

Checkbox.propTypes = {
  label: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.string,
};

Checkbox.defaultProps = {
  iconName: 'customCheck',
  iconSize: '10px',
  label: 'default label',
};

export default Checkbox;
