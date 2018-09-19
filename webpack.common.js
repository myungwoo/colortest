const path = require('path');

const dir_js = path.resolve(__dirname, 'js');
const dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: ['@babel/polyfill', 'bootstrap', path.resolve(dir_js, 'index.js')],
  output: {
    path: dir_build,
    filename: 'js/bundle.js',
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
          plugins: ['transform-class-properties'],
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  stats: {
    colors: true,
  },
};
