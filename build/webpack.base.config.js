'use strict'
const path = require('path');
const vuxLoader = require('vux-loader');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const styleConfig = require('./style.config');
const CWD = process.cwd();

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

console.log(...styleConfig.styleLoaders({ sourceMap: 'source-map' }), 999);

module.exports = {
  entry: {
    app: [path.join(CWD, './src/index.js')]
  },
  cache: true,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.vue', '.ts', 'tsx'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'vue-router$': 'vue-router/dist/vue-router.js',
      '@': path.join(CWD, './src'),
    },
  },
  module: {
    rules: [
      ...styleConfig.styleLoaders({ sourceMap: false }),
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                'scss': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ],
                'sass': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader?indentedSyntax'
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "[name]_[hash:7].[ext]",
          outputPath: 'images/'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "[name]_[hash:7].[ext]",
          outputPath: 'media/'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "[name]_[hash:7].[ext]",
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.txt$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: "[name]_[hash].[ext]",
            outputPath: 'file/'
          }
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}

