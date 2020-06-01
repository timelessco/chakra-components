const path = require("path");

module.exports = {
  stories: ["../packages/chakra-components/src/**/*.stories.@(jsx|mdx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
  ],
};
