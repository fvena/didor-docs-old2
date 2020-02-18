const chalk = require('chalk'); // Colorea las salidas del terminal
const pathExists = require('path-exists'); // Comprueba si existe un directorio
const path = require('path');

const defaultConfigFile = '/didor.config.js';
const defautlPort = 8080;
const defaultFolders = ['/docs'];

/**
 * Devuelve una cadena formateado con el nombre del archivo.
 *
 * @param {String} - Nombre del archivo
 * @return {String} - Nombre del archivo formateado
 */
const fileLog = file => chalk.rgb(40, 164, 189).underline(`${file}`);

/**
 * Obtiene el archivo con la configuración del proyecto,
 * sino lo encuentra, devuelve los parámetros por defecto.
 *
 * @param {String} - Ruta del archivo de configuración del proyecto
 * @return {Object} - Datos de configuración del proyecto
 * @throws {String} - Error al no encontrar el archivo de configuración del proyecto
 */
const getConfigFile = async configFile => {
  const configPath = configFile ? process.cwd() + configFile : process.cwd() + defaultConfigFile;
  const validateConfigPath = await pathExists(configPath).then(exists => exists);

  if (validateConfigPath) {
    const config = require(configPath); // eslint-disable-line
    if (!config.port) config.port = defautlPort;
    if (!config.folders) config.folders = defaultFolders;

    return config;
  }

  if (!configFile) {
    return {
      port: defautlPort,
      folders: defaultFolders,
    };
  }

  throw new Error(`  - No se encuentra el archivo de configuración ${fileLog(configPath)}`);
};

/**
 * Obtiene las rutas completas de los directorios con la documentación
 * comprueba que los directorios existen y lanza un error si no los encuentra
 *
 * @param {Array} - Listado de directorios
 * @return {Array} - Rutas completas de los directorios con la documentación
 * @throws {String} - Error al comprobar si alguno de los directorios no existe
 */
const getDocsFolders = async folders => {
  const docsFolders = [];
  let errorFolders = '';

  if (!Array.isArray(folders)) {
    throw new Error('  - El campo folders debe ser un Array');
  }

  if (folders.length <= 0) folders = defaultFolders;

  for (let index = 0; index < folders.length; index += 1) {
    const docsBasePath = process.cwd() + folders[index];
    const validateDocFolder = await pathExists(docsBasePath).then(exists => exists); // eslint-disable-line

    if (!validateDocFolder) {
      errorFolders += `- No se encuentra el directorio ${fileLog(docsBasePath)}\n`;
    } else {
      docsFolders.push(docsBasePath);
    }
  }

  if (errorFolders) throw new Error(errorFolders);

  return docsFolders;
};

/**
 * comprueba que existan todos los recursos de una libreria,
 * sino, lanza un error si no los encuentra
 *
 * @param {Object} - Datos de la libreria
 * @return {Boolean} - Indica si existen todos los recursos
 * @throws {String} - Error al comprobar si existen las rutas de todos los recursos
 */
const checkLibData = async lib => {
  let errorLib = '';

  if (!lib.components) errorLib += '  - Debe especificar una ruta con los componentes\n';
  if (!lib.styles) errorLib += '  - Debe especificar una ruta con los estilos de los componentes\n';
  if (!lib.shareStyles) errorLib += '  - Debe especificar una ruta con los estilos compartidos\n';

  if (errorLib) throw new Error(errorLib);

  const componentPath = process.cwd() + lib.components;
  const stylePath = process.cwd() + lib.styles;
  const shareStylesPath = process.cwd() + lib.shareStyles;
  const validateComponentPath = await pathExists(componentPath).then(exists => exists);
  const validateStylePath = await pathExists(stylePath).then(exists => exists);
  const validateshareStylesPath = await pathExists(shareStylesPath).then(exists => exists);

  if (!validateComponentPath) errorLib += `- No se encuentra el directorio con los componentes ${chalk.rgb(40, 164, 189).underline(`${componentPath}`)}\n`;
  if (!validateStylePath) errorLib += `- No se encuentra el archivo con los estilos ${chalk.rgb(40, 164, 189).underline(`${stylePath}`)}\n`;
  if (!validateshareStylesPath) errorLib += `- No se encuentra el archivo con los estilos compartidos ${chalk.rgb(40, 164, 189).underline(`${shareStylesPath}`)}\n`;

  if (errorLib) throw new Error(errorLib);

  return true;
};

const resolve = dir => path.join(__dirname, '..', dir);

const assetsPath = _path => {
  const assetsSubDirectory = 'static';
  return path.posix.join(assetsSubDirectory, _path);
};

module.exports = {
  getConfigFile,
  getDocsFolders,
  checkLibData,
  resolve,
  assetsPath,
};
