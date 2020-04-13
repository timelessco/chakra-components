/* eslint-disable react/prop-types */
import React from 'react';
import { PseudoBox } from '@chakra-ui/core';

const Menu = ({ id, children, title, ...props }) => (
  <PseudoBox {...props}>
    {typeof children === 'function' ? children() : children}
  </PseudoBox>
);

const MenuTitle = ({ children, ...props }) => (
  <PseudoBox {...props}>
    {typeof children === 'function' ? children() : children}
  </PseudoBox>
);

const MenuList = ({ children, isOpen, isPopper = false, ...props }) => {
  let style = {};
  if (isPopper) {
    style = {
      zIndex: '999',
      bg: 'white',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'gray.500',
    };
  }
  return (
    <PseudoBox
      as="ul"
      display={isOpen ? 'block' : 'none'}
      position={isPopper ? 'absolute' : 'relative'}
      {...style}
      {...props}
    >
      {typeof children === 'function' ? children() : children}
    </PseudoBox>
  );
};

const MenuItem = ({ children, ...props }) => (
  <PseudoBox as="li" listStyleType="none" {...props}>
    {typeof children === 'function' ? children() : children}
  </PseudoBox>
);

export { Menu, MenuTitle, MenuList, MenuItem };
