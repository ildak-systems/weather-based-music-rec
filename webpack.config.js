

const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
        libraryTarget: 'umd',
        library: 'lib',
        umdNamedDefine: true
    },
}