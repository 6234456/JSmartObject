const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

// Create an Express app
const app = express();
const port = 3000;

// Bundle the application
webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(err || stats.toString());
        return;
    }
    console.log('Bundle is ready');
});

// Serve static files (including the bundled file)
app.use(express.static(path.join(__dirname, 'dist/demo')));

// Define route to serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/demo', 'shape.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
