import React from "react";
import { Box } from "@chakra-ui/core";

import DocsHeader from "./DocsHeader";
import SideNav from "./SideNav";

const Main = props => <Box as="main" mx="auto" mb="3rem" {...props} />;

export default ({ children }) => (
  <Box>
    <DocsHeader />
    <SideNav display={["none", null, "block"]} maxWidth="12rem" width="full" />
    <Box pl={[0, null, "12rem"]} mt="4rem">
      <Main maxWidth="60rem" pt={8} px={5}>
        {children}
      </Main>
    </Box>
  </Box>
);
