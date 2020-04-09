import React from 'react';
import { ThemeProvider, Box, Flex } from '@chakra-ui/core';
import theme from '../../theme';
console.log('%ctheme', 'color: #f2ceb6', theme);

export const Menu = () => (
  <ThemeProvider theme={theme}>
    <Flex
      align="center"
      fontFamily="body"
      fontWeight="medium"
      fontSize="md"
      lineHeight="19px"
    >
      <Box
        px="20px"
        py="22px"
        borderBottom="2px"
        borderColor="blue.500"
        color="blue.500"
      >
        Dashboard
      </Box>
      <Box px="20px" py="22px" color="gray.400">
        Project
      </Box>
      <Box px="20px" py="22px" color="gray.400">
        Team
      </Box>
      <Box px="20px" py="22px" color="gray.400">
        Reports
      </Box>
    </Flex>
  </ThemeProvider>
);
