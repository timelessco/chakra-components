import React from 'react';
import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  lineHeights: {
    ...theme.lineHeights,
    checkbox: '14px',
  },
  sizes: {
    ...theme.sizes,
    checkbox: '14px',
  },
  colors: {
    ...theme.colors,
    font: {
      checkbox: {
        default: '#333536',
        disabled: '#CACBCC',
      },
    },
    bg: {
      checkbox: {
        checked: '#31A9D8',
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
  shadows: {
    ...theme.shadows,
    checkbox: { hover: '0 0 0 2px #31a7d840, inset 0 0 0 2px #31a7d840' },
  },
  fontSizes: {
    ...theme.fontSizes,
    checkbox: '13px',
  },
  letterSpacing: {
    checkbox: '0.13px',
  },
  borderWidths: {
    checkbox: '1.5px',
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
