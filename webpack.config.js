

const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "development",
    output: {
        // destination js file for all compiled js code with my own code, and bundles
        filename: 'main.js',
        // destination path of where they all go
        path: path.resolve(__dirname, 'public'),
        libraryTarget: 'umd',
        // name of the webpack object the exported functions can be called from here
        library: 'lib',
        umdNamedDefine: true
    },
}