/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState } from 'react';
import { Box } from '@chakra-ui/core';
import Checkbox from '../../components/Checkbox';
import Text from '../../components/Text';
import Heading from '../../components/Heading';

export default function HomePage() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Normal
        </Box>
        <Checkbox>Normal</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Checked
        </Box>
        <Checkbox
          isChecked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        >
          Checked
        </Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Disabled
        </Box>
        <Checkbox isDisabled>Disabled</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onBlur
        </Box>
        <Checkbox onBlur={() => console.log('Blur')}>onBlur</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onFocus
        </Box>
        <Checkbox onFocus={() => console.log('Focus')}>onFocus</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          onChange
        </Box>
        <Checkbox onChange={() => console.log('Change')}>onChange</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          defaultIsChecked
        </Box>
        <Checkbox defaultIsChecked>defaultIsChecked</Checkbox>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Overrides that are going to be different for each project
        </Box>
        <Checkbox
          override={{
            controlBox: { w: '100px' },
            additionalText: { color: 'tomato' },
          }}
        >
          Override
        </Checkbox>
      </Box>

      <Box p="4">
        <Box fontSize="xl" mb="1">
          Heading
        </Box>
        <Heading>No Styling</Heading>
        <Heading.H1>Heading 1</Heading.H1>
        <Heading.H2>Heading 2</Heading.H2>
      </Box>
      <Box p="4">
        <Box fontSize="xl" mb="1">
          Paragraph
        </Box>
        <Text>No Styling</Text>
        <Text.Body1>Body 1</Text.Body1>
        <Text.Body2>Body 2</Text.Body2>
        <Text.Body3>Body 3</Text.Body3>
      </Box>
    </>
  );
}
