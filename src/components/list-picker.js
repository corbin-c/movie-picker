import React, { useState, useEffect } from "react";

function ListPicker(props) {
  const { source } = props;
  const [list,setListState] = useState([]);
  const listCheckBoxes = () => {
    return list.map(element => {
      return (<label
        htmlFor={ element.key }
        className={ ((element.selected) ? "selected ":"") + "inline-block btn h-12 leading-10 m-1 capitalize" }
        key={ element.key }>
        <input
          name={ source }
          type="checkbox"
          id={ element.key }
          value={ element.key } />
        { element.key.replace(/_/g, " ") }
      </label>)
    });
  }
  useEffect(() => {
    (async () => {
      let fetchedList = await fetch("/" + source);
      fetchedList = await fetchedList.json();
      let list = fetchedList.map(e => {
        return ({ key: e, selected: false });
      });
      setListState(list);
    })();
  },[]);
  const selectElement = (e) => {
    const key = e.target.value;
    const selected = e.target.checked;
    setListState(state => {
      let changedItem = state.find(item => item.key === key);
      changedItem.selected = selected;
      return ([...state]);
    });
  };
  return (<fieldset className="fieldgrid" onChange={ selectElement }>
      { listCheckBoxes() }
    </fieldset>)
}

export default ListPicker;
