const flattenList = list => {
  let flatList = [];

  list.forEach(item => {
    if (item.childNodes) {
      flatList = flatList.concat(flattenList(item.childNodes));
    } else {
      flatList.push(item);
    }
  });

  return flatList;
};

/**
 * Devuelve el item de la lista cuyo slug coincida con el indicado
 *
 * @params {array} list - Lista con todos los items
 * @params {string} matchingSlug - Slug que estamos buscando
 * @returns {Object} - Objeto encontrado
 */
// prettier-ignore
const searchItemBySlug = (list, matchingSlug) => new Promise(resolve => {
  const flatList = flattenList(list);
  const index = flatList.findIndex(item => item.slug === matchingSlug);
  const current = flatList[index];

  const item = {};
  item.current = current;
  item.prev = index - 1 >= 0 ? flatList[index - 1] : null;
  item.next = index + 1 <= flatList.length ? flatList[index + 1] : null;

  resolve(item);
});

const checkArray = myArray => Array.isArray(myArray) && myArray.length > 0;

export default {
  flattenList,
  searchItemBySlug,
  checkArray,
};
