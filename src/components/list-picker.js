import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"

/* component to fetch a list & generate a checkboxes grid */

function ListPicker(props) {
  const { source } = props;
  const [list,setListState] = useState([]);
  const dispatch = useDispatch();
  const selected = useSelector(state => state.filters[source]) || [];

  const listCheckBoxes = () => {
    return list.map(element => {
      return (<label
        htmlFor={ element }
        className={ ((selected.includes(element)) ? "selected ":"") + "inline-block btn h-12 leading-10 m-1 capitalize" }
        key={ element }>
        <input
          onClick={ selectElement }
          name={ source }
          type="checkbox"
          id={ element }
          checked={ (selected.includes(element)) }
          value={ element } />
        { element.replace(/_/g, " ").replace(" winner","") }
      </label>)
    });
  }

  useEffect(() => {
    (async () => {
      let fetchedList = await fetch("/imdb/" + source);
      fetchedList = await fetchedList.json();
      setListState(fetchedList);
    })();
  },[source]);

  const selectElement = (e) => {
    const key = e.target.value;
    const actionType = (e.target.checked) ? "add":"remove";
    const action = {
      type: "filters/"+source+"/"+actionType,
      payload: key
    };
    dispatch(action);
  };

  return (<fieldset className="fieldgrid">
      { listCheckBoxes() }
    </fieldset>)
}

export default ListPicker;
