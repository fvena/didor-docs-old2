const flattenList = list => {
  let flatList = [];

  list.forEach(item => {
    if (item.children) {
      flatList = flatList.concat(flattenList(item.children));
    } else {
      flatList.push(item);
    }
  });

  return flatList;
};

export default {
  flattenList,
};
