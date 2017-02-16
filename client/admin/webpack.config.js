var webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
 * Default webpack configuration for development
 */
var config = {
    devtool: 'eval-source-map',
    // devtool: 'eval',
    // entry: __dirname + "/app/App.js",
    entry: {
        app: __dirname + "/app/App.js",
        vendor: [
            "babel-polyfill",
            "classnames",
            "flexboxgrid",
            "isomorphic-fetch",
            "marked",
            "material-ui",
            "react",
            "react-addons-css-transition-group",
            "react-addons-update",
            "react-dnd",
            "react-dnd-html5-backend",
            "react-dom",
            "react-flexbox-grid",
            "react-redux",
            "react-router",
            "react-tap-event-plugin",
            "react-ultimate-pagination",
            "redux",
            "redux-thunk"
        ]
    },
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
        // filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.jsx', '.scss', '.js', '.json'],  // along the way, subsequent file(s) to be consumed by webpack
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    // presets: ['es2015','es2016', 'react']

                    // plugins: ['transform-runtime'],
                    presets: ['es2015', 'react','stage-0'],
                }
            }, {
                test: /(\.scss|\.css)$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap')
            }
        ]
    },
    devServer: {
        contentBase: "./public",
        colors: true,
        historyApiFallback: true,
        inline: true
    },
    plugins: [
        new ExtractTextPlugin('bundle.css', {allChunks: true}),  // compiled css (single file only)
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ]
};

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ];
}

module.exports = config;
