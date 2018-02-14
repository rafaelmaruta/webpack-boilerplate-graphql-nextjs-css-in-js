'use strict'

const { join, resolve } = require('path')
const Aliases = require('./aliases')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')

const paths = {
  dist: join(__dirname, '..', 'build'),
  public: join(__dirname, '..', 'public'),
  root: join(__dirname, '..'),
  src: join(__dirname, '..', 'src'),
  importEach: '../src/scss/_import-each'
}

const pluginsList = {
  // commonChunkPlugin: [
  //   new Webpack.optimize.CommonsChunkPlugin({
  //     name: 'view',
  //     chunks: ['main'],
  //     minChunks: ({ resource }) => (
  //       /node_modules\/(react(-dom)?|fbjs)\//.test(resource)
  //     )
  //   }),

  //   new Webpack.optimize.CommonsChunkPlugin({
  //     name: 'vendor',
  //     chunks: ['main'],
  //     minChunks: ({ resource }) => (
  //       /node_modules/.test(resource)
  //     )
  //   })
  // ],

  extractTextPlugin: new ExtractTextPlugin({
    filename: '[name]-[chunkhash:8].css',
    disable: process.env.NODE_ENV === 'development',
    allChunks: true
  }),

  htmlPlugin: new HtmlPlugin({
    chunksSortMode: (chunk1, chunk2) => {
      const order = ['view', 'vendor', 'main']
      const left = order.indexOf(chunk1.names[0])
      const right = order.indexOf(chunk2.names[0])
      return left - right
    },
    minify: { collapseWhitespace: true },
    template: join(paths.src, 'index.ejs'),
    title: 'Store'
  }),

  moduleConcatenationPlugin: new Webpack.optimize.ModuleConcatenationPlugin()
}

module.exports = {
  paths,
  pluginsList,

  entry: {
    main: join(paths.src, 'js', 'index')
  },

  resolve: {
    alias: Aliases(paths),
    modules: [resolve(__dirname), '..', 'node_modules'],
    extensions: ['.css', '.scss', '.js', '.json', '.jsx']
  },

  preLoader: {
    enforce: 'pre',
    test: /\.jsx?$/,
    include: paths.src,
    exclude: /node_modules/,
    use: {
      loader: 'standard-loader',
      options: {
        parser: 'babel-eslint'
      }
    }
  },

  jsLoader: {
    test: /\.jsx?$/,
    include: paths.src,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              browsers: ['last 2 versions']
            }
          }],
          '@babel/stage-0',
          '@babel/preset-react',
          '@babel/preset-flow'
        ],
        plugins: [
          'react-hot-loader/babel',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-pipeline-operator',
          ['@babel/plugin-transform-runtime', {
            helpers: false,
            polyfill: false,
            regenerator: true
          }],
          ['module-resolver', {
            root: ['./src/js'],
            alias: {
              MasterPage: './src/js/structure',
              Actions: './src/js/actions',
              Reducers: './src/js/reducers',
              RootRoute: './src/js/routes',
              Store: './src/js/store'
            }
          }],
          ['react-css-modules', {
            context: paths.src,
            generateScopedName: '[local]-[hash:base64:5]',
            filetypes: {
              '.scss': {
                syntax: 'postcss-scss'
              }
            },
            webpackHotModuleReloading: true
          }]
        ]
      }
    }
  },

  cssLoader: {
    test: /\.css$/,
    // use: ['style-loader', 'css-loader']
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  },

  scssLoader: {
    test: /\.scss$/,
    exclude: /node_modules/,
    // use: [{
    //   loader: 'style-loader'
    // },
    // {
    //   loader: 'css-loader',
    //   options: {
    //     importLoaders: 1,
    //     localIdentName: '[local]-[hash:base64:5]',
    //     minimize: true,
    //     modules: true,
    //     sourceMap: true
    //   }
    // },
    // {
    //   loader: 'sass-loader',
    //   options: {
    //     data: '@import "' + paths.importEach + '";',
    //     sourceMap: true,
    //     includePaths: [ resolve(paths.src) ]
    //   }
    // }]
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[local]-[hash:base64:5]',
            minimize: true,
            modules: true,
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            data: '@import "' + paths.importEach + '";',
            sourceMap: true,
            includePaths: [ resolve(paths.src) ]
          }
        }
      ]
    })
  },

  fileLoader: {
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|txt)(\?.*)?$/,
    include: paths.src,
    exclude: /node_modules/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'media/[name].[hash:8].[ext]'
      }
    }
  },

  urlLoader: {
    test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
    include: paths.src,
    exclude: /node_modules/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:8].[ext]'
      }
    }
  },

  plugins: [
    // ...pluginsList.commonChunkPlugin,
    pluginsList.extractTextPlugin,
    pluginsList.htmlPlugin,
    pluginsList.moduleConcatenationPlugin
  ]
}
