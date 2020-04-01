import React from 'react';

import {
  Box,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
} from '@chakra-ui/core';

import theme from '../../../../src/theme';
import { Checkbox as CheckboxWrapper } from '../../../../src/components/Checkbox';

export const Checkbox = props => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <ColorModeProvider>
      <Box p={2}>
        <CheckboxWrapper {...props} />
      </Box>
    </ColorModeProvider>
  </ThemeProvider>
);
