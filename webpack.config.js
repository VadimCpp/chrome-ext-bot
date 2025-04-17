const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.ts',
    content:    './src/content.ts',
    popup:      './src/popup.ts',
    sidebar:    './src/sidebar.ts',
    styles:     './src/styles.css',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/types': path.resolve(__dirname, 'src/types/index.ts'),
      '@/enums': path.resolve(__dirname, 'src/enums/index.ts'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/*.html',      to: '[name][ext]' },
        { from: 'src/*.png',       to: '[name][ext]' },
        { from: 'src/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
  devtool: 'source-map',
};
