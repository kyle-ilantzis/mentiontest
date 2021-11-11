const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.NODE_ENV === 'dev'
const mode = isDev ? 'development' : 'production';

const babelOptions = {
  "presets": ["@babel/env", "@babel/preset-react"]
}

module.exports = {
  mode,
  entry: {
    // main: {
    //   import: './src/index.tsx',
    //   dependOn: 'vendor',
    // },
    // vendor: [
    //   'react',
    //   'react-dom',
    // ]
    main: './src/index.tsx',
    // vendor: [ 'react', 'react-dom'],
  },
  // output: {
  //   filename: 'main.js',
  //   path: path.resolve(__dirname, 'dist'),
  // },
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
      }
    ]
  },
  // devtool: null,
  performance: {
    hints: !!isDev,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module.identifier().split('/').reduceRight((item) => item);
            // const allChunksNames = chunks.map((item) => item.name).join('~');
            return `${cacheGroupKey}-${moduleFileName}`;
          },
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'trixtest',
      template: './src/index.html',
      scriptLoading: 'blocking',
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: false,
    port: 9000,
  },
};