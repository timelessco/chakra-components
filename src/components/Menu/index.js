/* eslint-disable indent */
import React from 'react';
import { ThemeProvider, Box, Flex, PseudoBox } from '@chakra-ui/core';
import theme from '../../theme';
console.log('%ctheme', 'color: #f2ceb6', theme);

const MenuItem = ({ children, isActive, isDisabled, ...props }) => (
  <PseudoBox
    p="5"
    color="gray.400"
    cursor="pointer"
    {...isActive && {
      color: 'blue.500',
      shadow: 'menu',
    }}
    {...(isDisabled
      ? {
          cursor: 'not-allowed',
          opacity: '40%',
        }
      : {
          _hover: {
            color: 'blue.500',
            shadow: 'menu',
          },
        })}
    {...props}
  >
    {children}
  </PseudoBox>
);

MenuItem.displayName = MenuItem;

const Menu = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <Box
      fontFamily="body"
      fontWeight="medium"
      fontSize="md"
      lineHeight="shorter"
    >
      <Flex align="center" {...props}>
        {children}
      </Flex>
    </Box>
  </ThemeProvider>
);

Menu.displayName = Menu;

export { Menu, MenuItem };
