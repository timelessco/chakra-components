const path = require('path');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname), './docs/node_modules'],
    },
  });
};
