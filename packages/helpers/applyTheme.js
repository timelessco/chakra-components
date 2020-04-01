import React from 'react';

import { Box, ThemeProvider } from '@chakra-ui/core';
import theme from './theme';

export default Component => props => (
  <ThemeProvider theme={theme}>
    <Box p="2">
      <Component {...props} />
    </Box>
  </ThemeProvider>
);
