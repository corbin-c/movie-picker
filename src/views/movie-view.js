import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import TrailerOverlay from "../components/trailer.js";
import EnrichedLinks from "../components/enriched-links.js";
import DispatchLink from "../components/dispatch-link.js";
import MoviePoster from "../components/movie-poster.js";
import BackButton from "../components/back-button.js";

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
  const [loading, setLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const [enrichedError, setEnrichedError] = useState(false);
  const [nextPageLoading, setnextPageLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [movieIndex, setMovieIndex] = useState(0);
  const section = useRef(null);

  const handleKeys = (e) => {
    e.preventDefault();
    switch (e.key) {
      case "ArrowLeft":
        previousMovie();
        break;
      case "ArrowRight":
        nextMovie();
        break;
      case " ":
        setTrailer(state => true);
        break;
      default:
        return null;
    }
  }

  const fetchMovies = async (body) => {
    let results = await fetch("http://localhost:8080/imdb/movies", {
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
    history.replace("/");
    history.push("/movie/"+moviesArray[movieIndex-1].id);
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
    history.replace("/");
    history.push("/movie/"+targetId);
  }
  useEffect(() => {
    if (!trailer) {
      section.current.focus();
    }
  });
  useEffect(() => {
    if ((document.title !== "Movie Picker | "+movie.title) && (typeof movie.title !== "undefined")) {
      document.title = "Movie Picker | "+movie.title;
    }
    if (!loading) {
      if ((!movie.enriched) && (!enrichedError) && (movie.id)) {
        (async () => {
          setLoading(state => true);
          let enrichedData = await fetch("http://localhost:8080/imdb/enrich/"+movie.id);
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
            setMovie(state => ({...movie}));
          } else {
            setEnrichedError(state => true);
          }
          setLoading(state => false);
        })();
      }
      if ((!movie.trailer) && (!trailerError) && (movie.title)) {
        (async () => {
          setLoading(state => true);
          let trailer = await fetch("http://localhost:8080/imdb/trailer/"+movie.title+"/"+movie.year+"/"+movie.id);
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
            setMovie(state => ({...movie}));
          } else {
            setTrailerError(state => true);
          }
          setLoading(state => false);
        })();
      }
    }
  },[movie,dispatch,enrichedError,trailerError,loading]);
  useEffect(() => {
    if (id === "random") {
      (async () => {
        let movie = await fetch("http://localhost:8080/imdb/randomMovie");
        movie = await movie.json();
        setMovie(state => movie[0]);
        setContext(state => false);
      })();
    } else {
      if (typeof movieSelector === "undefined") {
        (async () => {
          let fetchedMovie = await fetch("http://localhost:8080/imdb/movie/id/"+id);
          fetchedMovie = await fetchedMovie.json();
          if (fetchedMovie.error) {
            //REDIRECT TO 404
          }
          fetchedMovie.incomplete = true;
          setMovie(state => fetchedMovie);
        })();
      } else {
        setMovie(state => ({...movieSelector}));
        setMovieIndex(state => (moviesArray.findIndex(e => e.id === id)));
      }
    }
  },[id,movieSelector,moviesArray]);
  useEffect(() => {
    setEnrichedError(state => false);
    setTrailerError(state => false);
  },[id]);
  return (
    (Object.keys(movie).length === 0)
      ? <section ref={ section } >
          <BackButton title="Go back to grid view" href={ true } />
        </section>
      : <section onKeyDown={ handleKeys } ref={ section } tabIndex="1" className="item-view">
        <BackButton title="Go back to grid view" />
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
            ? <ul className="details-list">
              <li className="col-start-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fillRule="evenodd" d="M4.75 2a.75.75 0 000 1.5h.75v2.982a4.75 4.75 0 002.215 4.017l2.044 1.29a.25.25 0 010 .422l-2.044 1.29A4.75 4.75 0 005.5 17.518V20.5h-.75a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5h-.75v-2.982a4.75 4.75 0 00-2.215-4.017l-2.044-1.29a.25.25 0 010-.422l2.044-1.29A4.75 4.75 0 0018.5 6.482V3.5h.75a.75.75 0 000-1.5H4.75zM17 3.5H7v2.982A3.25 3.25 0 008.516 9.23l2.044 1.29a1.75 1.75 0 010 2.96l-2.044 1.29A3.25 3.25 0 007 17.518V20.5h10v-2.982a3.25 3.25 0 00-1.516-2.748l-2.044-1.29a1.75 1.75 0 010-2.96l2.044-1.29A3.25 3.25 0 0017 6.482V3.5z"></path>
                </svg>
                { movie.duration }
              </li>
              <li className="col-start-2">
                <svg className="rating-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <mask id="rating">
                    <rect x="0" y="0" fill="white" stroke="none" height="24" width={ 24*movie.rating/10 }></rect>
                  </mask>
                  <path  mask="url(#rating)" fillRule="evenodd" d="M12.672.668a.75.75 0 00-1.345 0L8.27 6.865l-6.838.994a.75.75 0 00-.416 1.279l4.948 4.823-1.168 6.811a.75.75 0 001.088.791L12 18.347l6.117 3.216a.75.75 0 001.088-.79l-1.168-6.812 4.948-4.823a.75.75 0 00-.416-1.28l-6.838-.993L12.672.668z"></path>
                  <path fillRule="evenodd" d="M12 .25a.75.75 0 01.673.418l3.058 6.197 6.839.994a.75.75 0 01.415 1.279l-4.948 4.823 1.168 6.811a.75.75 0 01-1.088.791L12 18.347l-6.117 3.216a.75.75 0 01-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 01.416-1.28l6.838-.993L11.328.668A.75.75 0 0112 .25zm0 2.445L9.44 7.882a.75.75 0 01-.565.41l-5.725.832 4.143 4.038a.75.75 0 01.215.664l-.978 5.702 5.121-2.692a.75.75 0 01.698 0l5.12 2.692-.977-5.702a.75.75 0 01.215-.664l4.143-4.038-5.725-.831a.75.75 0 01-.565-.41L12 2.694z"></path>
                </svg>
                { movie.rating }
              </li>
              <li className="col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"></path>
                  <path fillRule="evenodd" d="M2.5 1A1.5 1.5 0 001 2.5v8.44c0 .397.158.779.44 1.06l10.25 10.25a1.5 1.5 0 002.12 0l8.44-8.44a1.5 1.5 0 000-2.12L12 1.44A1.5 1.5 0 0010.94 1H2.5zm0 1.5h8.44l10.25 10.25-8.44 8.44L2.5 10.94V2.5z"></path>
                </svg>
                <ul>
                  { movie.genres.map(e => (
                    <li>
                      <DispatchLink
                        href="/"
                        title={ "Browse movies with the genre "+e }
                        action={ { type: "filters/genres/add", payload: e.toLowerCase(), reset: true } }>
                        {e}
                      </DispatchLink>
                    </li>
                  )) }
                </ul>
              </li>
              <li className="col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fillRule="evenodd" d="M24 5.25a.75.75 0 00-1.136-.643L16.5 8.425V6.25a1.75 1.75 0 00-1.75-1.75h-13A1.75 1.75 0 000 6.25v11C0 18.216.784 19 1.75 19h13a1.75 1.75 0 001.75-1.75v-2.175l6.364 3.818A.75.75 0 0024 18.25v-13zm-7.5 8.075l6 3.6V6.575l-6 3.6v3.15zM15 9.75v-3.5a.25.25 0 00-.25-.25h-13a.25.25 0 00-.25.25v11c0 .138.112.25.25.25h13a.25.25 0 00.25-.25v-7.5z"></path>
                </svg>
                <ul>
                  { movie.roles.filter(e => e.role === "director").map(e => (
                    <li>
                      <Link
                        to={ "/person/"+e.id }
                        title={ "View more about this director: "+e.name }>
                        {e.name}
                      </Link>
                    </li>
                  )) }
                </ul>
              </li>
              <li className="col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fillRule="evenodd" d="M3.5 8a5.5 5.5 0 118.596 4.547 9.005 9.005 0 015.9 8.18.75.75 0 01-1.5.045 7.5 7.5 0 00-14.993 0 .75.75 0 01-1.499-.044 9.005 9.005 0 015.9-8.181A5.494 5.494 0 013.5 8zM9 4a4 4 0 100 8 4 4 0 000-8z"></path>
                  <path d="M17.29 8c-.148 0-.292.01-.434.03a.75.75 0 11-.212-1.484 4.53 4.53 0 013.38 8.097 6.69 6.69 0 013.956 6.107.75.75 0 01-1.5 0 5.193 5.193 0 00-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0017.29 8z"></path>
                </svg>
                <ul>
                  { movie.roles.filter(e => e.role === "star").map(e => (
                    <li>
                      <Link
                        to={ "/person/"+e.id }
                        title={ "View more about this actor: "+e.name }>
                        {e.name}
                      </Link>
                    </li>
                  )) }
                </ul>
              </li>
            </ul>
            : <ul></ul>
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
            <a href={"https://www.amazon.com/s/ref=nb_ss_d?url=search-alias%3Ddvd&field-keywords="+movie.title} target="_blank" rel="noopener noreferrer" title={"Search for "+ movie.title +" on Amazon"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1100 1000">
                <path fill="#f79400" d="M2 776c3.333-5.333 8.666-5.667 16-1 166.666 96.667 348 145 544 145 130.666 0 259.666-24.333 387-73 3.333-1.333 8.166-3.333 14.5-6 6.333-2.667 10.833-4.667 13.5-6 10-4 17.833-2 23.5 6 5.666 8 3.833 15.333-5.5 22-12 8.667-27.334 18.667-46 30-57.334 34-121.334 60.333-192 79-70.667 18.667-139.667 28-207 28-104 0-202.334-18.167-295-54.5C162.333 909.167 79.333 858 6 792c-4-3.333-6-6.667-6-10 0-2 .666-4 2-6zm301-285c0-46 11.333-85.333 34-118 22.666-32.667 53.666-57.333 93-74 36-15.333 80.333-26.333 133-33 18-2 47.333-4.667 88-8v-17c0-42.667-4.667-71.333-14-86-14-20-36-30-66-30h-8c-22 2-41 9-57 21s-26.334 28.667-31 50c-2.667 13.333-9.334 21-20 23l-115-14c-11.334-2.667-17-8.667-17-18 0-2 .333-4.333 1-7 11.333-59.333 39.166-103.333 83.5-132C451.833 19.333 503.666 3.333 563 0h25c76 0 135.333 19.667 178 59a190.52 190.52 0 0 1 18.5 21.5c5.666 7.667 10.166 14.5 13.5 20.5 3.333 6 6.333 14.667 9 26 2.666 11.333 4.666 19.167 6 23.5 1.333 4.333 2.333 13.667 3 28 .666 14.333 1 22.833 1 25.5v242c0 17.333 2.5 33.167 7.5 47.5s9.833 24.667 14.5 31c4.666 6.333 12.333 16.5 23 30.5 4 6 6 11.333 6 16 0 5.333-2.667 10-8 14-55.334 48-85.334 74-90 78-8 6-17.667 6.667-29 2-9.334-8-17.5-15.667-24.5-23s-12-12.667-15-16-7.834-9.833-14.5-19.5c-6.667-9.667-11.334-16.167-14-19.5-37.334 40.667-74 66-110 76-22.667 6.667-50.667 10-84 10-51.334 0-93.5-15.833-126.5-47.5S303 549 303 491zm172-20c0 26 6.5 46.833 19.5 62.5S525 557 547 557c2 0 4.833-.333 8.5-1 3.666-.667 6.166-1 7.5-1 28-7.333 49.666-25.333 65-54 7.333-12.667 12.833-26.5 16.5-41.5 3.666-15 5.666-27.167 6-36.5.333-9.333.5-24.667.5-46v-25c-38.667 0-68 2.667-88 8-58.667 16.667-88 53.667-88 111zm420 322c1.333-2.667 3.333-5.333 6-8 16.666-11.333 32.666-19 48-23 25.333-6.667 50-10.333 74-11 6.666-.667 13-.333 19 1 30 2.667 48 7.667 54 15 2.666 4 4 10 4 18v7c0 23.333-6.334 50.833-19 82.5-12.667 31.667-30.334 57.167-53 76.5-3.334 2.667-6.334 4-9 4-1.334 0-2.667-.333-4-1-4-2-5-5.667-3-11 24.666-58 37-98.333 37-121 0-7.333-1.334-12.667-4-16-6.667-8-25.334-12-56-12-11.334 0-24.667.667-40 2-16.667 2-32 4-46 6-4 0-6.667-.667-8-2-1.334-1.333-1.667-2.667-1-4 0-.667.333-1.667 1-3z"/>
              </svg>
              Amazon
            </a>
            <a href={"https://www.netflix.com/Search?lnkctr=srchrd-ips&v1="+movie.title} target="_blank" rel="noopener noreferrer" title={"Search for "+ movie.title +" on Netflix"}>
              <svg width="20" height="20" viewBox="66.827 90.186 451.865 819.903" xmlns="http://www.w3.org/2000/svg">
                <g clipRule="evenodd" fillRule="evenodd">
                  <path d="m66.827 90.294v409.464c0 225.219.214 409.683.539 410.007.324.324 14.239-1.076 31.067-2.912 16.828-1.833 40.019-4.203 51.562-5.175 17.69-1.509 70.762-4.85 76.804-4.958 1.833 0 1.94-9.163 2.157-173.468l.322-173.062-.106-.299v.216z" fill="#b1060f"/><path d="m66.827 90.294 162.265 553.358.184-93.461-.106-.298v.215z" fill="#9d030f"/><path d="m357.535 90.834-.324 181.122-.323 181.016 160.94 456.686c-.092.092-.518.139-1.213.148.804 0 1.302-.047 1.429-.148.54-.433.648-184.789.54-409.792l-.324-409.032z" fill="#b1060f"/><path d="m356.888 452.972 154.06 437.165-153.889-528.716z" fill="#9d030f"/><path d="m66.827 90.294 162.343 459.814v-.216l12.837 36.226c71.302 201.714 109.595 309.955 109.811 310.171.108.107 10.896.756 23.946 1.4 39.481 1.94 88.452 6.146 125.669 10.78 8.521 1.08 15.964 1.62 16.396 1.188l-160.94-456.688v.108l-14.889-42.044c-14.563-41.077-24.27-68.569-82.843-233.951-15.748-44.526-29.125-82.152-29.663-83.877l-1.08-3.019h-80.794z" fill="#e50914"/>
                </g>
              </svg>
              Netflix
            </a>
            <a href={"https://play.google.com/store/search?c=movies&q="+movie.title} target="_blank" rel="noopener noreferrer" title={"Search for "+ movie.title +" on Google Play"}>
            <svg height="20" viewBox="0 -0.5 408 467.80000000000007" width="20" xmlns="http://www.w3.org/2000/svg">
              <linearGradient id="a" gradientUnits="userSpaceOnUse" x2="261.746" y1="112.094" y2="112.094">
                <stop offset="0" stopColor="#63be6b"/>
                <stop offset=".506" stopColor="#5bbc6a"/>
                <stop offset="1" stopColor="#4ab96a"/>
              </linearGradient>
              <linearGradient id="b" gradientUnits="userSpaceOnUse" x1=".152" x2="179.896" y1="223.393" y2="223.393">
                <stop offset="0" stopColor="#3ec6f2"/>
                <stop offset="1" stopColor="#45afe3"/>
              </linearGradient>
              <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="179.896" x2="407.976" y1="229.464" y2="229.464">
                <stop offset="0" stopColor="#faa51a"/>
                <stop offset=".387" stopColor="#fab716"/>
                <stop offset=".741" stopColor="#fac412"/>
                <stop offset="1" stopColor="#fac80f"/>
              </linearGradient>
              <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="1.744" x2="272.296" y1="345.521" y2="345.521">
                <stop offset="0" stopColor="#ec3b50"/>
                <stop offset="1" stopColor="#e7515b"/>
              </linearGradient>
              <path d="M261.7 142.3L15 1.3C11.9-.5 8-.4 5 1.4c-3.1 1.8-5 5-5 8.6 0 0 .1 13 .2 34.4l179.7 179.7z" fill="url(#a)"/>
              <path d="M.2 44.4C.5 121.6 1.4 309 1.8 402.3L180 224.1z" fill="url(#b)"/>
              <path d="M402.9 223l-141.2-80.7-81.9 81.8 92.4 92.4L403 240.3c3.1-1.8 5-5.1 5-8.6 0-3.6-2-6.9-5.1-8.7z" fill="url(#c)"/>
              <path d="M1.7 402.3c.2 33.3.3 54.6.3 54.6 0 3.6 1.9 6.9 5 8.6 3.1 1.8 6.9 1.8 10 0l255.3-148.9-92.4-92.4z" fill="url(#d)"/>
            </svg>
            Google Play</a>
          </section>
        </article>
        {(!movie.incomplete && context) &&
        <a title="View previous movie" onClick={ previousMovie } className="btn-icon fixed bottom-2 right-15" href={ "/movie/"+movieIndex }>
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M10.78 19.03a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 111.06 1.06L5.81 11.5h14.44a.75.75 0 010 1.5H5.81l4.97 4.97a.75.75 0 010 1.06z"></path></svg>
        </a>}
        {(!movie.incomplete && context) &&
        <a title="View next movie" onClick={ nextMovie } className="btn-icon fixed bottom-2 right-2" href={ "/movie/"+movieIndex }>
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M13.22 19.03a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 10-1.06 1.06l4.97 4.97H3.75a.75.75 0 000 1.5h14.44l-4.97 4.97a.75.75 0 000 1.06z"></path></svg>
        </a>}
        <TrailerOverlay classes={ (trailer) ? "":"hidden " } trailer={ movie.trailer } title={ movie.title } handleChange={ () => setTrailer(state => false) } />
      </section>
  )
}

export default MovieView
