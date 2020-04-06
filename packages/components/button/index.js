/* eslint-disable indent */
import React from 'react';
import {
  Button as ChakraButton,
  ThemeProvider,
  Link as ChakraLink,
  Spinner,
} from '@chakra-ui/core';
import PropTypes from 'prop-types';

import theme from '../../helpers/theme';
import {
  primary,
  solid,
  ghost,
  link,
  outline,
  secondary,
  rightIcon,
  leftIcon,
} from './styles';

const Button = ({
  children,
  isLoading,
  loadingText,
  leftLoadingIcon,
  rightLoadingIcon,
  loadingIconSpace,
  ...props
}) => (
  <ThemeProvider theme={theme}>
    <ChakraButton isDisabled={props.isDisabled || isLoading} {...props}>
      {isLoading && leftLoadingIcon && (
        <Spinner mr={loadingIconSpace} size={props.size ? props.size : 'sm'} />
      )}
      {isLoading && loadingText ? loadingText : children}
      {isLoading && rightLoadingIcon && (
        <Spinner ml={loadingIconSpace} size={props.size ? props.size : 'sm'} />
      )}
    </ChakraButton>
  </ThemeProvider>
);

const Solid = ({ ...props }) => (
  <Button variant="solid" {...solid} {...props} />
);

const Outline = ({ ...props }) => (
  <Button variant="outline" {...outline} {...props} />
);

const Ghost = ({ ...props }) => (
  <Button variant="ghost" {...ghost} {...props} />
);

const Link = ({ href, isExternal, children, ...props }) => (
  <Button variant="link" {...link} {...props}>
    <ChakraLink href={href} isExternal={isExternal}>
      {children}
    </ChakraLink>
  </Button>
);

const LeftIcon = ({ ...props }) => <Button {...leftIcon} {...props} />;

const RightIcon = ({ ...props }) => <Button {...rightIcon} {...props} />;

const Primary = ({ ...props }) => <Button {...primary} {...props} />;

const Secondary = ({ ...props }) => <Button {...secondary} {...props} />;

Button.propTypes = {
  children: PropTypes.any,
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  varient: PropTypes.string,
  variantColor: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  leftLoadingIcon: PropTypes.bool,
  rightLoadingIcon: PropTypes.bool,
  loadingIconSpace: PropTypes.string,
};

Link.propTypes = {
  children: PropTypes.any,
  href: PropTypes.string,
  isExternal: PropTypes.bool,
};

Button.Link = Link;
Button.Primary = Primary;
Button.Secondary = Secondary;
Button.Solid = Solid;
Button.Outline = Outline;
Button.Ghost = Ghost;
Button.LeftIcon = LeftIcon;
Button.RightIcon = RightIcon;

export default Button;
