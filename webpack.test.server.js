var webpack = require('webpack')

// Start watching and bundling tests here
var tests = require('./webpack.test.config')

webpack(tests).watch({}, function (err) {
  if (err) {
    console.log(err)
  }
  console.log('Test file bundled')
})
