var path = require('path');

module.exports = {
    entry: {
        test: [path.join(__dirname, 'webpack.test.bootstrap.js')]
    },
    output: {
        path: path.join(__dirname, '.build'),
        filename: '[name].js',
    },
    module: {
        loaders: [{
                test: /\.less$/,
                loader: 'style-loader!css-loader!less'
            },
            {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: [ 'es2015', 'react', 'stage-1' ]
            }
        }]
    },
    resolve: {
        modulesDirectories: ['src', 'node_modules']
    },
    node: {
        fs: 'empty'
    }
}