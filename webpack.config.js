"use strict";

const webpack = require("webpack");
const SquaEditor = require("./packages/squa-editor/package.json");

function factory({ name, main }) {
  return {
    entry: `${__dirname}/packages/${name}/src/index.js`,
    output: {
      path: `${__dirname}/packages/${name}`,
      filename: main
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    ],
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            presets: ["es2015", "react"],
            plugins: [
              "transform-object-rest-spread",
              "transform-class-properties"
            ]
          }
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        }
      ]
    }
  };
}

module.exports = [factory(SquaEditor)];
