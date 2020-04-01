const path = require('path');

exports.onCreateWebpackConfig = arg => {
  arg.actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname), './docs/node_modules'],
    },
  });
};
