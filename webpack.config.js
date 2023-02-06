const path = require('path');
const { resolve } = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    cache: false,
    mode: 'development',
    entry: {
        index: './src/app.ts',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        static: {
            serveIndex: true,
            directory: __dirname,
            watch: false
        },
        hot: true,
        open: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          title: 'Development',
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(vert|frag)$/i,
                use: 'raw-loader',
            }
        ],
    },
    watchOptions: {
        ignored: /node_modules/
    }
};