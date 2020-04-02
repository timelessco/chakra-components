import React from 'react';
import PropTypes from 'prop-types';
import { Text as ChakraText, ThemeProvider, Box } from '@chakra-ui/core';

import { space, typography, color } from 'helpers/styleProps';
import getAllowedProps from 'helpers/getAllowedProps';
import theme from 'helpers/theme';

const Text = ({ children, variant, override }) => (
  <ThemeProvider theme={theme}>
    <Box p="2">
      <ChakraText
        {...variant}
        {...getAllowedProps(override, [...typography, ...space, ...color])}
      >
        {children}
      </ChakraText>
    </Box>
  </ThemeProvider>
);

const Body1 = props => (
  <Text
    variant={{
      color: 'font.body1',
      fontSize: 'body1',
      fontWeight: 'medium',
      letterSpacing: 'body1',
      lineHeight: 'body1',
    }}
    {...props}
  />
);

const Body2 = props => (
  <Text
    variant={{
      color: 'font.body2',
      fontSize: 'body2',
      fontWeight: 'medium',
      letterSpacing: 'body2',
      lineHeight: 'body2',
    }}
    {...props}
  />
);

const Body3 = props => (
  <Text
    variant={{
      color: 'font.body3',
      fontSize: 'body3',
      fontWeight: 'medium',
      lineHeight: 'body3',
    }}
    {...props}
  />
);

Text.propTypes = {
  children: PropTypes.string,
  variant: PropTypes.object,
  override: PropTypes.object,
};

Text.defaultProps = {
  override: {},
};

Text.Body1 = Body1;
Text.Body2 = Body2;
Text.Body3 = Body3;

export default Text;
