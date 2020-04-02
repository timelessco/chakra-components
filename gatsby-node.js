const path = require('path');

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        components: path.resolve(__dirname, '../packages/components/'),
        helpers: path.resolve(__dirname, '../packages/helpers/'),
      },
    },
  });
};
