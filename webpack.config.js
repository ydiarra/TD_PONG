const webpack = require("webpack");
const path = require("path");



let config = {
    entry:  path.resolve(__dirname, "./js/index.js"),
    output: {
        path: path.resolve(__dirname, "./"),
        filename: "./bundle.js"
    }
}

module.exports = config;
