import React from 'react';
import { theme } from '@chakra-ui/core';

import customizedColors from './colors';
import updatedFonts from './fonts';
import customizedFontSizes from './fontSizes';
import customizedLineHeights from './lineHeights';
import customizedBreakpoints from './breakpoints';
import updatedSpace from './space';
import updatedSizes from './sizes';
import shadows from './shadows.js';
import letterSpacings from './letterSpacings';
import icons from './icons';

// TODO: spread inside the separate file for colors, fonts and sizes
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
  fontSizes: customizedFontSizes,
  lineHeights: customizedLineHeights,
  breakPoints: customizedBreakpoints,
  space: updatedSpace,
  sizes: {
    ...theme.sizes,
    ...updatedSizes,
  },
  shadows,
  letterSpacings,
  borderWidths,
  icons,
};
