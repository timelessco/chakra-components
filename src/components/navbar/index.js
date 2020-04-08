import React, { useContext, createContext } from 'react';
import { PseudoBox, Stack } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const NavBarContext = createContext();
const useNavBarContext = () => {
  const context = useContext(NavBarContext);
  return context;
};

const NavBar = ({
  id,
  isOpen,
  onToggle,
  children,
  _bg,
  isInline,
  ...props
}) => {
  const bg = _bg || 'white';
  const flexDirection = isInline ? 'row' : 'column';
  const context = {
    isOpen,
    onToggle,
    bg,
  };

  return (
    // navbar
    <NavBarContext.Provider value={context}>
      <NavBarContent {...props} bg={bg} flexDirection={flexDirection}>
        {typeof children === 'function' ? children() : children}
      </NavBarContent>
    </NavBarContext.Provider>
  );
};

NavBar.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  _bg: PropTypes.string,
  isInline: PropTypes.bool,
};

const NavBarContent = React.forwardRef(({ children, ...props }, ref) => {
  // const { onClose, isOpen } = useNavBarContext();
  return (
    <PseudoBox display="flex" {...props}>
      {children}
    </PseudoBox>
  );
});

NavBarContent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

NavBarContent.displayName = 'NavBar';

const Nav = ({
  children,
  display,
  flexDirection,
  isCollapsable,
  position,
  ...props
}) => {
  const { isOpen } = useNavBarContext();
  let style = {};
  if (isCollapsable) {
    style = {
      display: display || { base: isOpen ? 'flex' : 'none', md: 'flex' },
      flexDirection: flexDirection || { base: 'column', md: 'row' },
      position: position || { base: 'absolute', md: 'relative' },
      ...props,
    };
  } else {
    style = {
      display: 'flex',
      flexDirection: 'row',
      ...props,
    };
  }
  return (
    <PseudoBox {...style}>
      {typeof children === 'function' ? children() : children}
    </PseudoBox>
  );
};

Nav.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  display: PropTypes.string,
  flexDirection: PropTypes.string,
  isCollapsable: PropTypes.bool,
  position: PropTypes.string,
};

const NavItem = ({ children, ...props }) => (
  <PseudoBox {...props}>
    {typeof children === 'function' ? children() : children}
  </PseudoBox>
);

NavItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export { Nav, NavBar, NavItem };
