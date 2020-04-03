import React from 'react';
import PropTypes from 'prop-types';
import { Box as ChakraBox, ThemeProvider, Box } from '@chakra-ui/core';

import { space, typography, color } from 'helpers/styleProps';
import getAllowedProps from 'helpers/getAllowedProps';
import theme from 'helpers/theme';
import { h1, h2 } from './styles';

const Heading = ({ children, variant, override }) => (
  <ThemeProvider theme={theme}>
    <Box p="2">
      <ChakraBox
        as="h1"
        {...variant}
        {...getAllowedProps(override, [...typography, ...space, ...color])}
      >
        {children}
      </ChakraBox>
    </Box>
  </ThemeProvider>
);

const H1 = props => <Heading variant={{ ...h1 }} {...props} />;

const H2 = props => <Heading variant={{ ...h2 }} {...props} />;

Heading.propTypes = {
  children: PropTypes.string,
  variant: PropTypes.object,
  override: PropTypes.object,
};

Heading.defaultProps = {
  override: {},
};

Heading.H1 = H1;
Heading.H2 = H2;

export default Heading;
