const genres = [{"picture":"🚓","label":"Action","value":"action"},
  {"picture":"🗺️","label":"Aventure","value":"adventure"},
  {"picture":"🐭","label":"Animation","value":"animation"},
  {"picture":"📗","label":"Biographie","value":"biography"},
  {"picture":"🤣","label":"Comédie","value":"comedy"},
  {"picture":"🔪️","label":"Crime","value":"crime"},
  {"picture":"🎭","label":"Drame","value":"drama"},
  {"picture":"👪","label":"Famille","value":"family"},
  {"picture":"🦄","label":"Fantastique","value":"fantasy"},
  {"picture":"🕵️","label":"Film Noir","value":"film-noir"},
  {"picture":"📜","label":"Historique","value":"history"},
  {"picture":"🎃","label":"Horreur","value":"horror"},
  {"picture":"🎼","label":"Musique","value":"music"},
  {"picture":"🎤","label":"Comédie musicale","value":"musical"},
  {"picture":"❓","label":"Mystère","value":"mystery"},
  {"picture":"💞","label":"Romantique","value":"romance"},
  {"picture":"🛸","label":"Science-Fiction","value":"sci-fi"},
  {"picture":"🏀","label":"Sport","value":"sport"},
  {"picture":"😰","label":"Thriller","value":"thriller"},
  {"picture":"⚔️","label":"Guerre","value":"war"},
  {"picture":"🏜️","label":"Western","value":"western"}];

let displayGenres = (parent,callback) => {
  genres.map(genre => {
    let pictogram = document.createElement("p");
    pictogram.setAttribute("class","genres");
    pictogram.innerText = genre.picture;
    pictogram.addEventListener("click", (event) => {
      event.stopPropagation();
      callback(genre.value);
    });
    parent.append(pictogram)
  });
};
export { genres as list, displayGenres as show };
