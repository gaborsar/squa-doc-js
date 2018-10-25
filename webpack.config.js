"use strict";

const webpack = require("webpack");

const env = process.env.NODE_ENV || "production";

const sharedConfig = {
    mode: env,
    stats: {
        warnings: env === "development"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env)
        })
    ],
    module: {
        rules: [
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
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/,
                use: [{ loader: "file-loader" }]
            }
        ]
    }
};

const sharedExternals = {
    react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
    },
    "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
    }
};

const pluginExternals = {
    ...sharedExternals,
    "squa-doc-js": {
        root: "SquaDoc.js",
        commonjs2: "squa-doc-js",
        commonjs: "squa-doc-js",
        amd: "squa-doc-js"
    }
};

module.exports = [
    {
        ...sharedConfig,
        externals: sharedExternals,
        entry: `${__dirname}/packages/squa-doc-js/src/index.js`,
        output: {
            path: `${__dirname}/packages/squa-doc-js`,
            filename: "lib/index.js",
            library: "squa-doc-js",
            libraryTarget: "umd"
        }
    },
    {
        ...sharedConfig,
        externals: pluginExternals,
        entry: `${__dirname}/packages/squa-doc-js-block-image-plugin/src/index.js`,
        output: {
            path: `${__dirname}/packages/squa-doc-js-block-image-plugin`,
            filename: "lib/index.js",
            library: "squa-doc-js-block-image-plugin",
            libraryTarget: "umd"
        }
    },
    {
        ...sharedConfig,
        externals: pluginExternals,
        entry: `${__dirname}/packages/squa-doc-js-inline-image-plugin/src/index.js`,
        output: {
            path: `${__dirname}/packages/squa-doc-js-inline-image-plugin`,
            filename: "lib/index.js",
            library: "squa-doc-js-inline-image-plugin",
            libraryTarget: "umd"
        }
    },
    {
        ...sharedConfig,
        externals: pluginExternals,
        entry: `${__dirname}/packages/squa-doc-js-checkable-plugin/src/index.js`,
        output: {
            path: `${__dirname}/packages/squa-doc-js-checkable-plugin`,
            filename: "lib/index.js",
            library: "squa-doc-js-checkable-plugin",
            libraryTarget: "umd"
        }
    },
    {
        ...sharedConfig,
        externals: pluginExternals,
        entry: `${__dirname}/packages/squa-doc-js-outline-plugin/src/index.js`,
        output: {
            path: `${__dirname}/packages/squa-doc-js-outline-plugin`,
            filename: "lib/index.js",
            library: "squa-doc-js-outline-plugin",
            libraryTarget: "umd"
        }
    },
    {
        ...sharedConfig,
        entry: `${__dirname}/website/src/index.js`,
        output: {
            path: `${__dirname}/website/public`,
            filename: "bundle.js"
        },
        resolve: {
            alias: {
                "squa-doc-js": `${__dirname}/packages/squa-doc-js/src/index.js`,
                "squa-doc-js-block-image-plugin": `${__dirname}/packages/squa-doc-js-block-image-plugin/src/index.js`,
                "squa-doc-js-inline-image-plugin": `${__dirname}/packages/squa-doc-js-inline-image-plugin/src/index.js`,
                "squa-doc-js-checkable-plugin": `${__dirname}/packages/squa-doc-js-checkable-plugin/src/index.js`,
                "squa-doc-js-outline-plugin": `${__dirname}/packages/squa-doc-js-outline-plugin/src/index.js`
            }
        }
    }
];
