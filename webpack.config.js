const webpack = require("webpack");
const path = require("path");


let config = {
    entry: "./js/P5.js",
    output: {
        path: path.resolve(__dirname, "./"),
        filename: "./bundle.js"
    }
}

module.exports = config;
