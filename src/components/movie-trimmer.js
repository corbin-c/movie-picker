import React from "react";
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
          <DoubleRange use="rating" start="0" end="10" />
        </details>
        <details>
          <summary>Runtime</summary>
          <DoubleRange use="runtime" start="5" end="240" />
        </details>
        <details>
          <summary>Plot</summary>
          <TextInput use="plot" placeHolder="zombies" />
        </details>
        
      </form>
      <h2 className="text-center text-xl font-bold text-red-900 mt-2 pb-4">…or get a random movie?</h2>
    </section>
  )
}

export default MovieTrimmer;
