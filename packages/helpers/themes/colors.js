import { theme } from '@chakra-ui/core';

export default {
  custom: {
    font: {
      heading: '#282929',
      body1: '#8C8D8E',
      body2: '#5D5E5E',
      body3: '#282929',
      checkbox: {
        default: '#333536',
        disabled: '#CACBCC',
      },
    },
    bg: {
      checkbox: {
        checked: '#31A9D8',
        test: '#7bf33e',
      },
    },
    borderColor: {
      checkbox: {
        default: '#8C8D8E',
        checked: '#31A9D8',
        hover: '#31A9D8',
        disabled: '#E7E8E9',
      },
    },
  },
  ...theme.colors,
};
