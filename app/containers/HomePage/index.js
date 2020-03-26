/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { Box } from '@chakra-ui/core';
import Checkbox from '../../components/Checkbox';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export default function HomePage() {
  return (
    <>
      <Box p="4">
        <Checkbox>One</Checkbox>
      </Box>
      <Box p="4">
        <Checkbox>Two</Checkbox>
      </Box>
      <Box p="4">
        <Checkbox>Three</Checkbox>
      </Box>
    </>
  );
}
