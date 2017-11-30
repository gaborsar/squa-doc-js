"use strict";

const webpack = require("webpack");

const base = {
  module: {
    loaders:[
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react"],
          plugins: ["transform-object-rest-spread", "transform-class-properties"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  }
}

module.exports = [
  {
    ...base,
    entry: __dirname + "/src/SquaDocEditor.js",
    output: {
      path: __dirname + "/dist",
      filename: "SquaDocEditor.js",
      library: ["SquaDocEditor"],
      libraryTarget: "umd"
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
    }
  },
  {
    ...base,
    entry: __dirname + "/example/src/app.js",
    output: {
      path: __dirname + "/example/public",
      filename: "app.js"
    }
  }
];
