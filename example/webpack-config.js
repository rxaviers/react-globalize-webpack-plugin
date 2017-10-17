var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var nopt = require("nopt");
var ReactGlobalizePlugin = require("react-globalize-webpack-plugin");
var webpack = require("webpack");

var options = nopt({
  production: Boolean
});

var main = "./src/app";
var jsLoaders = ["babel"];

module.exports = {
  entry: options.production ?  {
    main: main,
    vendor: [
      "globalize",
      "globalize/dist/globalize-runtime/currency",
      "globalize/dist/globalize-runtime/date",
      "globalize/dist/globalize-runtime/message",
      "globalize/dist/globalize-runtime/number",
      "globalize/dist/globalize-runtime/plural",
      "globalize/dist/globalize-runtime/relative-time",
      "react",
      "react-globalize"
    ]
  } : main,
  debug: !options.production,
  devtool: !options.production && "sourcemap",
  output: {
    path: options.production ? "./dist" : "./tmp",
    publicPath: options.production ? "" : "http://localhost:8000/",
    filename: options.production ? "app.[hash].js" : "app.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: jsLoaders
    }, {
      test: /\.jsx$/,
      loaders: options.production ? jsLoaders : ["react-hot"].concat(jsLoaders)
    }]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  plugins: [
    new webpack.DefinePlugin({
      // 1: Important to keep React file size down
      NODE_ENV: options.production && JSON.stringify("production")
    }),
    new HtmlWebpackPlugin({
      production: options.production,
      template: "./index-template.html"
    }),
    new ReactGlobalizePlugin({
      production: options.production,
      developmentLocale: "en",
      supportedLocales: ["en", "pt"],
      messages: "src/translations/[locale].json",
      writeMessages: true,
      output: "i18n/[locale].[hash].js"
    })
  ].concat( options.production ? [
    new webpack.optimize.DedupePlugin(),
    new CommonsChunkPlugin("vendor", "vendor.[hash].js"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ] : [] )
};
