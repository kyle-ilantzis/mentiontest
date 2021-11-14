const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.NODE_ENV === 'dev'
const mode = isDev ? 'development' : 'production';

const babelOptions = {
  "presets": ["@babel/env", "@babel/preset-react"]
}

module.exports = {
  mode,
  entry: {
    main: './src/index.tsx',
  },
  output: {
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: '/node_modules',
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'ts-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2)$/,
      },
      // {
      //   test: /\.(woff|woff2|eot|ttf|svg)$/i,
      //   loader: 'file-loader',
      //   options: { name: '[name].[ext]', outputPath: 'assets/fonts/' },
      // },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: { name: '[name].[ext]', outputPath: 'assets/images/' },
      },
    ]
  },
  // devtool: null,
  performance: {
    hints: !!isDev,
  },
  optimization: {
    splitChunks: {
      chunks: "initial",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'assets/js/vendor.[name].bundle.js',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'trixtest',
      template: './src/index.html',
      scriptLoading: 'blocking',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: false,
    port: 9000,
  },
};