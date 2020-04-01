// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---changelog-md": () => import("./../../Changelog.md" /* webpackChunkName: "component---changelog-md" */),
  "component---license-md": () => import("./../../LICENSE.md" /* webpackChunkName: "component---license-md" */),
  "component---readme-md": () => import("./../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---packages-components-heading-docs-mdx": () => import("./../../packages/components/heading/docs.mdx" /* webpackChunkName: "component---packages-components-heading-docs-mdx" */),
  "component---packages-components-text-docs-mdx": () => import("./../../packages/components/text/docs.mdx" /* webpackChunkName: "component---packages-components-text-docs-mdx" */),
  "component---packages-components-checkbox-docs-mdx": () => import("./../../packages/components/checkbox/docs.mdx" /* webpackChunkName: "component---packages-components-checkbox-docs-mdx" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

