const path = require("path");

module.exports = {
  stories: [
    path.join(__dirname, "../packages/chakra-components/src/**/*.stories.jsx"),
  ],
  addons: ["@storybook/addon-actions", "@storybook/addon-knobs"],
};
