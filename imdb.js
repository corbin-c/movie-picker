const fetch = require("node-fetch");
const cheerio = require("cheerio");
const YouTube = new (require("youtube-node"))();
const utils = require("./utils.js");
YouTube.setKey(process.ENV.YT_KEY);

class IMDB {
  constructor() {
    this.URL = {
      root: "https://www.imdb.com/",
      search: {
        movie: "search/title/?title_type=feature&production_status=released",
        bio: "name/",
        videoSearch: "title/",
        video: "videoplayer/"
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
      "alpha","num_votes","boxoffice_gross_us","moviemeter","runtime","year","user_rating"
    ];
    this.GENRES = ["action","adventure","animation","biography","comedy",
      "crime","documentary","drama","family","fantasy","film-noir",
      "game-show","history","horror","music","musical","mystery",
      "news","reality-tv","romance","sci-fi","sport","talk-show",
      "thriller","war","western"];
    this.AWARDS = ["oscar_winner",
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
  async fetcher(url,type,raw=false) {
    url = this.URL.root + this.URL.search[type] + url;
    url = await fetch(url,{headers: { "Accept-Language": "en" }});
    url = await url.text();
    if (raw) {
      return url;
    }
    return cheerio.load(utils.cleanWS(url));
  }
  async suggestions(query,type) {
    if (this.SUGGESTIONS_TYPES.includes(type)) {
      type = type+"/";
      let url = "https://v2.sg.media-imdb.com/suggestion/"+type+query[0].toLowerCase()+"/"+query+".json"
      url = await fetch(url);
      url = await url.json();
      return url.d;
    } else {
      let names = await this.suggestions(query,"names");
      let titles = await this.suggestions(query,"titles");
      return [...names, ...titles].sort((a,b) => a.rank - b.rank).slice(0,8);
    }
  }
  async getMovieById(id) {
    let suggestion = await this.suggestions(id,"titles");
    let movie = {};
    suggestion = suggestion[0];
    movie.cover = { big: suggestion.i.imageUrl };
    movie.id = suggestion.id;
    movie.title = suggestion.l;
    movie.year = suggestion.y;
    movie.rating = "";
    movie.abstract = "";
    movie.roles = suggestion.s.split(",").map(e => ({ name: utils.trimSpaces(e) }));
    return movie;
  }
  async fetchMovie(url) {
    let root = await this.fetcher(url, "movie");
    let list = utils.querySelectorAll(".lister-item","",root);
    list = list.map(e => {
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
        movie.year = movie.year.split("(");
        movie.year = utils.trimSpaces(movie.year[movie.year.length-1].split(")")[0]);
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
          if (movie.abstract.toLowerCase() === "add a plot") {
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
      id = id[0].id;
    }
    let root = await this.fetcher(id+"/bio","bio");
    let person = { id };
    try {
      person.picture = {};
      person.picture.small = utils.querySelector(".poster","",root).attribs.src;
      person.picture.medium = this.enhanceAmazonPoster(person.picture.small);
      person.picture.big = this.enhanceAmazonPoster(person.picture.small,true);
    } catch {};
    person.name = utils.trimSpaces(
      utils.render(
        utils.querySelector(".subpage_title_block .parent h3 a","",root)
    ));
    try {
      person.bio = utils.trimSpaces(
        utils.render(
          utils.querySelector("#bio_content .soda p","",root)
      ));
    } catch {
      person.bio = "";
    }
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
  async getImdbTrailer(id) {
    try {
      let trailer = await this.fetcher(id+"/videogallery/content_type-trailer/","videoSearch");
      trailer = utils.querySelector("#main .search-results li a","",trailer).attribs.href;
      trailer = await this.fetcher(trailer.split("/")[2],"video",true);
      trailer = trailer.split(`{\\"definition\\":\\"480p\\",\\"mimeType\\":\\"video/mp4\\",\\"url\\":\\"`)[1].split('\\"}')[0];
      return trailer;
    } catch {
      throw "unable to retrieve video from IMDB";
    }
  }
  getTrailer(title,year,id) {
    return new Promise((resolve, reject) => {
      YouTube.search(title+" trailer "+year, 15, (error, result) => {
        if (error) {
          console.error(error,title,year)
          //fallback to imdb trailer
          this.getImdbTrailer(id).then(e => {
            resolve({"imdb":e});
          }).catch(() => {
            reject("no video found");
          });
        } else {
          result = result.items.filter(e => typeof e.id !== "undefined");
          result.forEach(e => {
            let title = e.snippet.title.toLowerCase();
            if (title.includes("theatrical")) {
              e.rank = 2;
            } else if (title.includes("official")) {
              e.rank = 1;
            } else {
              e.rank = 0;
            }
          });
          result = result.sort((a,b) => b.rank - a.rank);
          resolve({"youtube":result[0].id.videoId});
        }
      })
    });
  }
}

module.exports = (new IMDB());
