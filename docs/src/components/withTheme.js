import React from 'react';
import { Box, ThemeProvider } from '@chakra-ui/core';

import theme from '../../../src/theme';

export function withTheme(OriginalComponent) {
  return props => (
    <ThemeProvider theme={theme}>
      <Box p={2}>
        <OriginalComponent {...props} />
      </Box>
    </ThemeProvider>
  );
}
