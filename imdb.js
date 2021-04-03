const fetch = require("node-fetch");
const cheerio = require("cheerio");
const utils = require("./utils.js");

class IMDB {
  constructor() {
    this.URL = {
      root: "https://www.imdb.com/",
      search: {
        movie: "search/title/?title_type=feature",
        bio: "name/"
      },
      rating: "user_rating", //format: min,max
      title: "title",
      stars: "role",
      duration: "runtime", //(min,max) | value
      count: "count",
      start: "start",
      date: "release_date",
      genre: "genres",
      awards: "groups",
      plot: "plot",
      sort: "sort" //format: sort_key,asc|desc
    };
    this.SUGGESTIONS_TYPES = ["names","titles"];
    this.SORT_KEYS = [
      "alpha","num_votes","boxoffice_gross_us","runtime","year"
    ];
    this.GENRES = ["action","adventure","animation","biography","comedy",
      "crime","documentary","drama","family","fantasy","film-noir",
      "game-show","history","horror","music","musical","mystery",
      "news","reality-tv","romance","sci-fi","sport","talk-show",
      "thriller","war","western"];
    this.AWARDS = ["oscar_winner","emmy_winner",
      "golden_globe_winner","best_picture_winner","best_director_winner"];
  }
  buildQuery(parameters) {
    let url = "";
    Object.keys(parameters).map(key => {
      if (typeof this.URL[key] !== "undefined") {
        url += "&"+this.URL[key]+"="+parameters[key];
      }
    });
    return url;
  }
  enhanceAmazonPoster(url, huge=false) {
    try {
      url = url.split("._V");
      if (!huge) {
        return url[0]+"._V"+url[1].replace(/[1-9]{2,}/g,((u) => parseInt(u)*5));
      } else {
        return url[0]+"._V"+url[1].slice(0, 2)+"."+url[1].split(".")[1];
      }
    } catch {
      return (typeof url !== "string") ? url[0]:url;
    }
  }
  async fetcher(url,type) {
    url = this.URL.root + this.URL.search[type] + url;
    url = await fetch(url,{headers: { "Accept-Language": "en" }});
    url = await url.text();
    return cheerio.load(utils.cleanWS(url));
  }
  async suggestions(query,type) {
    if (this.SUGGESTIONS_TYPES.includes(type)) {
      type = type+"/" 
    } else {
      type = "";
    }
    let url = "https://v2.sg.media-imdb.com/suggestion/"+type+query[0].toLowerCase()+"/"+query+".json"
    url = await fetch(url);
    url = await url.json();
    return url;
  }
  async fetchMovie(url) {
    let root = await this.fetcher(url, "movie");
    let list = utils.querySelectorAll(".lister-item","",root);
    list = list.map(async e => {
      let movie = {};
      movie.cover = {};
      movie.cover.small = utils.querySelector(".lister-item-image a img",e,root).attribs.loadlate;
      movie.cover.medium = this.enhanceAmazonPoster(movie.cover.small);
      movie.cover.big = this.enhanceAmazonPoster(movie.cover.small,true);
      movie.title = utils.querySelector("h3 a",e,root);
      movie.id = movie.title.attribs.href.split("/")[2];
      movie.title = utils.trimSpaces(utils.render(movie.title));
      movie.year = utils.render(utils.lastElementChild(utils.querySelector("h3",e,root)));
      try {
        movie.year = utils.trimSpaces(movie.year.split("(")[1].split(")")[0]);
      } catch {
        movie.year = "";
      }
      try {
        movie.rating = utils.querySelector(".ratings-imdb-rating", e, root)
          .attribs["data-value"];
      } catch {
        movie.rating = "";
      }
      utils.querySelectorAll("p",e,root).forEach((p,i) => {
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
              movie.duration = utils.trimSpaces(movie.duration);
              movie.genres = movie.genres.map(e => utils.trimSpaces(e));
            } catch {
              movie.duration = "";
              movie.genres = [];
            }
        } else if (i == 1) {
          try {
            movie.abstract = utils.trimSpaces(utils.render(p));
          } catch {
            movie.abstract = "";
          }
        } else if (i == 2) {
          movie.roles = [];
          let roles = utils.querySelectorAll("*", p, root);
          let ghostIndex = roles.findIndex(e => e.attribs.class == "ghost");
          roles.forEach((role,index) => {
            if (role.name == "a") {
              let name = utils.trimSpaces(utils.render(role));
              let id = role.attribs.href.split("/")[2];
              movie.roles.push({
                id,
                name,
                role: (index > ghostIndex) ? "star":"director"
              });
            }
          });
        }
      });
      return movie;
    });
    return list
  }
  async getPerson(id) {
    if (isNaN(parseInt(id.split("nm")[1]))) {
      id = await this.suggestions(id,"names");
      //this is not a proper ID.
      //let's assume it's a name & find out its ID
      id = id.d[0].id;
    }
    let root = await this.fetcher(id+"/bio","bio");
    let person = { id };
    person.picture = {};
    person.picture.small = utils.querySelector(".poster","",root).attribs.src;
    person.picture.medium = this.enhanceAmazonPoster(person.picture.small);
    person.picture.big = this.enhanceAmazonPoster(person.picture.small,true);
    person.name = utils.trimSpaces(
      utils.render(
        utils.querySelector(".subpage_title_block .parent h3 a","",root)
    ));
    person.bio = utils.trimSpaces(
      utils.render(
        utils.querySelector("#bio_content .soda p","",root)
    ));
    return person;
  }
  async getMovies(parameters) {
    let movieList = await this.fetchMovie(this.buildQuery(parameters));
    return movieList;
  }
  async wikiDataSPARQL(imdb_id) {
    let url = "https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3Frotten%20%3Fmeta%20%3Fwiki%20WHERE%20%7B%0A%20%20%3Fitem%20wdt%3AP345%20%22"+imdb_id+"%22.%0A%20%20%3Fitem%20wdt%3AP1258%20%3Frotten.%0A%20%20%3Fitem%20wdt%3AP1712%20%3Fmeta.%0A%20%20%3Farticle%20schema%3Aabout%20%3Fitem%3B%0A%20%20%20%20schema%3AinLanguage%20%3Flang%3B%0A%20%20%20%20schema%3Aname%20%3Fwiki%3B%0A%20%20%20%20schema%3AisPartOf%20_%3Ab7.%0A%20%20_%3Ab7%20wikibase%3AwikiGroup%20%22wikipedia%22.%0A%20%20FILTER(%3Flang%20IN(%22en%22))%0A%20%20FILTER(!(CONTAINS(%3Fwiki%2C%20%22%3A%22)))%0A%7D&format=json";
    url = await fetch(url);
    url = await url.json();
    url = url.results.bindings[0];
    let results = {};
    Object.keys(url).forEach(e => {
      results[e] = url[e].value;
    })
    return results;
  }
}

module.exports = (new IMDB());
