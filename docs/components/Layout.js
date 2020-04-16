import React from "react";
import { Box } from "@chakra-ui/core";

import DocsHeader from "./DocsHeader";
import SideNav from "./SideNav";

const Main = props => <Box as="main" mx="auto" mb="3rem" {...props} />;

export default ({ children }) => (
  <Box>
    <DocsHeader />
    <SideNav display={["none", null, "block"]} maxWidth="18rem" width="full" />
    <Box pl={[0, null, "18rem"]} mt="4rem">
      <Main maxWidth="46rem" pt={8} px={5}>
        {children}
      </Main>
    </Box>
  </Box>
);
