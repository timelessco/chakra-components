import React from 'react';
import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  lineHeights: {
    ...theme.lineHeights,
    h1: '24px',
    h2: '20px',
    body1: '19px',
    body2: '17px',
    body3: '16px',
    checkbox: '14px',
  },
  sizes: {
    ...theme.sizes,
    checkbox: '14px',
  },
  colors: {
    ...theme.colors,
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
  shadows: {
    ...theme.shadows,
    checkbox: { hover: '0 0 0 2px #31a7d840, inset 0 0 0 2px #31a7d840' },
  },
  fontSizes: {
    ...theme.fontSizes,
    h1: '20px',
    h2: '16px',
    body1: '15px',
    body2: '14px',
    body3: '13px',
    checkbox: '13px',
  },
  letterSpacings: {
    ...theme.letterSpacings,
    h1: '0.2px',
    h2: '0.18px',
    body1: '-0.15px',
    body2: '-0.14px',
    checkbox: '0.13px',
  },
  borderWidths: {
    ...theme.borderWidths,
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
