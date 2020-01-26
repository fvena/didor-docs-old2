const getSection = routerPath => {
  const splitPath = routerPath.split('/').filter(item => item !== '');
  return splitPath.shift();
  // const article = `/${splitPath.join('/')}`;

  // return {
  //   section,
  //   article,
  // };
};

export default {
  getSection,
};
