/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const filename = extension => isDevelopment ? `[name].${extension}` : `[name].[contenthash].${extension}`;

const optimization = () => {

  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProduction) {
    config.minimizer = [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
}

const tsLoaders = () => {
  const loaders = [];

  if (isDevelopment) {
    loaders.push('eslint-webpack-plugin')
  }
}


module.exports = {
  // context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './src/index',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', 'json', '.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      'appIcons': path.resolve(__dirname, 'src/assets/icons/'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDevelopment,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProduction,
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new EslintPlugin({ extensions: 'ts' }),
    new CopyPlugin({
      patterns: [
        { from: "build-options", to: "./" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext][query]'
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.(mp3)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[hash][ext][query]'
        }
      },
      {
        test: /\.ts$/,
        exclude: /node-modules/,
        use: tsLoaders(),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          }
        ],
      },

    ]
  },
  devtool: 'eval-source-map',
}