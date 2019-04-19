const path = require('path');

module.exports = [
    {
        entry: './src/index.js',
        output: {
            filename: 'index.node.js',
            path: path.resolve(__dirname, 'dist')
        },
        target: "node",
        mode: 'development'
    }, {
        entry: './src/index.js',
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
