const express = require("express");
const IMDB = require("./imdb.js");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const dist = path.join(__dirname, "build");

app.use(express.static(dist));
app.use(express.json({ type : "*/*" }));

app.get("/imdb/awards", (req, res, next) => {
  try {
    res.json(IMDB.AWARDS);
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/genres", (req, res, next) => {
  try {
    res.json(IMDB.GENRES);
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/search/:queryString/:type?", async (req, res, next) => {
  try {
    res.json(await IMDB.suggestions(req.params.queryString, req.params.type));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/randomMovie", async (req, res, next) => {
  let sort = IMDB.SORT_KEYS[Math.floor(Math.random()*IMDB.SORT_KEYS.length)];
  try {
    res.json(await IMDB.getMovies({
      sort: sort+",desc",
      count: 1,
      start: Math.floor(Math.random()*10000)
    }));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/person/:queryString", async (req, res, next) => {
  try {
    res.json(await IMDB.getPerson(req.params.queryString));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/enrich/:type/:id/:name", async (req, res, next) => {
  try {
    res.json(await IMDB.wikiDataSPARQL(req.params.id,req.params.name,req.params.type));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/movie/title/:title", async (req, res, next) => {
  try {
    res.json(await IMDB.getMovies({
      "title": req.params.title
    }));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/movie/id/:id", async (req, res, next) => {
  try {
    res.json(await IMDB.getMovieById(req.params.id));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("/imdb/trailer/:title/:year/:id", async (req, res, next) => {
  try {
    res.json(await IMDB.getTrailer(req.params.title,req.params.year,req.params.id));
  } catch(e) {
    next(new Error(e));
  }
});

app.post("/imdb/movies/", async (req, res, next) => {
  try {
    res.json(await IMDB.getMovies(req.body));
  } catch(e) {
    next(new Error(e));
  }
});

app.get("*", function (req, res, next) {
  res.sendFile(path.join(dist, "index.html"));
});

app.use(function(err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500;
  return res
    .status(err.statusCode)
    .json({ error: err.toString() });
});

app.listen(port, () => {
  console.log("movie picker started on port "+port);
});
