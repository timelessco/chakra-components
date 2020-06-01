import React from "react";
import { Box } from "@chakra-ui/core";

export default {
  title: "MultiSelect",
  decorators: [
    story => (
      <Box maxWidth="500px" marginBottom="450px" mx="auto">
        {story()}
      </Box>
    ),
  ],
  includeStories: [],
};
