const cheerio = require("cheerio");
let utils = {
  cleanWS: (str) => str.replace(/\n/g,"").replace(/[\s]{2,}/g," "),

  trimSpaces: (str) => {
    while (str[0] == " ") {
      str = str.slice(1);
    }
    while (str[str.length-1] == " ") {
      str = str.slice(0,-1);
    }
    return str;
  },

  querySelector: (selector,context,root) => {
    return utils.querySelectorAll(selector,context,root,false);
  },

  querySelectorAll: (selector,context,root,all=true) => {
    let query = root(selector,context);
    let results = [];
    for (let i in query) {
      if (!isNaN(parseInt(i))) {
        results.push(query[i]);
      }
    }
    return (all) ? results : results[0];
  },

  render: (cheerio_object) => {
    let text = cheerio.load(cheerio_object).text();
    return text;
  },

  elementChildren: (cheerio_object) => {
    return cheerio_object.children.filter(e => e.type != "text");
  },

  lastElementChild: (cheerio_object) => {
    let child = cheerio_object.children.filter(e => e.type != "text");
    return child[child.length-1];
  }
}

module.exports = utils;
