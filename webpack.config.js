const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'hypersign-sdk.js',
    path: path.resolve(__dirname, 'dist'),
  },
};