import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PosterItem from "./poster-grid-item.js";
import "./movie-grid.css";

/*
 * this component shows the movie results as a grid, based on state filters
 */
 
function MovieGrid(props) {
  const { filtersView } = props;

  const [view, setView] = useState("closed");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(false);
  const [nextPageNeeded, setNextPageNeeded] = useState(false);
  
  const movies = useSelector(state => state.movies.results);
  const queryBody = useSelector(state => state.movies.body);
  const filters = useSelector(state => state.filters);
  
  const timer = useRef(null);
  const lastMovie = useRef(null);
  const gridSection = useRef(null);
  const observerRef = useRef(null);
  const previousFiltersRef = useRef(filters);
  const previousFilters = previousFiltersRef.current;
  
  const dispatch = useDispatch();

  const startYear = 1900;
  const endYear = parseInt((new Date()).getFullYear());
  const WAIT_INTERVAL = 1500;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const handleObserver = (event) => {
    if (event[0].isIntersecting) {
      setNextPageNeeded(true);
    }
  }
  
  const nextPage = async () => {
    if (movies.length === 0 || loading) {
      return;
    }
    let start = movies.length+1;
    if (start > count) {
      if (queryBody.start === start) {
        return;
      }
      queryBody.start = start;
      setLoading(state => true);
      let nextMovies = await fetchMovies(queryBody);
      dispatch({ type: "movies/setBody", payload: queryBody });
      dispatch({ type: "movies/nextPage", payload: nextMovies });
      setLoading(state => false);
    }
  }

  const compareObjects = (obj1, obj2) => {
    const values1 = Object.values(obj1);
    const values2 = Object.values(obj2);
    if (values1.length !== values2.length) {
      return false;
    }
    for (let i=0; i<values1.length; i++) {
      if (typeof values1[i] === "object") {
        let values = compareObjects(values1[i],values2[i]);
        if (!values) {
          return false;
        }
      } else if (values1[i] !== values2[i]) {
        return false;
      }
    }
    return true;
  }

  const cleverJoin = (...values) => {
    return [...new Set([...values])].join(",");
  }

  const fetchMovies = async (body) => {
    let results = await fetch("http://localhost:8080/imdb/movies", {
      method: "POST",
      body: JSON.stringify(body)
    });
    results = await results.json();
    return results;
  }

  const prepareFilters = (filters) => {
    let body = {};
    if (!(filters.dates.start === startYear && filters.dates.end === endYear)
      && filters.dates.start !== 0) {
      body.date = cleverJoin(filters.dates.start,filters.dates.end);
    }
    if (filters.plot !== "") {
      body.plot = filters.plot;
    }
    if (!(filters.runtime.start === 5 && filters.runtime.end === 240)) {
      body.duration = cleverJoin(filters.runtime.start,(filters.runtime.end === 240) ? 1000:filters.runtime.end);
    }
    if (!(filters.rating.start === 0 && filters.rating.end === 10)) {
      body.rating = cleverJoin(filters.rating.start,filters.rating.end);
    }
    if (filters.genres.length > 0) {
      body.genre = filters.genres.join(",");
    }
    if (filters.awards.length > 0) {
      body.awards = filters.awards.join(",");      
    }
    if (filters.persons.p0.name !== "" || filters.persons.p1.name !== "") {
      body.stars = cleverJoin(filters.persons.p0.id,filters.persons.p1.id);
    }
    if (filters.sort.key !== "" || filters.sort.direction !== "") {
      let sort = ["",""];
      sort[0] = (filters.sort.key === "") ? "popularity":filters.sort.key;
      sort[1] = (filters.sort.direction === "") ? "asc":filters.sort.direction;
      body.sort = sort.join(",");
    }
    previousFiltersRef.current = filters;
    body.count = count || getCount();
    dispatch({ type: "movies/setBody", payload: body });
    return body;
  }

  const makeGrid = () => {
    /* handle "no results" -ie body not empty yet empty results
     * & "loading" case - body empty or still awaiting
     */
    if ((Object.keys(queryBody).length > 1)
    && (movies.length === 0)
    && (!loading)) {
      //no results
    } else if ((Object.keys(queryBody).length <= 1)
    || ((movies.length !== 0)
      && (loading))) {
      //loading
    }
    return movies.map((movie) => {
      return (<PosterItem key={ movie.id } movie={ movie } vw={ vw } />)
    });
  }

  const getCount = () => {
    let gridCols = 1;
    const breakPoints = [1536, 1280, 1024, 768, 640];
    for (let i in breakPoints) {
      if (vw > breakPoints[i]) {
        gridCols = 6-i;
        break;
      }
    }
    setCount(gridCols*3);
    return gridCols*3;
  }

  const tryToLoad = () => {
    /* 
     * we wait for some time to avoid fetching to many times,
     * and compare with previous filters to avoid
     * fetching again the same data
     */
    const delay = (movies.length === 0) ? 0 : WAIT_INTERVAL;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (((!compareObjects(filters, previousFilters)) || (movies.length === 0))
        && (!loading)) {
        setLoading(state => true);
        let movies = await fetchMovies(prepareFilters(filters));
        dispatch({ type: "movies/setResults", payload: movies });
        setLoading(state => false);
      }
    }, delay);
  }

  useEffect(() => {
    tryToLoad();
    if (nextPageNeeded) {
      nextPage();
      setNextPageNeeded(state => false);
    }
  });

  useEffect(() => {
    if (filtersView) {
      setView(state => "opening");
      setTimeout(() => {
        const opening = [...gridSection.current.classList].includes("opening");
        if (opening) {
          setView(state => "open");
        }
      },600);
    } else {
      setView(state => "closed");
    }
  },[filtersView])
  
  useEffect(() => {
    document.title = "Movie Picker";
    tryToLoad();
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      handleObserver,
      {
        rootMargin: "0px",
        threshold: [.0, 1.]
      }
    );
    const observer = observerRef.current;
    observer.observe(lastMovie.current);
        
    return () => { observer.disconnect() };
  },[])
  
  return (
    <section ref={ gridSection } className={ view + " overflow-hidden w-screen" }>
      <div className="min-h-screen movie-grid">
        { makeGrid() }
      </div>
      <div className={ ((movies.length < count) ? "hidden":"") + " h-1 mt-1"} ref={ lastMovie }></div>
    </section>
  )
}

export default MovieGrid;
