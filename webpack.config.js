var path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, '.build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.less$/,
      loader: 'style-loader!css-loader!less'
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [ 'es2015', 'react', 'react-hmre' ]
      }
    }]
  }
}
