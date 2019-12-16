const path = require('path');
const glob = require('glob');
const SrcPath = path.resolve(__dirname, 'app/Asset');
var webpack = require('webpack');
// cache
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

/////////////////////
//  js（ES5・ES6）  //
////////////////////
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const jsEntries = {};

glob.sync('js/**/*.js', {
    ignore: 'js/**/components/**/*.js',
    cwd: SrcPath
}).map(function (key) {
    const entryKey = key.replace('.js', '');
    jsEntries[entryKey] = path.resolve(SrcPath, key);
});

////////////
//  Vue   //
////////////
const vueEntries = {};

glob.sync('vue/**/*.js', {
    ignore: 'vue/components/*.js',
    cwd: SrcPath
}).map(function (key) {
    const entryKey = key.replace('vue/', 'js/vue/').replace('.js', '');
    vueEntries[entryKey] = path.resolve(SrcPath, key);
});

//////////////////
//  scss->css   //
//////////////////
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sassEntries = {};
glob.sync('sass/**/*.scss', {
    ignore: 'sass/**/_*.scss',
    cwd: SrcPath
}).map(function (key) {
    const entryKey = key.replace('sass/', '').replace('.scss', '.css');
    sassEntries[entryKey] = path.resolve(SrcPath, key);
});
const entries = Object.assign(jsEntries, vueEntries, sassEntries);

///////////////
//  module   //
//////////////
module.exports = (env, {mode}) => {
    const is_watch = env !== undefined ? env.watch : false;
    const is_development = mode === 'development';

    return {
        mode: 'production',
        entry: entries,
        output: {
            path: path.join(__dirname, 'app/webroot'),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            'presets': ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: 'vue-style-loader!css-loader!sass-loader'
                        }
                    }
                },
                {
                    test: /\.(gif|jpg|png|svg)(\?.+)?$/,
                    use: [
                        {loader: 'url-loader'}
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [
                                    require('autoprefixer')({
                                        grid: true,
                                    })
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                outputStyle: 'expanded'
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/, // VueのCSS用
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.vue'],
            modules: [
                "node_modules"
            ],
            alias: {
                // vue.js のビルドを指定する
                vue: 'vue/dist/vue.common.js'
            }
        },
        plugins: is_watch ? [
            new HardSourceWebpackPlugin(),
            new FixStyleOnlyEntriesPlugin(),
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/' + '[name]',
            }),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery'
            }),
            new webpack.optimize.OccurrenceOrderPlugin()
        ] : [
            new HardSourceWebpackPlugin(),
            new FixStyleOnlyEntriesPlugin(),
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: './css/[name]'
            }),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery'
            }),
            new webpack.optimize.OccurrenceOrderPlugin()
        ],
        devtool: is_development ? 'source-map' : 'none'
    };
};
