var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const ASSET_PATH = process.env.ASSET_PATH || '/'
const isDevelopment = process.env.NODE_ENV !== 'production'

var alias = {}

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'popup', 'index.tsx'),
    background: path.join(__dirname, 'src', 'background', 'index.ts'),
    'content-script': path.join(__dirname, 'src', 'content-scripts', 'index.ts'),
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['background'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  // 禁用性能提示，避免字体文件大小警告
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin({
      exclude: [/node_modules/, /background/]
    }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    {
      apply: (compiler) => {
        compiler.hooks.thisCompilation.tap('CopyManifestPlugin', (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: 'CopyManifestPlugin',
              stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            },
            () => {
              const manifestContent = fileSystem.readFileSync(
                path.join(__dirname, 'src/manifest.json'),
                'utf8'
              )
              const manifest = JSON.parse(manifestContent)
              manifest.description = process.env.npm_package_description
              manifest.version = process.env.npm_package_version
              
              const manifestJson = JSON.stringify(manifest, null, 2)
              compilation.emitAsset(
                'manifest.json',
                new webpack.sources.RawSource(manifestJson)
              )
            }
          )
        })
      }
    },
    {
      apply: (compiler) => {
        compiler.hooks.thisCompilation.tap('CopyAssetsPlugin', (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: 'CopyAssetsPlugin',
              stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            },
            () => {
              const filesToCopy = [
                { from: 'src/assets/icon128.png', to: 'icon128.png' },
                { from: 'src/assets/icon48.png', to: 'icon48.png' },
              ]

              // Copy individual files
              filesToCopy.forEach(({ from, to }) => {
                const fromPath = path.join(__dirname, from)
                if (fileSystem.existsSync(fromPath)) {
                  const content = fileSystem.readFileSync(fromPath)
                  compilation.emitAsset(to, new webpack.sources.RawSource(content))
                }
              })

              // Copy _locales directory recursively
              const localesPath = path.join(__dirname, 'src/_locales')
              if (fileSystem.existsSync(localesPath)) {
                const copyDir = (srcDir, destDir) => {
                  const items = fileSystem.readdirSync(srcDir)
                  items.forEach(item => {
                    const srcPath = path.join(srcDir, item)
                    const destPath = path.join(destDir, item)
                    const stat = fileSystem.statSync(srcPath)
                    
                    if (stat.isDirectory()) {
                      copyDir(srcPath, destPath)
                    } else {
                      const content = fileSystem.readFileSync(srcPath)
                      const relativePath = path.relative(path.join(__dirname, 'src'), srcPath).replace(/\\/g, '/')
                      compilation.emitAsset(relativePath, new webpack.sources.RawSource(content))
                    }
                  })
                }
                copyDir(localesPath, '_locales')
              }
            }
          )
        })
      }
    },
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
  ].filter(Boolean),
  infrastructureLogging: {
    level: 'info',
  },
}

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map'
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = options
