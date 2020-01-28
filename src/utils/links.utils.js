function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuu,uuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // ceplace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function getParentNode(level, jsonTree) {
  let i = 0;
  let node = jsonTree[jsonTree.length - 1];

  while (i < level - 1) {
    const childNodes = node.childNodes;
    node = childNodes[childNodes.length - 1];
    i += 1;
  }

  if (!node.childNodes) {
    node.childNodes = [];
  }

  return node;
}

function Node(title, link, slug) {
  this.title = title;
  this.link = link || '';
  this.slug = slug || '';
}

/**
 * Generate a list of links in the string
 *
 * @params  {String} links - String with links
 * @returns {Array} - Array of objects with name and path of the link
 */
// prettier-ignore
const getListLinks = (markdown, section) => new Promise(resolve => {
  const jsonTree = [];
  const lines = markdown.split('\n');
  const regex = /^(\s*)-\s\[(.*)\]\s*(\((.*)\))?/;

  lines.forEach(line => {
    const matchs = line.match(regex);

    if (matchs) {
      const level = matchs[1].length / 2;
      const title = matchs[2];
      const slug = section ? `${section}/${slugify(title)}` : `/${slugify(title)}`;
      const link = matchs[4];
      const node = new Node(title, link, slug);

      if (level === 0) {
        jsonTree.push(node);
      } else {
        const p = getParentNode(level, jsonTree);
        p.childNodes.push(node);
      }
    }
  });

  resolve(jsonTree);
});

export default {
  getListLinks,
};
