const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: /\.module\.scss$/i,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                namedExport: false,
                            },
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    devServer: {
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        watchFiles: ['public/**/*'],
    },
});
