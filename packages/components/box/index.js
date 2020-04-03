/* eslint-disable indent */
import React from 'react';
import { PseudoBox as ChakraPseudoBox, ThemeProvider } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import theme from '../../helpers/theme';

const Box = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <ChakraPseudoBox {...props}>
      {typeof children === 'function' ? children() : children}
    </ChakraPseudoBox>
  </ThemeProvider>
);

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
};

Box.defaultProps = {};

export default Box;
