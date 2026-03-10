const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const WebpackBar = require('webpackbar');

module.exports = {
    entry: path.resolve(__dirname, '..', 'src', 'index.tsx'),

    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [
                __filename,
                path.resolve(__dirname, 'webpack.dev.js'),
                path.resolve(__dirname, 'webpack.prod.js'),
            ],
        },
    },

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[name].[contenthash:8].chunk.js',
        publicPath: '/',
        clean: true,
        assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                    },
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, '..', 'src'),
            '@components': path.resolve(__dirname, '..', 'src', 'components'),
            '@styles': path.resolve(__dirname, '..', 'src', 'styles'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', 'public', 'index.html'),
            favicon: path.resolve(__dirname, '..', 'public', 'favicon.ico'),
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, '..', 'tsconfig.json'),
            },
        }),
        new DotenvWebpackPlugin({
            systemvars: true,
            safe: false,
            path: `.env.${process.env.NODE_ENV}`,
        }),
        new WebpackBar(),
    ],

    stats: 'errors-warnings',
};
