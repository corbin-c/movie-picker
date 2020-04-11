const fs = require("fs");
const YouTube = require("youtube-node");
const youTube = new YouTube();
const IMDB = require("./imdb.js");
const minimalServer = require("@corbin-c/minimal-server");

youTube.setKey(fs.readFileSync("youtube-api-key","utf8").split("\n")[0]);

const servedFiles = [
  {pathname:"/",mime:"text/html"},
  {pathname:"/index.html",mime:"text/html; charset=utf-8"},
  {pathname:"/genres.js",mime:"application/javascript"},
  {pathname:"/infobox.js",mime:"application/javascript"},
  {pathname:"/settings.js",mime:"application/javascript"},
  {pathname:"/gallery.js",mime:"application/javascript"},
  {pathname:"/style.css",mime:"text/css"}
];

let youtubeSearch = async (searchString) => {
  return new Promise((resolve,reject) => {
    youTube.search(searchString+" trailer", 15, (error, result) => {
      if (error) {
        console.error("youtube",error);
      } else {
        resolve(result.items.filter(e => typeof e.id !== "undefined")[0].id.videoId);
      }
    })
  });
};

let getRandomMovie = async () => {
  let query = [
    ["sort","user_rating,desc"],
    ["count","1"],
    ["start",Math.floor(Math.random()*10000)]
  ];
  movie = await IMDB.getIMDB(IMDB.buildQuery(query));
  movie = movie[0];
  movie.trailer = await youtubeSearch(movie.title+" trailer");
  return movie;
}

let isSomething = (array) => {
  return ((filename) => {
    filename = filename.split(".");
    if (filename[0].toLowerCase() == "sample") { return false; }
    filename = filename[filename.length-1];
    return array.some(e => e==filename);
  })
}

let videoServer = {
}
videoServer.isReady = (new Promise((resolve,reject) => { videoServer.makeReady = resolve; }));
let server = new minimalServer();
server.enableStaticDir(true);
server.route = {
  path:"/video",
  handler: async (req,res) => {
    let movie;
    if (videoServer[page.searchParams.get("title")]) {
      await videoServer.isReady;
      movie = videoServer[page.searchParams.get("title")];
    } else {
      videoServer[page.searchParams.get("title")] = {};
      movie = await torrents.search(page.searchParams.get("title"));
      movie.torrent = await torrents.stream(movie.magnet);
      videoServer[page.searchParams.get("title")] = movie;
      videoServer.makeReady();
    }
    let file = movie.torrent.files.find(e => isSomething(["avi","mkv","mp4"])(e.name))
    let fileSize = file.length;
    let range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      }
      res.writeHead(206, head);
      file.createReadStream({start: start,	end: end}).pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      }
      res.writeHead(200, head);
      file.createReadStream().pipe(res);
    }
  }
};
server.route = {
  path:"/sub",
  handler: async (req,res) => { 
    await videoServer.isReady;
    if (videoServer[page.searchParams.get("title")]) {
      let movie = await videoServer[page.searchParams.get("title")];
      let file = movie.torrent.files.find(e => isSomething(["srt","sub"])(e.name));
      res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"})
      file.createReadStream().pipe(res)
    } else {
      res.end();
    }  
  }
};
server.route = {
  path:"/list",
  handler: async (req,res) => {
    server.json(await IMDB.getIMDB(IMDB.buildQuery(page.searchParams)))(req,res);
  }
};
server.route = {
  path:"/explain",
  handler:server.json({
        usage: {
          explain: "access /explain to get this help",
          getList_API: "access /list with the following parameters to get a list of movies: "+Object.keys(IMDB.URL).slice(1).join(", ")
        },
        restrictedValues: {
          sortkeys: IMDB.SORT_KEYS,
          genres:   IMDB.GENRES,
          awards:   IMDB.AWARDS
        }
    })
  }
server.route = {
  path:"/random",
  handler: async (req,res) => {
    server.json(await getRandomMovie())(req,res);
  }}
server.route = {
  path:"/trailer",
  handler: async (req,res) => {
    server.json({trailer:await youtubeSearch(page.searchParams.get("title"))})(req,res);
  }}
server.start();
