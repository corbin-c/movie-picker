import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./movie-grid.css";

/*
 * this component shows the movie results as a grid, based on state filters
 */
 
function MovieGrid(props) {
  const { filtersView } = props;

  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(18);
  const [nextPageNeeded, setNextPageNeeded] = useState(false);
  
  const movies = useSelector(state => state.movies.results);
  const queryBody = useSelector(state => state.movies.body);
  const filters = useSelector(state => state.filters);
  
  const timer = useRef(null);
  const lastMovie = useRef(null);
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
    let results = await fetch("http://localhost:8080/movies", {
      method: "POST",
      body: JSON.stringify(body)
    });
    results = await results.json();
    return results;
  }

  const prepareFilters = async (filters) => {
    let body = {};
    if (!(filters.dates.start === startYear && filters.dates.end === endYear)
      && filters.dates.start !== 0) {
      body.date = cleverJoin(filters.dates.start,filters.dates.end);
    }
    if (filters.genres.length > 0) {
      body.genre = filters.genres.join(",");
    }
    if (filters.awards.length > 0) {
      body.awards = filters.awards.join(",");      
    }
    if (filters.persons.p0.name !== "" || filters.persons.p1.name !== "") {
      body.stars = cleverJoin(...filters.persons.map(e => e.id));
    }
    previousFiltersRef.current = filters;
    body.count = count;
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
    return movies.map((movie,i,a) => {
      return (<figure key={ movie.id } >
        <img
          loading="lazy"
          srcSet={ [movie.cover.small+" 80w", movie.cover.medium+" 400w"].join(", ") }
          sizes={ "(max-width: 320px) 80px, 400px" }
          src={ movie.cover.big }
          alt={ "Movie poster for '" + movie.title + "'" } />
        <figcaption> { movie.title + ((movie.year !== "") ? " ("+ movie.year +")" :"") }</figcaption>
      </figure>)
    });
  }
  
  useEffect(() => {
    /* 
     * we wait for some time to avoid fetching to many times,
     * and compare with previous filters to avoid
     * fetching again the same data
     */
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!compareObjects(filters, previousFilters)) {
        setLoading(state => true);
        let movies = await fetchMovies(await prepareFilters(filters));
        dispatch({ type: "movies/setResults", payload: movies });
        setLoading(state => false);
      }
    }, WAIT_INTERVAL);
    if (nextPageNeeded) {
      nextPage();
      setNextPageNeeded(state => false);
    }
  });
  
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      handleObserver,
      {
        rootMargin: "0px",
        threshold: 1.0
      }
    );
    const observer = observerRef.current;
    observer.observe(lastMovie.current);
    
    const count = ((width) => {
      let gridCols = 1;
      const breakPoints = [1536, 1280, 1024, 768, 640];
      for (let i in breakPoints) {
        if (width > breakPoints[i]) {
          gridCols = 6-i;
          break;
        }
      }
      return gridCols*3;
    })(vw);
    
    setCount(count);
    
    return () => { observer.disconnect() };
  },[])
  
  return (
    <main>
      <section className="movie-grid">
        { makeGrid() }
      </section>
      <div ref={ lastMovie }></div>
    </main>
  )
}

export default MovieGrid;
