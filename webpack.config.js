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

            }
        }],
        loaders: []
    },
    devServer: {
        allowedHosts:[
            '.kungfoo.home'
        ]
    }
};