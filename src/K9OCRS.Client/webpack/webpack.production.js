const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base');

const outputPath = path.join(__dirname, '../dist');

module.exports = Object.assign({}, baseConfig, {
  mode: 'production',

  output: Object.assign(baseConfig.output, {
    path: outputPath,
  }),

  module: Object.assign(baseConfig.module, {
    rules: baseConfig.module.rules.concat([
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: [
          'eslint-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require.resolve('autoprefixer')
                ]
              }
            }
          },
          'sass-loader'
        ]
      }
    ])
  }),

  plugins: baseConfig.plugins.concat([
    new webpack.SourceMapDevToolPlugin({
      exclude: /^vendors~/i,
      filename: '[file].map',
    }),
    new CleanWebpackPlugin({
      root: outputPath,
      verbose: true,
    }),
    new webpack.ProgressPlugin({
      activeModules: true,
      profile: true,
      percentBy: 'dependencies'
    })
  ]),
})