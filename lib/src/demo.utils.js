import axios from 'axios';
import sass from 'sass.js';
import config from 'config'; // eslint-disable-line

/**
 * Carga un archivo markdown y lo renderiza
 *
 * @param {string} path - Ruta del archivo markdown
 * @return {object} - Markdown renderizado y datos contenidos en el archivo
 */
const getFile = async path => {
  try {
    const response = await axios.get(path);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

// prettier-ignore
const compileScss = style => new Promise(resolve => {
  /**
   * Importo los mixins, variables y los estilos de la demo
   */
  sass.importer(async (request, done) => {
    if (request.path === null) {
      const path = `${request.current}`;
      const css = await getFile(path);
      done({ content: css });
    } else {
      done();
    }
  });

  /**
     * Creo un archivo virtual con:
     * - los mixins, variables de la librería
     * - Los estilos de la demo
     */
  sass.writeFile('stylesheet.scss', `@import "${config.lib.shareStyles}";\n${style}`);
  sass.compile('@import "stylesheet";', result => resolve(result.text));
});

// prettier-ignore
const compilePug = code => new Promise(async resolve => {
  resolve(code);
});

const getVueScript = (js, html) => {
  if (!js) return { template: html };

  const scripts = js.split(/export\s+default/);
  const scriptStrOrg = `(function() {${scripts[0]} ; return ${scripts[1]}})()`;
  const scriptStr = window.Babel ? window.Babel.transform(scriptStrOrg, { presets: ['es2015'] }).code : scriptStrOrg;
  const scriptObj = [eval][0](scriptStr); // eslint-disable-line
  scriptObj.template = html;
  return scriptObj;
};

/**
 * Lee el código como un string y separa las diferentes partes: Javascript, Html y Css
 * Luego compila el código si es PUG o SASS
 * Finalmente monta un componente Vue con el Javascript y el HTML
 *
 * @param {*} code
 */
const getVueDetail = async code => {
  const htmlBlock = code.match(/<template>([\s\S]+)<\/template>/);
  const pugBlock = code.match(/<template lang="pug">([\s\S]+)<\/template>/);
  const jsBlock = code.match(/<script>([\s\S]+)<\/script>/);
  const scssBlock = code.match(/<style.*>([\s\S]+)<\/style>/);

  const htmlCode = htmlBlock && htmlBlock[1].replace(/^\n|\n$/g, '');
  const pugCode = pugBlock && pugBlock[1].replace(/^\n|\n$/g, '');
  const jsCode = jsBlock && jsBlock[1].replace(/^\n|\n$/g, '');
  const scssCode = scssBlock && scssBlock[1].replace(/^\n|\n$/g, '');

  const html = pugCode ? await compilePug(pugCode) : htmlCode || code;
  const css = scssCode ? await compileScss(scssCode) : '';

  const script = getVueScript(jsCode, html);

  return { script, css };
};

export default { getVueDetail };
