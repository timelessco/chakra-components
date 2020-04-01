import React from 'react';

import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';

import theme from '../../../../src/theme';
import { Heading as HeadingWrapper } from '../../../../src/components/Heading';

export const Heading = props => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Box p={2}>
      <HeadingWrapper {...props} />
    </Box>
  </ThemeProvider>
);
