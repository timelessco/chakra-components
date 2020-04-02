import React from 'react';
import { theme } from '@chakra-ui/core';

import customizedColors from './colors';
import updatedFonts from './fonts';

export default {
  ...theme,
  colors: {
    ...theme.colors,
    ...customizedColors,
  },
  fonts: {
    ...theme.fonts,
    ...updatedFonts,
  },
  lineHeights,
  sizes,
  shadows,
  fontSizes,
  letterSpacings,
  borderWidths,
  icons,
};
