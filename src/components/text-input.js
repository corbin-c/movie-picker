import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function TextInput(props) {
  const { placeHolder, use } = props;
  const dispatch = useDispatch();
  const [searchString,setSearchString] = useState("");
  const selector = useSelector(state => state.filters[use]);
  const timer = useRef(null);
  const WAIT_INTERVAL = 1000;

  const clearSearch = () => {
    setSearchString("");
    triggerChange("");
  }

  const inputChange = (e) => {
    setSearchString(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      triggerChange(e.target.value);
    }, WAIT_INTERVAL);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(timer.current);
      triggerChange(e.target.value);
    }
  }
  const triggerChange = (value) => {
    dispatch({type: "filters/" + use + "/set", payload: value });
  }
  
  useEffect(() => {
    if (selector !== "") {
      setSearchString(selector);
    }
  }, [setSearchString,selector]);
  
  return (
    <div className="relative">
      <button
        title="Clear search"
        className={((searchString !== "") ? "flex":"hidden") + " cursor-pointer absolute top-2.5 text-2xl text-red-900 right-4 rounded-full bg-red-200 h-5 w-5 items-center justify-center"}
        onClick={ clearSearch }>
      ×</button>
      <input
        onChange={ inputChange }
        onKeyDown={ handleKeyDown }
        type="text"
        value={ searchString }
        className="textInput"
        placeholder={ placeHolder }/>
    </div>
  )
}

export default TextInput;
