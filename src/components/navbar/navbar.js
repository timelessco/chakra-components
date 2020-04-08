import React, { useState } from 'react';
import { Button, Image, Link, Icon } from '@chakra-ui/core';
import { Nav, NavBar, NavItem } from './index';
import logo from './logo';
import night from './night';
import bell from './bell';
import avatar from './avatar';

const NavbarComponent = () => {
  const [navBarState, setNavBarState] = useState(false);
  return (
    <div style={{ background: '#fbf7f7', height: '100vh' }}>
      {/* navbar */}
      <NavBar
        isOpen={navBarState}
        onToggle={setNavBarState}
        isInline
        _bg="#1A202C"
        alignItems="center"
        maxHeight="63px"
        py="1rem"
        roundedTop="8px"
        justifyContent="space-between"
        width="100%"
      >
        {/* logo */}
        <NavItem alignText="center" ml="2.5rem">
          {logo}
        </NavItem>
        {/* nav link */}

        <Nav
          bg="#1A202C"
          isCollapsable
          position={{ base: 'absolute', md: 'relative' }}
          mt={{ base: '4.9rem', md: '0px' }}
          display={{ base: navBarState ? 'flex' : 'none', md: 'flex' }}
          justifyContent={{ base: 'unset', md: 'space-between' }}
          width="100%"
          boxShadow={{
            base:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            md: 'none',
          }}
        >
          <NavItem
            ml={{ base: '0px', md: '3rem' }}
            color="white"
            fontWeight="500"
            fontSize="1rem"
          >
            Dashboard
          </NavItem>
          <NavItem color="gray.500" fontWeight="500" fontSize="1rem">
            Project
          </NavItem>
          <NavItem color="gray.500" fontWeight="500" fontSize="1rem">
            Team
          </NavItem>
          <NavItem color="gray.500" fontWeight="500" fontSize="1rem">
            Reports
          </NavItem>
        </Nav>
        <Nav
          ml="1rem"
          mr="2.5rem"
          maxHeight={{ base: 'auto', md: '63px' }}
          boxShadow={{
            base:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            md: 'none',
          }}
          alignItems="center"
        >
          <NavItem mr="1.5rem" width="20px" height="20px" alignText="center">
            {night}
          </NavItem>
          <NavItem mr="1.5rem" width="24px" height="24px">
            {bell}
          </NavItem>
          <NavItem width="34px" height="34px">
            {avatar}
          </NavItem>
        </Nav>

        {/* hamberger */}
        <NavItem display={{ base: 'block', md: 'none' }} mr="1rem">
          <Button
            display="flex"
            flexDirection="column"
            onClick={() => setNavBarState(!navBarState)}
          >
            <Icon name="triangle-down" />
          </Button>
        </NavItem>
      </NavBar>

      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore,
        ipsa molestiae aliquam earum architecto ducimus repudiandae quia labore
        nostrum?
      </div>
    </div>
  );
};
export { NavbarComponent };
