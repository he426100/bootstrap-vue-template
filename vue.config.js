const path = require('path')
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const zopfli = require("@gfx/zopfli")
function resolve (dir) {
  return path.join(__dirname, dir)
}

const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV)

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'bootstrap-vue': 'bootstrapVue'
  },
  css: [
  ],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-vue@2.20.1/dist/bootstrap-vue.min.js',
  ]
}

const vueConfig = {
  // 生产环境的 source map
  productionSourceMap: !IS_PROD,

  configureWebpack: {
    plugins: [],
    // if prod, add externals
    externals: IS_PROD ? assetsCDN.externals : {}
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))

    config.plugin('html').tap(args => {
      args[0].title = ''
      // if prod is on
      // assets require on cdn
      if (IS_PROD) {
        args[0].cdn = assetsCDN
      }
      return args
    })

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        }

        return options
      })
  },

  css: {
    extract: IS_PROD,
    sourceMap: false
  },

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '/home',
        '/about'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    },
    sitemap: {
      productionOnly: true,
      outputDir: 'dist',
      baseURL: 'https://example.com',
			urls: [
        '/',
        '/home',
        '/about'
			]
		}
  }
}

if (IS_PROD) {
  vueConfig.configureWebpack.plugins.push(
    // Gzip
    new CompressionWebpackPlugin({
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback)
      },
      compressionOptions: {
        numiterations: 15
      },
      minRatio: 0.99,
      test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
    })
  )
}

module.exports = vueConfig
