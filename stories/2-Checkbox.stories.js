import React, { useState } from 'react';
import { Box } from '@chakra-ui/core';
import { action } from '@storybook/addon-actions';

import Checkbox from '../app/components/Checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Default = () => (
  <Box m="4">
    <Checkbox>Checkbox</Checkbox>
  </Box>
);

export const defaultIsChecked = () => (
  <Box m="4">
    <Checkbox defaultIsChecked>Checkbox</Checkbox>
  </Box>
);

export const isDisabled = () => (
  <Box m="4">
    <Checkbox isDisabled>Checkbox</Checkbox>
  </Box>
);

export const isChecked = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Checked, setChecked] = useState(true);

  return (
    <Box m="4">
      <Checkbox
        isChecked={Checked}
        onChange={() => action(setChecked(!isChecked))}
      >
        Checkbox
      </Checkbox>
    </Box>
  );
};

export const onBlur = () => (
  <Box m="4">
    <Checkbox onBlur={action('onBlur')}>Checkbox</Checkbox>
  </Box>
);

export const onFocus = () => (
  <Box m="4">
    <Checkbox onFocus={action('onFocus')}>Checkbox</Checkbox>
  </Box>
);

export const onChange = () => (
  <Box m="4">
    <Checkbox onChange={action('onChange')}>Checkbox</Checkbox>
  </Box>
);
