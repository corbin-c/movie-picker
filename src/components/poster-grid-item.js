import React from "react";
import { Link } from "react-router-dom";
import MoviePoster from "./movie-poster.js";

/* this component displays a clickable movie poster */

function PosterItem(props) {
  const { movie } = props
  return (
      <Link key={ movie.id } to={ "/movie/" + movie.id } title={ "View details about this movie: " + movie.title }>
        <figure>
          <MoviePoster cover={ movie.cover } title={ movie.title } />
          <figcaption> { movie.title + ((movie.year !== "") ? " ("+ movie.year +")" :"") }</figcaption>
        </figure>
      </Link>
  )
}

export default PosterItem;
