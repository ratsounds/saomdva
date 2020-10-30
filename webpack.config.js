const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    bundle: ['./src/index.js']
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: require('svelte-preprocess')({ postcss: true })
          }
        },
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: [
          path.resolve(__dirname, "static")
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: [
          path.resolve(__dirname, "static")
        ], use: [
          {
            loader: 'file-loader',
            options: {
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/ogp.png' }
      ],
      options: {
      },
    }),
    new HtmlWebpackPlugin({
      title: 'SAO:MD:VA',
      appMountId: 'app',
      filename: 'index.html',
      template: "src/index.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    runtimeChunk: 'single',
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
  devServer: {
    contentBase: path.join(__dirname, 'docs')
  }
};

module.exports = config;