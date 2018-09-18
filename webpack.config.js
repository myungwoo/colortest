const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('uglifyjs-webpack-plugin');

const dir_js = path.resolve(__dirname, 'js');
const dir_html = path.resolve(__dirname, 'html');
const dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: ['@babel/polyfill', 'bootstrap', path.resolve(dir_js, 'index.js')],
  output: {
    path: dir_build,
    filename: 'js/bundle.js',
  },
  devServer: {
    contentBase: dir_build,
    watchContentBase: true,
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        dir_js
      ],
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: dir_html },
    ]),
    new MinifyPlugin({
      extractComments: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
  mode: 'development',
};
