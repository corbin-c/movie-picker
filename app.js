const express = require("express");
const IMDB = require("./imdb.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("dist"));

/*
 * Routes: (GET only)
 * search(query) //raw, no filter, movies + persons)
 * getRandomMovie()
 * getTrailer(title)
 * getPerson(name || id)
 * getMovie(title)
 * getMovieList(parameters)
 * enrichData(id)
 */

app.listen(port, () => {
  console.log("movie picker started on port "+port);
});
