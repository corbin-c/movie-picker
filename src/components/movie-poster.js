import React from "react";

/* this displays a movie poster with srcset if available */

function MoviePoster(props) {
  const { cover, title } = props;
  if (cover.small) {
    return (<img
      loading="lazy"
      srcSet={ [cover.small+" 80w", cover.medium+" 400w"].join(", ") }
      sizes={ "(max-width: 320px) 80px, 400px" }
      src={ cover.big }
      alt={ "Movie poster for '" + title + "'" } />)
  }
  return (<img
    loading="lazy"
    src={ cover.big }
    alt={ "Movie poster for '" + title + "'" } />
  )
}

export default MoviePoster;
