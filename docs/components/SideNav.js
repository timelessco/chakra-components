import React from "react";
import { Box, Heading } from "@chakra-ui/core";
import { ComponentLink, stringToUrl } from "./NavLink";

const components = ["MenuBar", "Combobox", "MultiSelect", "Playground"];

const NavGroupHeading = props => (
  <Heading
    fontSize="xs"
    color="gray.400"
    letterSpacing="wide"
    mb={2}
    textTransform="uppercase"
    {...props}
  />
);

export const SideNavContent = ({
  contentHeight = "calc(100vh - 4rem)",
  ...props
}) => (
  <Box
    top="4rem"
    position="relative"
    overflowY="auto"
    borderRightWidth="1px"
    {...props}
  >
    <Box
      as="nav"
      height={contentHeight}
      aria-label="Main navigation"
      fontSize="sm"
      p="6"
    >
      <Box mb="10">
        <NavGroupHeading>Components</NavGroupHeading>
        {components.map(link => (
          <ComponentLink key={link} href={stringToUrl(link)}>
            {link}
          </ComponentLink>
        ))}
      </Box>
    </Box>
  </Box>
);

const SideNavContainer = props => (
  <Box
    position="fixed"
    left="0"
    width="100%"
    height="100%"
    top="0"
    right="0"
    {...props}
  />
);

const SideNav = props => {
  return (
    <SideNavContainer {...props}>
      <SideNavContent />
    </SideNavContainer>
  );
};

export default SideNav;
