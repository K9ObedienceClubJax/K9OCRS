const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  rules: {},
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, "webpack/webpack.development.js"),
      },
    },
  },
};