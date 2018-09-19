const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const dir_build = path.resolve(__dirname, 'build');
const dir_html = path.resolve(__dirname, 'html');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: dir_build,
    watchContentBase: true,
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: dir_html },
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
