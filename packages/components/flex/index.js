import React from 'react';
import PropTypes from 'prop-types';
import { Flex as ChakraFlex, ThemeProvider } from '@chakra-ui/core';

import theme from '../../helpers/theme';

const Flex = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <ChakraFlex {...props}>{children}</ChakraFlex>
  </ThemeProvider>
);

const row = props => <Flex flexDirection="row" {...props} />;

const column = props => <Flex flexDirection="column" {...props} />;

Flex.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
};

Flex.defaultProps = {};

Flex.row = row;
Flex.column = column;

export default Flex;
