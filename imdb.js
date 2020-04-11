const fetch = require("node-fetch");
const cheerio = require("cheerio");
const utils = require("./utils.js").utils;

let enhanceAmazonPoster = (url) => {
  try {
    url = url.split("._V");
    return url[0]+"._V"+url[1].replace(/[1-9]{2,}/g,((u) => parseInt(u)*4));
  } catch {
    return (typeof url !== "string") ? url[0]:url;
  }
}

const IMDB = {
  URL: {
    root: "https://www.imdb.com/search/title/?title_type=feature",
    rating: "&user_rating=", //format: 1.8,2.3
    count: "&count=",
    start: "&start=",
    date: "&release_date=",
    genre: "&genres=",
    awards: "&groups=",
    plot: "&plot=",
    sort: "&sort=" //format: sort_key,asc|desc
  },
  SORT_KEYS: [
    "alpha","num_votes","boxoffice_gross_us","runtime","year"
  ],
  GENRES: ["action","adventure","animation","biography","comedy",
	"crime","documentary","drama","family","fantasy","film-noir",
	"game-show","history","horror","music","musical","mystery",
	"news","reality-tv","romance","sci-fi","sport","talk-show",
	"thriller","war","western"],
  AWARDS: ["oscar_winner","emmy_winner",
	"golden_globe_winner","best_picture_winner","best_director_winner"],
  buildQuery: (search_params) => {
    let url = IMDB.URL.root;
    [...search_params].map(e => {
      if (typeof IMDB.URL[e[0]] === "string") {
        url += IMDB.URL[e[0]]+e[1];
      }
    });
    return url;
  },
  getIMDB: async (url) => {
    url = await fetch(url,{headers: { "Accept-Language": "en" }});
    url = await url.text();
    let root = cheerio.load(utils.cleanWS(url));
    let list = utils.querySelectorAll(".lister-item","",root);
    list = list.map(e => {
      let movie = {};
      movie.cover = enhanceAmazonPoster(
        utils.querySelector(".lister-item-image a img",e,root).attribs.loadlate);
      movie.title = utils.render(utils.querySelector("h3 a",e,root));
      movie.year = utils.render(utils.lastElementChild(utils.querySelector("h3",e,root)));
      try {
        movie.year = movie.year.split("(")[1].split(")")[0];
      } catch {
        movie.year = "";
      }
      utils.querySelectorAll("p",e,root).map((p,i) => {
        if (i == 0) {
            try {
              p = utils.render(p).split("|");
              if (p.length == 3) {
                movie.duration = p[1];
                movie.genres = p[2].split(",");
              } else if (p.length == 2) {
                movie.duration = p[0];
                movie.genres = p[1].split(",");
              } else if (p.length == 1) {
                movie.duration = "";
                movie.genres = p[0].split(",");
              }
            } catch {
              movie.duration = "";
              movie.genres = [];
            }
        } else if (i == 1) {
          try {
            movie.abstract = utils.render(p);
          } catch {
            movie.abstract = "";
          }
        } else if (i == 2) {
          try {
            movie.director = utils.render(utils.querySelector("a", p, root));
          } catch {
            movie.director = "";
          }
        }
      });
      for (let i in movie) {
        if (typeof movie[i] !== "string") {
          movie[i] = movie[i].map(e => utils.trimSpaces(e));
        } else {
          movie[i] = utils.trimSpaces(movie[i]);
        }
      }
      return movie;
    });
    return list
  }
}

module.exports = IMDB;
