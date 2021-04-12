import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./movie-sorter.css";

function MovieSorter(props) {
  const dispatch = useDispatch();
  const key = useSelector(state => state.filters.sort.key) || "moviemeter";
  const direction = useSelector(state => state.filters.sort.direction) || "asc";
  const changeKey = (e) => {
    dispatch({type: "filters/sort/key", payload: e.target.value});
  }
  const changeDirection = (e) => {
    dispatch({type: "filters/sort/direction", payload: e.target.value});
  }
  const { view } = props;
  return (
    <fieldset
      id="sorter"
      className={ ((view) ? "sortVisible":"") + " z-10 bg-yellow-50 text-red-900 w-screen transform-gpu translate-y-full fixed bottom-0 lg:bottom-auto h-26 lg:h-13 pr-16 lg:top-0 left-0 flex flex-col lg:flex-row justify-around lg:justify-end items-center" }>
      <label className="lg:pr-4 text-xl lg:flex-grow lg:text-right" htmlFor="sortKey">Sort by…</label>
      <select value={ key } id="sortKey" name="key" onChange={ changeKey }>
        <option value="moviemeter">popularity</option>
        <option value="alpha">alphabetical order</option>
        <option value="num_votes">number of votes</option>
        <option value="boxoffice_gross_us">US gross box-office</option>
        <option value="runtime">runtime</option>
        <option value="year">release year</option>
      </select>
      <select value={ direction } name="direction" onChange={ changeDirection }>
        <option value="asc">ascending</option>
        <option value="desc">descending</option>
      </select>
    </fieldset>
  )
}

export default MovieSorter
