const path = require('path');

module.exports = {
  publicPath: '',
  configureWebpack: {
    devServer: {
      contentBase: [path.join(process.cwd(), './public'), path.join(process.cwd(), './docs')],
    },
  },
  runtimeCompiler: true,
  transpileDependencies: ['@didor/didor'],
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, '@/design/var.scss')],
    },
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/design/var.scss";
          @import "./node_modules/@didor/components/src/didor/_didor-share.scss";
        `,
      },
    },
  },
};
