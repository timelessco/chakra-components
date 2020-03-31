import React from "react"
import {
  Box,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  theme,
  Button as ChakraButton,
} from "@chakra-ui/core"

export const Button = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <ColorModeProvider>
        <Box p={8}>
          <ChakraButton variantColor="green">{children}</ChakraButton>
        </Box>
      </ColorModeProvider>
    </ThemeProvider>
  )
}
