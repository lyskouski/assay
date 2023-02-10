var path = require('path');

module.exports = {
    entry: './src/index.js',
    // devtool: '#source-map',
    output: {
        path: path.join(__dirname, 'dist', 'assets'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
};