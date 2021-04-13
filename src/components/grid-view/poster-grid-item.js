import React from "react";
import { Link } from "react-router-dom";
import MoviePoster from "./movie-poster.js";

/* this component displays a clickable movie poster */

function PosterItem(props) {
  const { movie, vw } = props
  return (
      <Link to={ "/movie/" + movie.id } title={ "View details about this movie: " + movie.title }>
        <figure>
          <MoviePoster classes="border-0 object-cover h-full w-full" cover={ movie.cover } size="medium" vw={ vw } title={ movie.title } />
          <figcaption> { movie.title + ((movie.year !== "") ? " ("+ movie.year +")" :"") }</figcaption>
        </figure>
      </Link>
  )
}

export default PosterItem;
