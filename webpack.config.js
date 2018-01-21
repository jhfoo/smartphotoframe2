const path = require('path'),
    webpack = require('webpack'),
    WebpackAutoInject = require('webpack-auto-inject-version'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build/js'),
        publicPath: '/js/',
        chunkFilename: '[name]-bundle.js',
        filename: '[name]-bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    // vendor: ['axios'],
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // Specify the common bundle's name.
        // }),
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: true,
                InjectByTag: true
            },
            componentsOptions: {
                AutoIncreaseVersion: {
                    runInWatchMode: true
                },
                InjectByTag: {
                    dateFormat: 'h:MM:ss TT'
                }
            }
        })
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ],
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ],
        loaders: []
    },
    devServer: {
        allowedHosts: [
            '.kungfoo.home'
        ]
    }
};