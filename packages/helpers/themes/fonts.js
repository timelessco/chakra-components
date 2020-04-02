import { theme } from '@chakra-ui/core';

export default {
  custom: {
    heading: `Inter,${theme.fonts.heading}`,
    body: `Inter,${theme.fonts.body}`,
  },
  ...theme.fonts,
};
