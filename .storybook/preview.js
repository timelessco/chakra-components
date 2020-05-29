import React from "react";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import { addDecorator } from "@storybook/react";

export const Chakra = ({ children }) => (
  <ThemeProvider>
    <ColorModeProvider>
      <CSSReset />
      {children}
    </ColorModeProvider>
  </ThemeProvider>
);

addDecorator(StoryFn => (
  <Chakra>
    <StoryFn />
  </Chakra>
));
