/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  console.log("resolving ...", [path.resolve(__dirname, "../node_modules")])
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname), "./docs/node_modules"],
    },
  })
}
