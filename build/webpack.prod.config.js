'use strict'
const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  // 配置性能提示
  performance: {
    // 提示方式 false | "error" | "warning"
    hints: 'warning',
    //入口起点的最大体积
    maxEntrypointSize: 50000000,
    //生成文件的最大体积
    maxAssetSize: 30000000,
    //只给出 js 文件的性能提示
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },
  module: {
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 3000000,
      minChunks: Infinity,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: 'manifest',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor',
          //   chunks: 'initial'
        },
        default: {
          // chunks: 'initial',
          minChunks: 4,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'development'
    }),
    new CleanWebpackPlugin(),
    // new CleanWebpackPlugin([resolve('output'), resolve('dist')], {
    //   allowExternal: true
    // }),
    // extract css into its own file
    // webpack3.X new ExtractTextPlugin()
    new ExtractTextPlugin({
      filename: 'static/css/src/[name].[chunkhash].css',
      allChunks: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      // inject: true,
      // true：默认值，script标签位于html文件的 body 底部
      // body：script标签位于html文件的 body 底部（同 true）
      // head：script 标签位于 head 标签内
      // false：不插入生成的 js 文件，只是单纯的生成一个 html 文件

      minify: { // 压缩HTML文件
        removeComments: true,  // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        // minifyCSS: true, // 压缩内联css
        // minifyJS: true, // 压缩内联js
        // minifyURLs: true, // 压缩url
        removeAttributeQuotes: true //删除不必要的引号，例如 {'aaa': 111}
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.build.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ])
  ]
})

module.exports = webpackConfig
