// https:github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
module.exports = {
  extends: [
    'eslint-config-react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'no-console': 'off',
  },
};
