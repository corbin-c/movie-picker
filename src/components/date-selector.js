import React, { useEffect } from "react";
import DoubleRange from "./double-range.js";
import { useSelector, useDispatch } from "react-redux"

/* this component allows the user to select date ranges for his movie 
 * discovery, using a slider or by decades */

function DateSelector(props) {
  const dispatch = useDispatch();
  const dateState = useSelector(state => state.filters.dates);

  const startYear = 1890;
  const endYear = parseInt((new Date()).getFullYear());

  useEffect(() => {
    dispatch({
      type: "filters/dates/set",
      payload: {start: startYear, end: endYear}
    });  
  },[startYear,endYear]);

  const decades = (() => {
    const start = Math.floor(startYear/10)*10;
    const end = Math.floor(endYear/10)*10;
    let decades = [];
    for (let i=start; i<=end; i+=10) {
      decades.push({text: i +"s", key: i})
    }
    return decades;
  })();

  const isDecadeSelected = (start) => {
    start = Math.max(start,startYear);
    const end = Math.min(start+10,endYear);
    return ((dateState.start === start) && (dateState.end === end));
  }

  const changeValues = (start) => {
    start = Math.max(start,startYear);
    const end = Math.min(start+10,endYear);
    const action = {
      type: "filters/dates/set",
      payload: {start, end}
    };
    dispatch(action);
  }
  
  const makeRadios = () => {
    return decades.map(decade => {
      return (<label
        htmlFor={ decade.key }
        className={ ((isDecadeSelected(decade.key)) ? "selected ":"") + "btn h-12 leading-10 m-1" }
        key={ decade.key }>
        <input
          onClick={ () => { changeValues(decade.key) } }
          name="decades"
          type="radio"
          id={ decade.key }
          value={ decade.key } />
        { decade.text }
      </label>)
    });
  }

  return (
    <section>
      <DoubleRange
        use="dates"
        start={ startYear }
        end={ endYear } />
      <fieldset
        className="fieldgrid">
        { makeRadios() }
      </fieldset>
    </section>
  );
}

export default DateSelector;
