/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { Box, Text } from '@chakra-ui/core';
import Checkbox from '../../components/Checkbox';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export default function HomePage() {
  return (
    <>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Normal
        </Box>
        <Checkbox>One</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Checked
        </Box>
        <Checkbox isChecked>Two</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Disabled
        </Box>
        <Checkbox isDisabled>Two</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onBlur
        </Box>
        <Checkbox onBlur={() => console.log('Blur')}>Three</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onFocus
        </Box>
        <Checkbox onFocus={() => console.log('Focus')}>Three</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onChange
        </Box>
        <Checkbox onChange={() => console.log('Change')}>Three</Checkbox>
      </Box>
    </>
  );
}
