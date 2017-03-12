'use strict';

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

function createConfig(publicPath, output) {
    return {
        entry: {
            'index': [
                require.resolve('babel-polyfill'),
                './src/index.js',
            ],
        },
        output: {
            path: output,
            publicPath: publicPath,
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ['react-hot-loader', 'babel-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    exclude: /node_modules/,
                    use: [
                        'classnames-loader',
                        'style-loader',
                        'css-loader?modules&localIdentName=[name]-[local]-[hash:base64:4]',
                        'less-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                    exclude: /node_modules/,
                    use: 'file-loader',
                },
                {
                    test: /\.jsx?$/,
                    use: 'babel-loader',
                    include: /retail-ui/,
                },
                {
                    test: /\.(c|le)ss$/,
                    include: /retail-ui/,
                    use: [
                        'style-loader',
                        'css-loader?localIdentName=[name]-[local]-[hash:base64:4]',
                        'less-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                    include: /retail-ui/,
                    use: 'file-loader',
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: ['node_modules', 'web_modules'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
            })
        ],
    };
}
if (process.env.NODE_ENV === 'production') {
    module.exports = [
        createConfig('https://tihonove.github.io/react-ui-custom-combobox-demo/', path.join(__dirname, 'dist')),
    ];
}
else {
    module.exports = createConfig('/', path.join(__dirname, 'dist'));
}


