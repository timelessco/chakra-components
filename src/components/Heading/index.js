import React from 'react';
import PropTypes from 'prop-types';
import { Box as ChakraBox } from '@chakra-ui/core';

import getAllowedProps from '../../helpers/getAllowedProps';

const Heading = ({ children, variant, override }) => (
  <ChakraBox
    as="h1"
    {...variant}
    {...getAllowedProps(override, ['typography', 'space', 'color'])}
  >
    {children}
  </ChakraBox>
);

const H1 = props => (
  <Heading
    variant={{
      as: 'h1',
      color: 'font.heading',
      fontSize: 'h1',
      fontWeight: 'semibold',
      letterSpacing: 'h1',
      lineHeight: 'h1',
    }}
    {...props}
  />
);

const H2 = props => (
  <Heading
    variant={{
      as: 'h2',
      color: 'font.heading',
      fontSize: 'h2',
      fontWeight: 'semibold',
      letterSpacing: 'h2',
      lineHeight: 'h2',
    }}
    {...props}
  />
);

Heading.propTypes = {
  children: PropTypes.string,
  variant: PropTypes.object,
  override: PropTypes.object,
};

Heading.defaultProps = {
  override: {},
};

Heading.H1 = H1;
Heading.H2 = H2;

export { Heading };
