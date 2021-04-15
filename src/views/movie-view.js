import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MoviePoster from "../components/movie-poster.js";
import TrailerOverlay from "../components/item-view/trailer.js";
import EnrichedLinks from "../components/item-view/enriched-links.js";
import CommercialLinks from "../components/item-view/commercial-links.js";
import BackButton from "../components/item-view/back-button.js";
import MovieDetails from "../components/item-view/movie-details/movie-details.js";
import IncompletePersons from "../components/item-view/movie-details/incomplete-persons.js";

import "./item-view.css";

function MovieView() {
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const moviesArray = useSelector(state => state.movies.results);
  const movieSelector = useSelector(state => state.movies.results.find(e => e.id === id));
  const queryBody = useSelector(state => state.movies.body);
  const [context, setContext] = useState(true);
  const [trailer, setTrailer] = useState(false);
  const [trailerState, setTrailerState] = useState("unset");
  const [enrichedState, setEnrichedState] = useState("unset");
  const [nextPageLoading, setnextPageLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [movieIndex, setMovieIndex] = useState(0);
  const section = useRef(null);

  const handleKeys = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        previousMovie();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextMovie();
        break;
      case " ":
        e.preventDefault();
        setTrailer(state => true);
        break;
      default:
        return null;
    }
  }

  const fetchMovies = async (body) => {
    let results = await fetch("/imdb/movies", {
      method: "POST",
      body: JSON.stringify(body)
    });
    results = await results.json();
    return results;
  }

  const nextPage = async () => {
    if (!context) {
      return null;
    }
    if (nextPageLoading) {
      return null;
    }
    let start = moviesArray.length+1;
    if (queryBody.start === start) {
      return null;
    }
    queryBody.start = start;
    setnextPageLoading(state => true);
    let nextMovies = await fetchMovies(queryBody);
    dispatch({ type: "movies/setBody", payload: queryBody });
    dispatch({ type: "movies/nextPage", payload: nextMovies });
    setnextPageLoading(state => false);
    if (nextMovies.length > 0) {
      return nextMovies[0].id;
    }
    return false;
  }

  const previousMovie = (e) => {
    if (!context) {
      return null;
    }
    if (e) {
      e.preventDefault();
    }
    let target = moviesArray[movieIndex-1];
    if (typeof target === "undefined") {
      target = moviesArray[moviesArray.length-1];
    }
    history.replace("/grid/");
    history.push("/movie/"+target.id);
  }
  
  const nextMovie = async (e) => {
    if (e) {
      e.preventDefault();
    }
    let targetId = moviesArray[movieIndex+1];
    if (typeof targetId === "undefined") {
      targetId = await nextPage();
      if (targetId === false) {
        targetId = 0;
      } else if (targetId === null) {
        return;
      }
    } else {
      targetId = targetId.id;
    }
    history.replace("/grid/");
    history.push("/movie/"+targetId);
  }

  useEffect(() => { //gives focus to enable keyboard navigation whenever component is updated
    if (!trailer) {
      section.current.focus();
    }
  });

  useEffect(() => {
    if (movie.enriched || enrichedState !== "unset" || typeof movie.title === "undefined") {
      return null;
    }
    (async () => {
      setEnrichedState(state => "loading");
      let enrichedData = await fetch("/imdb/enrich/"+movie.id);
      enrichedData = await enrichedData.json();
      if (!enrichedData.error) {
        movie.enriched = enrichedData;
        if (!movie.incomplete) {
          dispatch( {
            type: "movies/update",
            payload: { 
              id: movie.id,
              property: "enriched",
              value: enrichedData
            }
          });
        }
        setEnrichedState(state => "ready");
        setMovie(state => ({...movie}));
      } else {
        setEnrichedState(state => "error");
      }
    })();
  },[movie,dispatch,enrichedState]);

  useEffect(() => {
    if (movie.trailer || trailerState !== "unset" || typeof movie.title === "undefined") {
      return null;
    }
    (async () => {
      setTrailerState(state => "loading");
      let trailer = await fetch("/imdb/trailer/"+movie.title+"/"+movie.year+"/"+movie.id);
      trailer = await trailer.json();
      if (!trailer.error) {
        movie.trailer = trailer;
        if (!movie.incomplete) {
          dispatch( {
            type: "movies/update",
            payload: { 
              id: movie.id,
              property: "trailer",
              value: trailer
            }
          });
        }
        setTrailerState(state => "ready");
        setMovie(state => ({...movie}));
      } else {
        setTrailerState(state => "error");
      }
    })();
  },[movie,dispatch,trailerState]);

  useEffect(() => { //updates doc title
    if ((document.title !== "Movie Picker | "+movie.title) && (typeof movie.title !== "undefined")) {
      document.title = "Movie Picker | "+movie.title;
    }
  },[movie]);

  useEffect(() => { //initializes component with movie data
    if (id === "random") {
      if (typeof movie.id === "undefined") {
        (async () => {
          let movie = await fetch("/imdb/randomMovie");
          movie = await movie.json();
          setMovie(state => movie[0]);
          setContext(state => false);
        })();
      }
    } else {
      if (typeof movieSelector === "undefined") {
        (async () => {
          let fetchedMovie = await fetch("/imdb/movie/id/"+id);
          fetchedMovie = await fetchedMovie.json();
          if (fetchedMovie.error) {
            //REDIRECT TO 404
            history.push("/404");
          }
          fetchedMovie.incomplete = true;
          setMovie(state => fetchedMovie);
        })();
      } else {
        setMovie(state => ({...movieSelector}));
        setMovieIndex(state => (moviesArray.findIndex(e => e.id === id)));
      }
    }
  },[id,movieSelector,moviesArray,history]);

  useEffect(() => { //restore error status when id changes
    setEnrichedState(state => "unset");
    setTrailerState(state => "unset");
    window.scrollTo(0, 0);
  },[id]);

  return (
    (Object.keys(movie).length === 0)
      ? <section ref={ section } >
          <BackButton title="Go back to grid view" />
        </section>
      : <section onKeyDown={ handleKeys } ref={ section } tabIndex="1" className="item-view">
        <BackButton title="Go back to grid view" href={ movie.incomplete } />
        <header>
          <h1>{ movie.title }</h1>
          <h2>{ movie.year }</h2>
        </header>
        <article>
          <figure>
            <MoviePoster
              classes="mx-auto"
              vw={ Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) }
              size="big"
              cover={ movie.cover }
              title={ movie.title } />
          </figure>
          <p>{ (!movie.incomplete) && movie.abstract }</p>
          {(!movie.incomplete)
            ? <MovieDetails
                rating={ movie.rating }
                duration={ movie.duration }
                genres={ movie.genres }
                persons={ movie.roles }
              />
            : <IncompletePersons persons={ movie.roles } />
          }
          <section className="links">
            { (movie.trailer) && 
              <div className="w-full flex-grow flex justify-around mb-1">
                <button title="Play trailer" onClick={ () => setTrailer(state => true) } className="w-2/3 inline-flex justify-center">
                  <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M1.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75zM0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75z"></path><path d="M9 15.584V8.416a.5.5 0 01.77-.42l5.576 3.583a.5.5 0 010 .842L9.77 16.005a.5.5 0 01-.77-.42z"></path></svg>
                  Play trailer
                </button>
              </div>
            }
            <EnrichedLinks enrichedData={movie.enriched} title={ movie.title } />
            <CommercialLinks title={ movie.title } />
          </section>
        </article>
        {(!movie.incomplete && context) &&
        <a title="View previous movie" onClick={ previousMovie } className="btn-icon fixed bottom-2 right-15" href={ "/movie/"+movieIndex }>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M10.78 19.03a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 111.06 1.06L5.81 11.5h14.44a.75.75 0 010 1.5H5.81l4.97 4.97a.75.75 0 010 1.06z"></path></svg>
        </a>}
        {(!movie.incomplete && context) &&
        <a title="View next movie" onClick={ nextMovie } className="btn-icon fixed bottom-2 right-2" href={ "/movie/"+movieIndex }>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M13.22 19.03a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 10-1.06 1.06l4.97 4.97H3.75a.75.75 0 000 1.5h14.44l-4.97 4.97a.75.75 0 000 1.06z"></path></svg>
        </a>}
        <TrailerOverlay
          classes={ (trailer) ? "":"hidden " }
          trailer={ movie.trailer }
          title={ movie.title }
          handleChange={ () => setTrailer(state => false) }
        />
      </section>
  )
}

export default MovieView
