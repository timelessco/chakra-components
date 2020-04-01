import React from 'react';
import { Box, ThemeProvider } from '@chakra-ui/core';

import theme from '../../../src/theme';

export const withTheme = Component => props => (
  <ThemeProvider theme={theme}>
    <Box p={2}>
      <Component {...props} />
    </Box>
  </ThemeProvider>
);
