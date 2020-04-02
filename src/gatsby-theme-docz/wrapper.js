import React from 'react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import theme from '../../../packages/helpers/theme';

const Wrapper = ({ children }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <CSSReset />
    </ThemeProvider>
    {children}
  </React.Fragment>
);

export default Wrapper;
