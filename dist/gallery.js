export class Gallery {
  constructor(parentElement,genre,genresList,modules) {
    this.parent = parentElement;
    this.status = {currentGrid:[]};
    this.sorted = "boxoffice_gross_us,desc"
    this.more = false;
    this.zoom = 12.5;
    this.view = "grid";
    this.ready = false;
    this.gridStatus = [];
    this.genre = genre;
    this.infobox = modules.infobox(this.parent,genresList.list);
    this.settings = modules.settings(document.querySelector("body"),{
      toggleGenre:(args) => {
        this.toggleGenre.call(this,args);
      },
      sort:(key,direction) => {
        this.setSort.call(this,key,direction)
      },
      getGenres:() => this.genre,
      updatePeriod:(period) => {
        this.period = period;
      },
      getGenresList:() => genresList.list,
      showGenresList:(parent,cb) => genresList.show(parent,cb)
    });
    [...document.querySelectorAll("button")].map(button => {
      if (["prev","dice"].indexOf(button.getAttribute("id")) < 0) {
        button.classList.remove("hidden");
      }
      button.addEventListener("click",() => {
        this[this.view][button.getAttribute("id")]();
      });
    });
  }
  grid = {
    next: () => {
      this.page++;
    },
    prev: () => {
      this.page--;
    },
    settings: () => {
      this.settings.toggle();
    },
    dice: () => {}
  }
  player = {
    next: () => {
      this.trailer++;
    },
    prev: () => {
      this.trailer--;
    },
    settings: () => {
      this.grid.settings();
    },
    dice: async () => {
      let randomMovie = await fetch("./random");
      randomMovie = await randomMovie.json();
      this.YTplayer(randomMovie.trailer);      
    }
  }
  setCSS(selector,key,value) {
    document.styleSheets[0].cssRules[
    [...document.styleSheets[0].cssRules].indexOf(
      [...document.styleSheets[0].cssRules]
        .find(e => e.selectorText == selector))].style[key] = value;
  }
  setStatus(key,value,verbose=false) {
    this.status[key] = value;
    if (verbose) { console.log(key,this.status[key]); }
  }
  toggleGenre(value) {
    let index = this.genre.indexOf(value);
    if (index < 0) {
      this.genre = [...this.genre,value];
    } else {
      this.status.genre.splice(index,1);
      this.genre = this.status.genre;
    }
  }
  setSort(key,direction) {
    this.sorted = key+","+direction;
    this.setStatus("start",null);
    this.page = 0;
  }
  set genre(value) {
    value = (typeof value === "string") ? [value]:value;
    this.setStatus("genre",value);
    this.setStatus("start",null);
    this.page = 0;
  }
  set period(value) {
    this.setStatus("period",value);
    this.setStatus("start",null);
    this.page = 0;
  }
  set page(value) {
    let start = 1;
    try {
      if ((typeof this.status.page === "unedfined")
        || (this.status.start === null)) {
        start = 1;
      } else {
        if (this.status.page < value) {
          start = (this.status.count+this.status.start || 1)
        } else {
          start = (this.status.start-this.status.count || 1)
        }
        start = Math.max(start,1);
      }
    } catch {
      console.log("page undefined");
    }
    this.setStatus("page",Math.ceil(start/this.status.count));
    this.show(this.status.count,start);
    if (this.status.page > 1) {
      document.querySelector("#prev").classList.remove("hidden");
    } else {
      document.querySelector("#prev").classList.add("hidden");
    }
  }
  set zoom(value) {
    this.setStatus("zoom",value);
    this.columns = Math.floor(100/this.zoom);
    this.rows = Math.floor((100*(window.outerHeight/window.outerWidth))
      /(this.zoom/0.683));
    this.status.count = this.rows*this.columns;
    this.setCSS("main","grid-template-columns","repeat("+this.columns+", 1fr)");
    this.setCSS("img","width",this.zoom+"vw"); 
    this.refresh();
  }
  set trailer(item_id) {
    this.view = "player";
    item_id = Math.max(0,item_id);
    this.setStatus("trailer",item_id);
    this.playTrailer(item_id);
    if (item_id > 0) {
      document.querySelector("#prev").classList.remove("hidden");
    } else {
      document.querySelector("#prev").classList.add("hidden");
    }
  }
  get genre() {
    return this.status["genre"];
  }
  get trailer() {
    return this.status["trailer"];
  }
  get page() {
    return this.status["page"];
  }
  get zoom() {
    return this.status["zoom"];
  }
  get period() {
    let period = this.status["period"];
    return (period == "") ? "":"&date="+period;
  }
  refresh() {
    if (([...this.parent.querySelectorAll("img")].length > 0)
      && (this.status.count > [...this.parent.querySelectorAll("img")].length)
      && this.ready && this.more) {
      console.log("refreshing...");
      this.show(this.status.count,this.status.start);
    }
  }
  async show(count,start) {
    this.ready = false;
    this.setStatus("count",count);
    this.setStatus("start",start); 
    let imdb = await fetch("./list?genre="+this.genre.join(",")+"&sort="+this.sorted+"&count="+this.status.count+this.period+"&start="+this.status.start);
    imdb = await imdb.json();
    [...this.parent.querySelectorAll("img")].map(e => {
      if (!imdb.some(movie => movie.cover === e.src)) {
        e.remove();
      }
    });
    imdb = imdb.filter(e => e.cover.indexOf("nopicture") < 0).map((e,i) => {
      let currentPoster = [...this.parent.querySelectorAll("img")].some(image => image.src == e.cover);
      if (!currentPoster) {
        let img = document.createElement("img");
        let promise_resolve;
        this.gridStatus[i] = new Promise((resolve,reject) => { promise_resolve = resolve; });
        img.setAttribute("alt",e.title);
        img.classList.add("loading");
        img.addEventListener("click",() => {
          this.trailer = i;
        });
        img.addEventListener("contextmenu",async (event) => {
          event.preventDefault();
          this.infobox.hide();
          await ((t) => { return new Promise((resolve,reject) => {
            setTimeout(resolve,t);
          })})(400);
          this.infobox.title = e.title;
          this.infobox.date = e.year;
          this.infobox.real = e.director;
          this.infobox.duration = e.duration;
          try {
            this.infobox.genres = e.genres.map(g => (genres.find(f => f.value == g.toLowerCase()).label || g)).join(" | ");
          } catch {
            this.infobox.genres = e.genres.join(" | ");
          }
          this.infobox.resume = e.abstract;
          this.infobox.show(img);
        });
        img.onload = () => {
          img.classList.remove("loading");
          promise_resolve();
        };
        img.src = e.cover;
        this.parent.append(img);
      }
      return e;
    });
    if (imdb.length >= count ) {
      this.more = true;
    } else {
      this.more = false;
    }
    Promise.all(this.gridStatus).then(e => {
      this.ready = true;
      this.refresh();
    });
    this.setStatus("currentGrid",imdb);
  }
  YTplayer(url) {
    [...this.parent.querySelectorAll("section")].map(e => e.remove());
    document.querySelector("#dice").classList.remove("hidden");
    let section = document.createElement("section");
    this.parent.append(section);
    let player = document.createElement("iframe");
    player.setAttribute("width",parseInt(section.getBoundingClientRect().width)-200);
    player.setAttribute("height",((parseInt(section.getBoundingClientRect().width)-200)/16)*9);
    player.setAttribute("frameborder",0);
    player.setAttribute("autoplay",true);
    player.setAttribute("src","https://www.youtube.com/embed/"+url+"?autoplay=1");
    section.append(player);  
    section.addEventListener("click", (e) => {
      [...this.parent.querySelectorAll("section")].map(e => e.remove());
      document.querySelector("#dice").classList.add("hidden");
      this.view = "grid";
    });
  }
  async playTrailer(id) {
    let trailer = await fetch("./trailer?title="+this.status.currentGrid[id].title);
    trailer = await trailer.json();
    trailer = trailer.trailer;
    this.YTplayer(trailer);
  }
};
