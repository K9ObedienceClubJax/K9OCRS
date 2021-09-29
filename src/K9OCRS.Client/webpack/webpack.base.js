const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: false,

  entry: {
    'k9ocrs': [ 'core-js/stable', 'regenerator-runtime/runtime', path.join(__dirname, '..', 'app', 'index.js')],
  },

  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].module.js',
    publicPath: '/dist/',
    chunkFilename: '[name]_[chunkhash].module.js'
  },

  resolve: {
    alias: {
      root: path.join(__dirname, '..'),
      assets: path.join(__dirname, '..', 'assets'),
      app: path.join(__dirname, '..', 'app'),
      admin: path.join(__dirname, '..', 'admin'),
      pages: path.join(__dirname, '..', 'pages'),
      components: path.join(__dirname, '..', 'components'),
      util: path.join(__dirname, '..', 'util'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ]
  },

  plugins: [
    // Saves on bundling localizations
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Allows access to referenced environment variables
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ]
};