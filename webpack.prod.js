const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('uglifyjs-webpack-plugin');

const dir_html = path.resolve(__dirname, 'html');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin([
      { from: dir_html },
    ]),
    new MinifyPlugin({
      extractComments: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
