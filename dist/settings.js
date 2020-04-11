export let settings = ((parent,methods) => {

/* Prepare elements & methods */

  let timeH = document.createElement("h2");
  let periodH = document.createElement("h2");
  let filtr = document.createElement("h2");
  let container = document.createElement("div");
  let home = document.createElement("p");
  let orderH = document.createElement("h2");
  let sort_key = document.createElement("select");
  let direction = document.createElement("select");
  let period = document.createElement("select");
  let createOpt = (select,key,value) => {
    let opt = document.createElement("option");
    opt.value = value;
    opt.innerText = key;
    select.append(opt);
  };
  let output = {
    element: document.createElement("menu")
  }
  let toggleGenre = (value) => {
    output.methods.toggleGenre(value);
    output.updateGenres();
  }
  output.methods = methods;
  output.toggle = function() { this.element.classList.toggle("hidden") };
  output.updateGenres = function() {
    let list = this.methods.getGenres();
    [...this.element.querySelectorAll("div p")].map(e => {
      let value = methods.getGenresList().find(g => g.picture == e.innerText).value;
      if (list.indexOf(value) >= 0) {
        e.classList.add("selected")
      } else {
        e.classList.remove("selected")
      }
    });
  };
  output.element.classList.add("hidden");

  periodH.innerText = "Période";
  filtr.innerText = "Ajouter un genre :"
  timeH.innerText = "Période";
  orderH.innerText = "Tri";
  home.innerText = "🏠";
  home.setAttribute("id","home");

/* Populate selectors */

  [ {key:"Box Office US",value:"boxoffice_gross_us"},
    {key:"Alphabétique",value:"alpha"},
    {key:"Nombre d'avis",value:"num_votes"},
    {key:"Durée",value:"runtime"},
    {key:"Année",value:"year"}  ].map(e => {
    createOpt(sort_key,e.key,e.value);
  });
  [ {key:"décroissant",value:"desc"},
    {key:"croissant",value:"asc"}  ].map(e => {
    createOpt(direction,e.key,e.value);
  });
  ["indifférent",...(new Array(8)).fill(1940)].map((e,i) => {
    if (isNaN(e)) {
      createOpt(period,e,"");
    } else {
      e = (e+i*10);
      createOpt(period,"Années "+e,e+","+(9+e));
    }
  });

/* Set up events */

  methods.showGenresList(container,toggleGenre);
  output.updateGenres();
  period.addEventListener("change",(event) => {
    methods.updatePeriod(period.value);
  });
  sort_key.addEventListener("change",(event) => {
    methods.sort(sort_key.value,direction.value);
  });
  direction.addEventListener("change",(event) => {
    methods.sort(sort_key.value,direction.value);
  });
  output.element.addEventListener("click", function(event) {
    if (["select","option"].indexOf(event.target.nodeName.toLowerCase()) < 0) {
      output.toggle();
    }
  });
  home.addEventListener("click",() => { document.location.href = document.location.href });

/* Add elements */

  parent.append(output.element);
  output.element.append(filtr);
  output.element.append(container);
  output.element.append(orderH);
  output.element.append(sort_key);
  output.element.append(direction);
  output.element.append(periodH);
  output.element.append(period);  
  output.element.append(home);
  
  return output;
});
