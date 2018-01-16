var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require("webpack")

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      "autosize": path.resolve(__dirname, '../static/js/plugins.autosize.js'),
      "common": path.resolve(__dirname, '../static/js/common.js'),
      "downSelector": path.resolve(__dirname, '../static/js/plugins/plugins.downSelector.js'),
      "tabView": path.resolve(__dirname, '../static/js/plugins.tabView.js'),
      "toJSON": path.resolve(__dirname, '../static/js/jquery.json-2.4.js'),
      "ymd": path.resolve(__dirname, '../static/js/plugins/ymd.js'),
      "nim": path.resolve(__dirname, '../static/js/third-party/nim/NIM_Web_NIM_v3.4.0.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        include:resolve('/src')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude:resolve('/node_modules/')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
        // include:resolve('/static/'),
        exclude:resolve('/node_modules/')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        },
          // include:resolve('/static/'),
          exclude:resolve('/node_modules/')
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        },
          exclude:resolve('/node_modules/'),
          // include:resolve('/font/')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('commmon.js'),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ]
}
