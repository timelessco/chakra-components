/* eslint-disable indent */
import React from 'react';
import { Box as ChakraBox } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import getAllowedProps from '../../helpers/getAllowedProps';

const Box = ({ children, ...props }) => {
  const Override = {
    // default props can be declared here
    ...getAllowedProps(props, ['layout', 'typography', 'space']),
  };

  return (
    <ChakraBox {...Override}>
      {typeof children === 'function' ? children() : children}
    </ChakraBox>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  override: PropTypes.any,
};

Box.defaultProps = {
  override: {},
};

export default Box;
