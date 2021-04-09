import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function SearchForm(props) {
  const { path, placeHolder, handleChanges, z, formId } = props;
  const resultState = useSelector(state => state
    .filters
    [formId.split("/")[0]]
    [formId.split("/")[1]]) 
    || { name: "", id: "" };
  const [searchString,setSearchString] = useState("");
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
    setSearchString("");
    setState({});
    setResults([]);
  }

  const selectResult = (name,id) => {
    setState({ name, id });
    setResults([]);
  }

  const performSearch = async (searchString) => {
    if (searchString.length > 0) {
      //~ setState({ name: searchString }); //maybe remove this, causes undesired side effects
      let results = await fetch(path.root+searchString+path.type);
      results = await results.json();
      setResults(results);
    } else {
      setState({});
      setResults([]);
    }
  }

  const inputChange = (e) => {
    setSearchString(e.target.value);
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
    handleChanges({ ...result, source: formId });
  }, [handleChanges, result, formId]);

  useEffect(() => {
    if (resultState.name !== "") {
      setSearchString(resultState.name);
    }
  }, [setSearchString,resultState.name]);

  return (
    <div className="relative w-full">
      <button
        title="Clear search"
        className={((searchString !== "") ? "flex":"hidden") + " cursor-pointer absolute top-2.5 text-2xl text-purple-800 right-4 rounded-full bg-purple-200 h-5 w-5 items-center justify-center"}
        onClick={ clearSearch }>
      ×</button>
      <input
        ref={ input }
        onChange={ inputChange }
        onKeyDown={ handleKeyDown }
        type="text"
        value={ searchString }
        className="textInput"
        placeholder={ placeHolder }/>
      <ul tabIndex="1" className={ ((resultsList.length === 0) ? "empty hidden ":"")
        + "z-" + (40+(z*10 || 0))
        + " bottom-0 w-auto rounded-b-lg absolute left-0 right-0 overflow-hidden mx-2 border-2 border-solid border-purple-600 border-t-0" }>
        { displaySearchResults() }
      </ul>
    </div>
  )
}

export default SearchForm;
