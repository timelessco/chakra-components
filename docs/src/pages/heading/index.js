import React from 'react';

import { Box, ThemeProvider } from '@chakra-ui/core';

import theme from '../../../../src/theme';
import { Heading as HeadingWrapper } from '../../../../src/components/Heading';

const Heading = props => (
  <ThemeProvider theme={theme}>
    <Box p={2}>
      <HeadingWrapper {...props} />
    </Box>
  </ThemeProvider>
);

const H1 = props => (
  <ThemeProvider theme={theme}>
    <Box p={2}>
      <HeadingWrapper.H1 {...props} />
    </Box>
  </ThemeProvider>
);

const H2 = props => (
  <ThemeProvider theme={theme}>
    <Box p={2}>
      <HeadingWrapper.H2 {...props} />
    </Box>
  </ThemeProvider>
);

Heading.H1 = H1;
Heading.H2 = H2;

export { Heading };
