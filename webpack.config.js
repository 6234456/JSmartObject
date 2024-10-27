const path = require('path');

module.exports = [
    {
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },
    }, {
        entry: './demo/main.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist/demo')
        },
    }, {
        entry: './demo/shape.js',
        output: {
            filename: 'shape.js',
            path: path.resolve(__dirname, 'dist/demo')
        },
    }
];
