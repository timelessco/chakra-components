# Contributing

## Getting Started

This project uses

- [Lerna](https://lerna.js.org/) to manage multiple libs
- [Babel](https://babeljs.io/) for building components
- [Next](https://nextjs.org/) for a blazing fast Docs website.

Before doing anything else, run these commands:

```sh
git clone git@github.com:timelessco/chakra-components.git

cd chakra-components

yarn boot    # To install deps, bootstrap lerna
             # And link the local packages.

yarn docs    # To start the docs development server
```

## Root Repo Scripts:

```sh
yarn clean                  # to clean the repo of all hidden files
                            # node_modules, .next & etc.,

yarn install                # to install all the project deps

yarn bootstrap              # bootstraps lerna so all dependencies get
                            # linked for cross-component development

yarn build                  # build the component library

yarn docs                   # runs the documentation site locally

yarn commit                 # to commit the stagged files

yarn contributors:add       # add yourself as a contributors
                            # usage https://allcontributors.org/docs/en/cli/usage

yarn contributors:generate  # generate allcontributors to readme
```

## HMR support in development

Start the development server with `yarn docs`.

Install
[Save and Run](https://marketplace.visualstudio.com/items?itemName=wk-j.save-and-run)
extension in VSCode.

Add the below setting to your vscode settings

```json
  "saveAndRun": {
    "commands": [
      {
        "match": "/packages/chakra-components/src",
        "cmd": "yarn build",
        "silent": true
      },
    ]
  },
```
