import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";


import DoubleRange from "./double-range.js";
import TextInput from "./text-input.js";
import DateSelector from "./date-selector.js";
import ListPicker from "./list-picker.js";
import PersonSelector from "./person-selector.js";
import "./movie-trimmer.css";

/*
 * this component exposes various controls to narrow the search (dates, roles, awards, etc.)
 */
 
function MovieTrimmer(props) {
  const { view } = props;
  const dispatch = useDispatch();
  const resetFilters = () => {
    dispatch({type:"", reset: true});
  }
  return (
    <section id="filters" className={ ((view) ? "filtersVisible":"") + " flex flex-col justify-between"}>
      <h1 className="text-center text-3xl font-bold text-red-900 mt-2 mb-4">Filter movies by…</h1>
      <form className="flex-grow" onSubmit={ (e) => e.preventDefault() }>
        <details>
          <summary>Years</summary>
          <DateSelector />
        </details>
        <details>
          <summary>Genres</summary>
          <ListPicker source="genres" />
        </details>
        <details>
          <summary>Persons</summary>
          <PersonSelector />
        </details>
        <details>
          <summary>Awards</summary>
          <ListPicker source="awards" />
        </details>
        <details>
          <summary>User rating</summary>
          <DoubleRange use="rating" start={0} end={10} />
        </details>
        <details>
          <summary>Runtime</summary>
          <DoubleRange use="runtime" start={5} end={240} />
        </details>
        <details>
          <summary>Plot</summary>
          <TextInput use="plot" placeHolder="zombies" />
        </details>
        
      </form>
      <button onClick={ resetFilters } className="btn-icon absolute top-2 left-2 lg:left-14" title="Clear all filters">
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3.38 8A9.502 9.502 0 0112 2.5a9.502 9.502 0 019.215 7.182.75.75 0 101.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 00-9.5 5.452V4.75a.75.75 0 00-1.5 0V8.5a1 1 0 001 1h3.75a.75.75 0 000-1.5H3.38zm-.595 6.318a.75.75 0 00-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 001.5 0V15.5a1 1 0 00-1-1h-3.75a.75.75 0 000 1.5h2.37A9.502 9.502 0 0112 21.5c-4.446 0-8.181-3.055-9.215-7.182z"></path></svg>
      </button> 
      <h2 className="text-center text-xl font-bold text-red-900 mt-2 pb-4">
        <Link to="/movie/random" title="Get a random movie">
          …or get a random movie?
        </Link>
      </h2>
    </section>
  )
}

export default MovieTrimmer;
