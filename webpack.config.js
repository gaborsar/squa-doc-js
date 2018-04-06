"use strict";

const webpack = require("webpack");
const SquaEditor = require("./packages/squa-doc-js/package.json");
const BlockImagePlugin = require("./packages/squa-doc-js-block-image-plugin/package.json");
const InlineImagePlugin = require("./packages/squa-doc-js-inline-image-plugin/package.json");
const CheckablePlugin = require("./packages/squa-doc-js-checkable-plugin/package.json");

function genericFactory(config) {
  return {
    ...config,
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "react"],
              plugins: [
                "transform-object-rest-spread",
                "transform-class-properties"
              ]
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        },
        {
          test: /\.(ttf|woff|woff2|eot|svg)$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    }
  };
}

function packageFactory({ name, main }) {
  return genericFactory({
    entry: `${__dirname}/packages/${name}/src/index.js`,
    output: {
      path: `${__dirname}/packages/${name}`,
      filename: main,
      library: name,
      libraryTarget: "umd"
    },
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    }
  });
}

function appFactory(path) {
  return genericFactory({
    entry: `${__dirname}/${path}/src/index.js`,
    output: {
      path: `${__dirname}/${path}/public`,
      filename: "bundle.js"
    }
  });
}

module.exports = [
  packageFactory(SquaEditor),
  packageFactory(BlockImagePlugin),
  packageFactory(InlineImagePlugin),
  packageFactory(CheckablePlugin),
  appFactory("website")
];
