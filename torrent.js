const torrentStream = require("torrent-stream");
const fetch = require("node-fetch");
const ROOT = "https://torrent-paradise.ml/api/search?q=";

module.exports = {
  search: async (query) => {
    let results = await fetch(ROOT+query);
    results = await results.json();
    results = results.sort((a,b) => b.s-a.s)[0];
    return results;
  },
  stream(magnet) {
    let torrent = torrentStream(magnet);
    return new Promise((resolve,reject) => {
      torrent.on("ready", () => {
        resolve(torrent);
      });
    });
  }
};
