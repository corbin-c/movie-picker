import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

function Error404() {
  const dispatch = useDispatch();
  const history = useHistory();
  const section = useRef(null);
  const [covers, setCovers] = useState([]);
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  const showCovers = () => {
    try {
      const height = section.current.getBoundingClientRect().height;
      let l = -100;
      let t = -160;
      let posters = [];
      for (let e of covers) {
        const left = l+Math.random()*150;
        const top = t+Math.random()*220;
        posters.push({
          id: e.id,
          cover: e.cover.medium,
          title: e.title,
          style: {
            position: "absolute",
            left: left+"px",
            top: top+"px",
            "--angle": Math.round(Math.random()*90)-45+"deg"
          }
        });
        l += 133
        if (l > vw) {
          t += 213;
          l = -100;
        }
        if (t > height) {
          t = -160;
        }
      }
      return posters.map(e => {
        return (<Link style={e.style} to={{pathname:"/movie/"+e.id, state:{from:"/"}}} title={ e.title }><img src={e.cover} alt={ "poster for the movie '"+ e.title +"'" } /></Link>);
      });
    } catch {
      return null;
    }
  }
  
  useEffect(() => {
    (async () => {
      const body = {
        count:75,
        start:Math.round(Math.random()*820),
        award:"oscar_winner"
      }
      let results = await fetch("/imdb/movies", {
        method: "POST",
        body: JSON.stringify(body)
      });
      results = await results.json();
      console.log(results);
      dispatch({ type: "movies/nextPage", payload: results });
      setCovers(state => results);
    })();
  },[]);
  
  const reset = (e) => {
    e.preventDefault();
    dispatch({type:"", reset: true});
    history.push("/grid/");
  }
  
  return (<section ref={ section } className="err-404">
  <h1>404</h1>
  <div id="covers">{ showCovers() }</div>
  </section>);
}

export default Error404;
