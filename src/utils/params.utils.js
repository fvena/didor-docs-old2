const getArticlePath = routerPath => {
  const splitPath = routerPath.split('/').filter(item => item !== '');
  const section = `/${splitPath.shift()}`;
  const article = `/${splitPath.join('/')}`;

  return {
    section,
    article,
  };
};

export default {
  getArticlePath,
};
