import React from "react";
import { Link, useLocation } from "react-router-dom";
import MoviePoster from "../movie-poster.js";

/* this component displays a clickable movie poster */

function PosterItem(props) {
  const { movie, vw } = props;
  const location = useLocation();
  return (
      <Link to={ { pathname:"/movie/" + movie.id, state: { from: location.pathname } } } title={ "View details about this movie: " + movie.title }>
        <figure>
          <MoviePoster classes="border-0 object-cover h-full w-full" cover={ movie.cover } size="medium" vw={ vw } title={ movie.title } />
          <figcaption> { movie.title + ((movie.year !== "") ? " ("+ movie.year +")" :"") }</figcaption>
        </figure>
      </Link>
  )
}

export default PosterItem;
