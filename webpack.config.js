const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

let isProd = /^\s*production\s*$/.test(process.env.NODE_ENV);
var scssDev = ['style-loader', 'css-loader', 'sass-loader'];
var scssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
});
var cssDev = ['style-loader', 'css-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader']
});
let scssConfig = isProd ? scssProd : scssDev;
let cssConfig = isProd ? cssProd : cssDev;
let bootstrapConfig = isProd ? bootstrapEntryPoints.prod: bootstrapEntryPoints.dev;

///plugins
let plugins = [
    new HtmlWebpackPlugin({
        title: "Project Demo",
        minify: {
            collapseWhitespace: true
        },
        hash: true,
        filename: 'index.html',
        template: path.resolve(__dirname, "./src/index.html")
    })
];
plugins.push(
    new ExtractTextPlugin({
        filename: (getPath) => {
            return getPath("app.css");
        },
        disable: !isProd,
        allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    })
)

module.exports = {
    entry: {
        app: './src/app.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.scss$/i,
                use: scssConfig
            },
            {
                test: /\.css$/i,
                use: cssConfig
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /node_modules/,
                use: [
                    'file-loader?name=images/[name].[ext]?[hash:12]',
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 4,
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3,
                            }
                        }
                    }
                ]
            },
            { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
            { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        inline: true
        // stats: "errors-only",
        //open: true
    },
    plugins: plugins
}