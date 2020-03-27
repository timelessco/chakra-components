import React from 'react';
import { VisuallyHidden, ControlBox, Icon, Box } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const Checkbox = ({ children }) => (
  <Box lineHeight="14px">
    <label style={{ lineHeight: 'inherit' }}>
      {/* This is the sibling input, it's visually hidden */}
      <VisuallyHidden as="input" type="checkbox" defaultChecked />

      {/* This is the control box with a check icon as children */}
      <ControlBox
        borderWidth="1.5px"
        size="14px"
        borderColor="checkbox.borderColor"
        rounded="sm"
        _checked={{ bg: 'brand.500', color: 'white', borderColor: 'brand.500' }}
      >
        <Icon name="check" size="10px" />
      </ControlBox>

      {/* You can pass additional text */}
      <Box
        as="span"
        verticalAlign="top"
        ml={3}
        fontFamily="body"
        fontSize="13px"
        fontWeight="medium"
        color="#333536"
        letterSpacing="0.13px"
      >
        {children}
      </Box>
    </label>
  </Box>
);

Checkbox.propTypes = {
  children: PropTypes.string,
};

export default Checkbox;
