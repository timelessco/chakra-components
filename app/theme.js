import React from 'react';
import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      '50': '#8ED0E9',
      '100': '#7BC8E6',
      '200': '#69C0E2',
      '300': '#56B8DF',
      '400': '#43B0DB',
      '500': '#31A9D8',
      '600': '#2D9AC5',
      '700': '#298BB1',
      '800': '#247B9E',
      '900': '#206C8A',
    },
    checkbox: {
      borderColor: '#8C8D8E',
      color: '#333536',
      shadow: '#31a7d840',
    },
    disabled: {
      borderColor: '#E7E8E9',
      color: '#CACBCC',
    },
  },
  fonts: {
    ...theme.fonts,
    heading: `Inter,${theme.fonts.heading}`,
    body: `Inter,${theme.fonts.body}`,
  },
  icons: {
    ...theme.icons,
    customCheck: {
      path: (
        <path
          fill="none"
          fillRule="evenodd"
          stroke="#FFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M1.5 3.788L3.651 6l5.058-5"
        />
      ),
      viewBox: '0 0 10 7',
    },
  },
};
