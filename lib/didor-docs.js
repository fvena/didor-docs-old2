/* eslint no-console: 0 */
const chalk = require('chalk'); // Colorea las salidas del terminal
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const utils = require('./build/utils');
const configWebpack = require('./build/webpack.config.dev');

const log = console.log;
const info = message => log(`${chalk.rgb(27, 131, 152)('ℹ')} ${chalk.gray('｢didor｣')}: ${message}`);
const error = message => log(`${chalk.rgb(27, 131, 152)('ℹ')} ${chalk.gray('｢didor｣')}: ${chalk.red('Error al generar la documentación:')}\n${message}\n\n`);

/**
 * Obtiene los parámetros de configuración
 * y inicializa un servidor local para ver la documentación
 *
 * @param {string} configFile -Ruta de la documentación
 */
module.exports = async configFile => {
  try {
    /**
     * Obtengo los datos del archivo de configuración del proyecto
     * y los mezclo con los valores por defecto
     */
    const configPath = configFile ? process.cwd() + configFile : `${process.cwd()}/didor.config.js`;
    const config = await utils.getConfigFile(configPath);

    /**
     * Compruebo si existen los directorios y los archivos indicados
     */
    const docsFolders = await utils.getDocsFolders(config.folders);
    const lib = config.lib ? await utils.checkLibData(config.lib) : false;

    /**
     * Configuro el servidor
     */
    const options = {
      contentBase: [path.join(process.cwd(), './node_modules/@didor/docs/lib/src'), path.join(process.cwd(), './node_modules/@didor/docs/dist'), ...docsFolders],
      port: config.port,
      hot: true,
      compress: true,
      open: config.open,
      publicPath: '/',
      host: 'localhost',
      quiet: false,
      clientLogLevel: 'silent',
      disableHostCheck: true,
      noInfo: true,
      historyApiFallback: true,
      onListening: server => {
        const serverPort = server.listeningApp.address().port;

        info(`Servidor arrancado en el puerto ${chalk.rgb(40, 164, 189).underline(`http://localhost:${serverPort}`)}.`);
        info('Contenido servido desde:');
        for (let index = 0; index < docsFolders.length; index += 1) {
          log(`  - ${chalk.rgb(40, 164, 189)(docsFolders[index])}`);
        }
      },
      before(app) {
        /**
         * La aplicación toma los parámetros de configuración del archivo /didor.config.js
         */
        app.get('/didor.config.js', (req, res) => {
          res.send(`window.$didor = {title:'${config.title}',description:'${config.description}',logo:'${config.logo}',navbar:'${config.navbar}',sidebar:'${config.sidebar}',defaultPath:'${config.defaultPath}',gitRepoLink:'${config.gitRepoLink}'};`);
        });
      },
    };

    /**
     * Configuro webpack
     */
    configWebpack.resolve.alias.config = configPath;

    if (lib && config.lib.components) {
      configWebpack.resolve.alias.components = path.join(process.cwd(), config.lib.components);
    } else {
      configWebpack.resolve.alias.components = './default.components.js';
    }

    if (lib && config.lib.styles) {
      configWebpack.resolve.alias.styles = path.join(process.cwd(), config.lib.styles);
    } else {
      configWebpack.resolve.alias.styles = './default.styles.scss';
    }

    if (lib && config.lib.shareStyles) {
      configWebpack.resolve.alias.shareStyles = path.join(process.cwd(), config.lib.shareStyles);
    } else {
      configWebpack.resolve.alias.shareStyles = './default.shareStyles.scss';
    }

    const htmlWebpack = new HtmlWebpackPlugin({
      filename: 'demo.html',
      title: 'Didor Docs - Demo',
      favicon: utils.resolve('src/favicon.png'),
      template: utils.resolve('src/demo.html'),
      inject: true,
    });

    configWebpack.plugins.push(htmlWebpack);
    configWebpack.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'style-resources-loader',
          options: {
            patterns: lib ? [path.join(process.cwd(), config.lib.shareStyles)] : '',
          },
        },
      ],
    });

    /**
     * Levanto un servidor para mostrar la documentación
     */
    WebpackDevServer.addDevServerEntrypoints(configWebpack, options);
    const compiler = webpack(configWebpack);
    const server = new WebpackDevServer(compiler, options);
    server.listen(config.port);

    return true;
  } catch (e) {
    error(e.message);
    return false;
  }
};
