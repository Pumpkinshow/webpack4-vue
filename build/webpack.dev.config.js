const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const base = require('./webpack.base.config.js');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devWebpackConfig = merge(base, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devtool: 'eval-source-map',
  // optimization: {
  //     minimizer: [new UglifyJsPlugin()]
  // },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack-title',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyURLs: true
      },
      filename: 'index.html',
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': 'development'
    }),
  ],
  devServer: {
    hot: true,
    compress: true,
    open: true,
    quiet: false,
    disableHostCheck: true,
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: "0.0.0.0",
    port: '8081',
    open: true,
    overlay: { warnings: true, errors: true, }, // 在浏览器上全屏显示编译的errors或warnings
    publicPath: '/',
    proxy: {
      "/tgls-cloud/api": {
        target: "http://daping.towngasvcc.com:8889", // 线上环境
        // target: 'http://tgls-test.towngasvcc.com:8987',
        // target: 'https://tgls-prepare.towngasvcc.com', // 预发布
        // target: "http://10.10.10.44:8678", // 内网测试环境
        // target: "https://tgls-test.towngasvcc.com", // 测试环境
        // target: "https://tgls-dev.towngasvcc.com", // 开发环境
        changeOrigin: true
      },
      "/oauth": {
        target: "http://daping.towngasvcc.com:8889",
        // target: 'http://tgls-test.towngasvcc.com:8987',
        // target: 'https://tgls-prepare.towngasvcc.com', // 预发布
        // target: "http://10.10.10.44:8678",
        // target: "https://tgls-test.towngasvcc.com", // 测试环境
        // target: "https://tgls-dev.towngasvcc.com", // 开发环境
        changeOrigin: true
      }
    },
    // quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: true, // webpack基于文件系统来获取文件的改变。在某些场景下，是不起作用的。
    }

  }
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || devWebpackConfig.devServer.port || 8090
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        //   onErrors: config.dev.notifyOnErrors
        //   ? utils.createNotifierCallback()
        //   : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})