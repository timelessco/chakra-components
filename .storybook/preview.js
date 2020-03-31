import React from 'react';
import { addDecorator } from '@storybook/react';
import { CSSReset, ThemeProvider, Box } from '@chakra-ui/core';

import theme from '../src/theme';

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Box m="4">{storyFn()}</Box>
  </ThemeProvider>
));
