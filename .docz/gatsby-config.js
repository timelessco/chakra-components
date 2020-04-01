const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Chakra Wrapper',
    description: 'A set of wrapper components around chakra ui',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/timeless/Documents/projects/chakra-components/.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Chakra Wrapper',
        description: 'A set of wrapper components around chakra ui',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/timeless/Documents/projects/chakra-components',
          templates:
            '/Users/timeless/Documents/projects/chakra-components/node_modules/docz-core/dist/templates',
          docz: '/Users/timeless/Documents/projects/chakra-components/.docz',
          cache:
            '/Users/timeless/Documents/projects/chakra-components/.docz/.cache',
          app: '/Users/timeless/Documents/projects/chakra-components/.docz/app',
          appPackageJson:
            '/Users/timeless/Documents/projects/chakra-components/package.json',
          gatsbyConfig:
            '/Users/timeless/Documents/projects/chakra-components/gatsby-config.js',
          gatsbyBrowser:
            '/Users/timeless/Documents/projects/chakra-components/gatsby-browser.js',
          gatsbyNode:
            '/Users/timeless/Documents/projects/chakra-components/gatsby-node.js',
          gatsbySSR:
            '/Users/timeless/Documents/projects/chakra-components/gatsby-ssr.js',
          importsJs:
            '/Users/timeless/Documents/projects/chakra-components/.docz/app/imports.js',
          rootJs:
            '/Users/timeless/Documents/projects/chakra-components/.docz/app/root.jsx',
          indexJs:
            '/Users/timeless/Documents/projects/chakra-components/.docz/app/index.jsx',
          indexHtml:
            '/Users/timeless/Documents/projects/chakra-components/.docz/app/index.html',
          db:
            '/Users/timeless/Documents/projects/chakra-components/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
