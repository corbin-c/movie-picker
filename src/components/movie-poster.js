import React, { useState, useEffect } from "react";

/* this displays a movie poster */

function MoviePoster(props) {
  const { cover, title, classes, size, vw, type } = props;
  const [blur,setBlur] = useState(" blur");
  const [ready,setReady] = useState(false);
  useEffect(() => {
    if (!cover) {
      return;
    }
    setReady(state => false);
    setBlur(state => " blur");
    if ((size !== "small") && (vw > 320) && (cover.small)) {
      let target = new Image();
      target.onload = () => {
        setReady(state => true);
        setBlur(blur => "");
      };
      target.src = cover[size];
    } else {
      setBlur(blur => "");
    }
  },[cover, size, vw]);
  if ((!cover) || (Object.keys(cover).length === 0)) {
    return null;
  }
  if (cover.small) {
    return (<img
      className={ (classes || "") + blur }
      src={ (ready) ? cover[size]:cover.small }
      loading="lazy"
      alt={ ((type) ? "Picture of ":"Movie poster for ") + title } />
    );
  }
  return (<img
    className={ (classes || "") }
    loading="lazy"
    src={ cover.big }
    alt={ ((type) ? "Picture of ":"Movie poster for ")+ title } />)
}

export default MoviePoster;
