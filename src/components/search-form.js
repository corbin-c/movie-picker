import React, { useState, useEffect, useRef } from "react";

function SearchForm(props) {
  const { path, placeHolder, handleChanges } = props;
  const [resultsList,setResults] = useState([]);
  const [result,setState] = useState({});
  const timer = useRef(null);
  const input = useRef(null);
  const WAIT_INTERVAL = 1000;
  const ENTER_KEY = 13;

  const displaySearchResults = () => {
    return resultsList.map((item,i) => {
      return <li
        className="hidden group h-8 even:bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-800 pl-3 bg-purple-200 cursor-pointer flex items-center justify-between"
        onClick={ () => selectResult(item.l, item.id) }
        key={ item.id }>
          { item.l }
          <span className="text-xs pr-3 text-gray-500 group-hover:text-white"> { item.s } </span>
        </li>
    });
  }

  const clearSearch = () => {
    input.current.value = "";
    setState({});
    setResults([]);
  }

  const selectResult = (name,id) => {
    input.current.value = name;
    setState({ name, id });
    setResults([]);
  }

  const performSearch = async (searchString) => {
    if (searchString.length > 0) {
      setState({ name: searchString });
      console.log("searching...", path.type, searchString);
      let results = await fetch(path.root+searchString+path.type);
      results = await results.json();
      setResults(results);
    } else {
      setState({});
      setResults([]);
    }
  }

  const inputChange = (e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      triggerChange(e.target.value);
    }, WAIT_INTERVAL);
  }
  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      clearTimeout(timer.current);
      triggerChange(e.target.value);
    }
  }
  const triggerChange = (value) => {
    performSearch(value);
  }

  useEffect(() => {
    handleChanges(result);
  }, [handleChanges, result]);

  return (
    <fieldset className="relative">
      <span
        className={((result.name) ? "flex":"hidden") + " cursor-pointer absolute top-2.5 text-2xl text-purple-800 right-4 rounded-full bg-purple-200 h-5 w-5 items-center justify-center"}
        onClick={ clearSearch }>
      ×</span>
      <input
        ref={ input }
        onChange={ inputChange }
        onKeyDown={ handleKeyDown }
        type="text"
        className="textInput"
        placeholder={ placeHolder }/>
      <ul tabindex="1" className={ ((resultsList.length === 0) ? "empty ":"") + "z-40 bottom-0 w-auto rounded-b-lg absolute left-0 right-0 overflow-hidden mx-2 border-2 border-solid border-purple-600 border-t-0" }>
        { displaySearchResults() }
      </ul>
    </fieldset>
  )
}

export default SearchForm;
