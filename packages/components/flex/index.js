import React from 'react';
import PropTypes from 'prop-types';
import { Flex as ChakraFlex, ThemeProvider } from '@chakra-ui/core';

import { space, typography, color, flex } from '../../helpers/styleProps';
import getAllowedProps from '../../helpers/getAllowedProps';
import theme from '../../helpers/theme';
import { flexDirection } from 'styled-system';

const Flex = ({ children, ...props }) => {
  console.log("flex props: ",props)
  return (
  <ThemeProvider theme={theme}>
      <ChakraFlex
        {...props}
      >
        {children}
      </ChakraFlex>
  </ThemeProvider>
)};

const row = props => (
  <Flex
    flexDirection= 'row'
    {...props}
  />
);

const column = props => (
  <Flex
    flexDirection= 'column'
    {...props}
  />
);

Flex.propTypes = {
  
};

Flex.defaultProps = {
};

Flex.row = row;
Flex.column = column;

export default Flex;
