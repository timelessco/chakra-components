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
        <svg viewBox="0 0 512 512">
          <path
            fill="#31A7D8"
            d="M512 58.668C512 26.305 485.695 0 453.332 0H58.668C26.305 0 0 26.305 0 58.668v394.664C0 485.695 26.305 512 58.668 512h394.664C485.695 512 512 485.695 512 453.332zm0 0"
          />
          <path
            fill="#fafafa"
            d="M385.75 171.586c8.34 8.34 8.34 21.82 0 30.164L247.082 340.414c-4.16 4.16-9.621 6.254-15.082 6.254s-10.922-2.094-15.082-6.254l-69.332-69.332c-8.344-8.34-8.344-21.824 0-30.164 8.34-8.344 21.82-8.344 30.164 0l54.25 54.25 123.586-123.582c8.34-8.344 21.82-8.344 30.164 0zm0 0"
          />
        </svg>
      ),
    },
  },
};
