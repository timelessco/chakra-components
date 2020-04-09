import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  fonts: {
    ...theme.fonts,
    heading:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  shadows: {
    ...theme.shadows,
    menu: 'inset 0px -2px 0px #3182CE',
  },
};
