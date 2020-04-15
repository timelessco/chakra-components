import React from "react";
import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { MDXProvider } from "@mdx-js/react";

import MDXComponents from "../components/MDXComponents";
import Layout from "../components/Layout";

export default ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <ColorModeProvider value="light">
        <CSSReset />
        <MDXProvider components={MDXComponents}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MDXProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
