export let infobox = ((parent,genres) => {
  const elements = {
    date:"time",
    title:"h1",
    real:"h2",
    duration:"h4",
    genres:"h3",
    resume:"p"
  }
  let output = {
    element: document.createElement("article")
  }
  output.show = function(target) {
    target = target.getBoundingClientRect();
    target.x = target.left+target.width/2;
    target.y = target.top+target.height/2;
    let str = "";
    let position = 0; 
    /*
    *       0-------1
    *       |       |
    *       |       |
    *       3-------2
    */
    if (target.x > window.outerWidth-380) { //1 ou 2
      str += "right: "+(window.innerWidth-target.x+target.width/4)+"px; ";
      position++;
    } else { //0 ou 3
      str += "left: "+(target.x+target.width/4)+"px; ";
    }
    if (target.y > window.outerHeight-380) { //2 ou 3
      str += "bottom: "+(window.innerHeight-target.y+target.height/3)+"px; ";
      position += (position == 1) ? 1:3;
    } else { //0 ou 1
      str += "top: "+(target.y+target.height/3)+"px; ";
    }
    let border = ((radius,corner) => {
      let corners = [...new Array(4).fill(radius)].map((e,i) => {
        if (i == corner) {
          e = 0;
        }
        return e;
      });
      return "border-radius: "+corners.join("px ")+"px;";
    })(20,position);
    this.element.setAttribute("style",str+border);
    this.element.classList.remove("hidden");
  };
  output.hide = function() { 
    this.element.classList.add("hidden");
  };
  Object.keys(elements).map(e => {
    Object.defineProperty(output,e,{ set: function(value) {
      this.element.querySelector(elements[e]).innerText = value;
    }});
    output.element.append(document.createElement(elements[e]));
  });
  output.hide();
  output.element.addEventListener("click",() => { output.hide(); });
  parent.append(output.element);
  return output;
});
