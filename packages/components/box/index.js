/* eslint-disable indent */
import React from 'react';
import { PseudoBox as ChakraPseudoBox, ThemeProvider, CSSReset } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const Box = ({ children, ...props }) => {
  return (
    <ThemeProvider>
      <CSSReset/>
      <ChakraPseudoBox {...props}>
        {typeof children === 'function' ? children() : children}
      </ChakraPseudoBox>
    </ThemeProvider>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
};

Box.defaultProps = {
};

export default Box;
