import React from 'react';
import { Checkbox as ChakraCheckbox } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const Checkbox = ({ children }) => (
  <ChakraCheckbox variantColor="brand">{children}</ChakraCheckbox>
);

Checkbox.propTypes = {
  children: PropTypes.string,
};

export default Checkbox;
