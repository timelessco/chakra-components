/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider, CSSReset, theme } from '@chakra-ui/core';

const Wrapper = ({ children }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <CSSReset />
    </ThemeProvider>
    {children}
  </React.Fragment>
);

export default Wrapper;
