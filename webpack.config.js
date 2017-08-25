const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
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

module.exports = {
    entry: {
        app: './src/app.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: './js/[name].bundle.js'
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
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: 'images/[hash:12].[ext]'
                        }
                    },
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
            { 
                test: /\.(woff2?|svg)$/, 
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '/css/fonts/[name].[ext]'
                    }
                }
            },
            { 
                test: /\.(ttf|eot)$/, 
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '/css/fonts/[name].[ext]'
                    }
                }
            },
            { 
                test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, 
                use: {
                    loader: 'imports-loader',
                    options: {
                        jQuery: 'jquery'
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        //inline: true
        // stats: "errors-only",
        //open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            filename: 'index.html',
            template: 'html-withimg-loader!' + path.resolve(__dirname, "./src/index.html")
        }),    
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath("./css/app.css");
            },
            disable: !isProd,
            allChunks: true
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}