import React from "react";
import { Box } from "@chakra-ui/core";

const ComboBoxOption = ({ children, ...props }) => {
  return (
    <Box as="li" listStyleType="none" px={2}>
      {children}
    </Box>
  );
};

export { ComboBoxOption };
