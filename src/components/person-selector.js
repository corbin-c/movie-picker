import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SearchForm from "./search-form.js";

// displays a search form for person lookup, allows to add another form for cross-searches

function PersonSelector() {
  const [inputs, setInputs] = useState(1);
  const dispatch = useDispatch();

  const dispatchChanges = (state) => {
    let { source, name, id } = state;
    if (typeof name === "undefined") {
      name = "";
    }
    if (typeof id === "undefined") {
      id = "";
    }
    let action = {type: "filters/"+source, payload: {name, id}};
    dispatch(action);
  }

  const removePerson = () => {
    setInputs(1);
    dispatchChanges({source: "persons/p1"})
  }

  return (<fieldset>
  <div className="flex items-center mb-2">
    <SearchForm
      z="1"
      formId="persons/p0"
      placeHolder="John Doe"
      handleChanges={ dispatchChanges }
      path={{root: "http://localhost:8080/imdb/search/", type: "/names" }} />
    <button
      onClick={ () => setInputs(2) }
      title="Add another person"
      className={((inputs === 1) ? " ":"invisible ") + "flex cursor-pointer text-2xl mx-2 text-green-800 rounded-full bg-green-200 h-5 w-5 items-center justify-center"}
      >
    +</button>
  </div>
  {( inputs === 2 ) &&
  <div className="flex items-center">
    <SearchForm
      formId="persons/p1"
      placeHolder="Erika Mustermann"
      handleChanges={ dispatchChanges }
      path={{root: "http://localhost:8080/imdb/search/", type: "/names" }} />
    <button
      onClick={ removePerson }
      title="Remove this person"
      className="flex cursor-pointer text-2xl mx-2 text-red-900 rounded-full bg-red-200 h-5 w-5 items-center justify-center"
      >
    ×</button>
  </div>}
  </fieldset>);
}
export default PersonSelector;
