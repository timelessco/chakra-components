// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---changelog-md": () => import("./../../Changelog.md" /* webpackChunkName: "component---changelog-md" */),
  "component---readme-md": () => import("./../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---license-md": () => import("./../../LICENSE.md" /* webpackChunkName: "component---license-md" */),
  "component---packages-components-checkbox-checkbox-mdx": () => import("./../../packages/components/Checkbox/checkbox.mdx" /* webpackChunkName: "component---packages-components-checkbox-checkbox-mdx" */),
  "component---packages-components-heading-heading-mdx": () => import("./../../packages/components/Heading/heading.mdx" /* webpackChunkName: "component---packages-components-heading-heading-mdx" */),
  "component---packages-components-text-text-mdx": () => import("./../../packages/components/Text/text.mdx" /* webpackChunkName: "component---packages-components-text-text-mdx" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

