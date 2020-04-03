/* eslint-disable indent */
import React from 'react';
import { Button as ChakraButton, ThemeProvider } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import theme from '../../helpers/theme';

// eslint-disable-next-line react/prop-types
const Button = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <ChakraButton {...props}>
      {typeof children === 'function' ? children() : children}
    </ChakraButton>
  </ThemeProvider>
);

const link = ({ href, target, ...props }) => (
  <Button as="a" href={href} target={target} {...props} />
);

Button.Link = link;

Button.propTypes = {
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  varient: PropTypes.string,
  variantColor: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
};

Button.defaultProps = {
  href: 'https://chakra-ui.com/',
  target: 'blank',
};

export default Button;
