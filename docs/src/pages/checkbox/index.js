import React from 'react';
import { Box, ThemeProvider } from '@chakra-ui/core';

import { Checkbox as CheckboxWrapper } from '../../../../src/components/Checkbox';

import theme from '../../../../src/theme';

export const Checkbox = props => (
  <ThemeProvider theme={theme}>
    <Box p={2}>
      <CheckboxWrapper {...props} />
    </Box>
  </ThemeProvider>
);
