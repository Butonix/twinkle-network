const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const envKeys = require('./env.config').envKeys;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

module.exports = {
  entry: ['./app.js'],
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'source'],
    extensions: ['.js', '.jsx']
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../public'),
    filename: '[name]-[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebPackPlugin({
      hash: true,
      filename: 'index.html',
      template: './template/index.html',
      favicon: './public/favicon.png'
    }),
    new CleanObsoleteChunks()
  ]
};
