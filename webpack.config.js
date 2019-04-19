const path = require('path');

module.exports = [
    {
        entry: './index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },
        mode: 'development'
    }, {
        entry: './index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },
        target: "web",
        mode: 'development'
    }, {
        entry: './src/demo/main.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist/demo')
        },
        target: "web",
        mode: 'development'
    }
];
