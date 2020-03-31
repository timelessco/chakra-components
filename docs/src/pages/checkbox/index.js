import React from 'react';

import {
  Box,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  // eslint-disable-next-line import/no-unresolved
} from '@chakra-ui/core';

// eslint-disable-next-line import/no-unresolved
import theme from '../../../../src/theme';
// eslint-disable-next-line import/no-unresolved
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
