# Chakra UI Components

## Installing Chakra UI

To use Chakra UI components, all you need to do is install the `@chakra-ui/core`
package and its peer dependencies:

```sh
$ yarn add @chakra-ui/core @emotion/core @emotion/styled emotion-theming

# or

$ npm install @chakra-ui/core @emotion/core @emotion/styled emotion-theming
```

## Usage

To start using the components, please follow these steps:

1. Wrap your application with the `ThemeProvider` provided by
   **@chakra-ui/core**. We recommend that you also add the `CSSReset` component
   to remove all browser styling.

```jsx
import { ThemeProvider, CSSReset } from "@chakra-ui/core".

const App = ({ children }) => (
  <ThemeProvider>
    <CSSReset />
    {children}
  </ThemeProvider>
);
```

Optionally, you can wrap your application with the `ColorModeProvider` so you
can toggle between light and dark mode within your app.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://navin-moorthy.github.io/"><img src="https://avatars0.githubusercontent.com/u/39694575?v=4" width="100px;" alt=""/><br /><sub><b>Navin Moorthy</b></sub></a><br /><a href="https://github.com/timelessco/chakra-components/commits?author=navin-moorthy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/govindsingh55"><img src="https://avatars1.githubusercontent.com/u/25248526?v=4" width="100px;" alt=""/><br /><sub><b>GOVIND SINGH</b></sub></a><br /><a href="https://github.com/timelessco/chakra-components/commits?author=govindsingh55" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SamrithaS"><img src="https://avatars3.githubusercontent.com/u/62285891?v=4" width="100px;" alt=""/><br /><sub><b>SamrithaS</b></sub></a><br /><a href="https://github.com/timelessco/chakra-components/commits?author=SamrithaS" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/prasanna1211"><img src="https://avatars1.githubusercontent.com/u/17434647?v=4" width="100px;" alt=""/><br /><sub><b>prasanna1211</b></sub></a><br /><a href="https://github.com/timelessco/chakra-components/pulls?q=is%3Apr+reviewed-by%3Aprasanna1211" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

