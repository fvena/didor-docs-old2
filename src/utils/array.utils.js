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

function searchArticleBySlug(data, matchingSlug) {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].slug === matchingSlug) {
      return data[i];
    }
    if (data[i].childNodes && data[i].childNodes.length && typeof data[i].childNodes === 'object') {
      return searchArticleBySlug(data[i].childNodes, matchingSlug);
    }
  }

  return null;
}

// function searchArticleBySlug(array, matchingSlug) {
//   console.log(array);
//   if (array.slug === matchingSlug) {
//     return array.link;
//   }
//   if (array.childNodes !== null) {
//     let i;
//     let result = null;
//     for (i = 0; result == null && i < array.childNodes.length; i += 1) {
//       result = searchArticleBySlug(array.childNodes[i], matchingSlug);
//     }
//     return result;
//   }
//   return null;
// }

export default {
  flattenList,
  searchArticleBySlug,
};
