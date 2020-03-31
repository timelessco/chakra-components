import React from "react"
import {
  Box,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
} from "@chakra-ui/core"

// eslint-disable-next-line import/no-unresolved
import theme from "../../../src/theme"
import CheckboxWrapper from "../../../src/components/Checkbox"

export const Checkbox = props => (
  <ThemeProvider theme={theme}>
    <ColorModeProvider>
      <Box p={2}>
        <CheckboxWrapper {...props} />
      </Box>
    </ColorModeProvider>
  </ThemeProvider>
)
