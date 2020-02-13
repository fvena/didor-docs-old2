/* eslint no-console: 0 */

const chalk = require('chalk'); // Colorea las salidas del terminal
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const pathExists = require('path-exists'); // Comprueba si existe un directorio
const configWebpack = require('./build/webpack.config.dev');
// it includes the HMR plugin
const log = console.log;

/**
 * Inicializa un servidor local para ver la documentación
 * @param  {string}     dir            [Ruta de la documentación]
 * @param  {object}     config         [Parametros de configuración]
 *    @param  {boolean} open           [Abre la documentación en el navegador por defecto]
 *    @param  {integer} port           [Puerto de la documentación]
 *    @param  {integer} liveReloadPort [Puerto para el liveReload]
 */
module.exports = async (dir, config) => {
  try {
    /*
     * Compruebo si he recibido algún directorio con la documentación
     * Sino, añado el directorio por defecto
     */
    if (!dir || !dir.length) dir = ['/docs'];

    /*
     * Obtengo la ruta y compruebo los directorios con la documentación
     */
    const docsFolders = [];
    let validateDocsFolder = true;

    for (let index = 0; index < dir.length; index += 1) {
      const docsBasePath = process.cwd() + dir[index];
      const validateDocFolder = await pathExists(docsBasePath).then(exists => exists); // eslint-disable-line

      if (!validateDocFolder) {
        validateDocsFolder = false;
        // prettier-ignore
        console.log(`${chalk.red('Error al generar la documentación:')} No se encuentra el directorio ${docsBasePath}`);
      }

      docsFolders.push(docsBasePath);
    }

    if (!validateDocsFolder) return false;

    /*
     * Levanto un servidor para mostrar la documentación
     */
    const options = {
      contentBase: [path.join(process.cwd(), './node_modules/didor-docs/lib/src'), path.join(process.cwd(), './node_modules/didor-docs/dist'), ...docsFolders],
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
        const port = server.listeningApp.address().port;
        const pre = `${chalk.rgb(27, 131, 152)('ℹ')} ${chalk.gray('｢didor｣')}:`;
        log('\n');

        // prettier-ignore
        log(`${pre} Servidor arrancado en el puerto ${chalk.rgb(40, 164, 189).underline(`http://localhost:${port}`)}.`);
        log(`${pre} Contenido servido desde ${chalk.rgb(40, 164, 189)(dir)}.`);
        log(`${pre} Demo - Hoja de estilos ${chalk.rgb(40, 164, 189)(config.lib)}.`);
        log(`${pre} Demo - Librería ${chalk.rgb(40, 164, 189)(config.styles)}.`);
        log(`${pre} Demo - Estilos compartidos ${chalk.rgb(40, 164, 189)(config.shareStyles)}.`);
      },
    };

    configWebpack.resolve.alias.components = path.join(process.cwd(), config.lib);
    configWebpack.resolve.alias.styles = path.join(process.cwd(), config.styles);
    configWebpack.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'style-resources-loader',
          options: {
            patterns: [path.join(process.cwd(), config.shareStyles)],
          },
        },
      ],
    });

    WebpackDevServer.addDevServerEntrypoints(configWebpack, options);
    const compiler = webpack(configWebpack);
    const server = new WebpackDevServer(compiler, options);

    server.listen(config.port);

    return true;
  } catch (error) {
    console.log(chalk.red('Ha ocurrido un error'));
    console.log(error);

    return false;
  }
};
