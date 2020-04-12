import React from 'react';
import { Box, Link } from '@chakra-ui/core';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBar = (props) => {
  return <Box as="ul" {...props} />;
};

MenuBar.displayName = 'MenuBar';

//////////////////////////////////////////////////////////////////////////////////////////

const MenuBarItem = (props) => {
  return (
    <Box as="li">
      <Link {...props} />
    </Box>
  );
};
export { MenuBar, MenuBarItem };
