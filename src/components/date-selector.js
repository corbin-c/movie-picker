import React, { useState, useRef } from "react";
import DoubleRange from "./double-range.js";
import "./date-selector.css";

/* this component allows the user to select date ranges for his movie 
 * discovery, using a slider or by decades */

function DateSelector() {
  const startYear = 1890;
  const endYear = parseInt((new Date()).getFullYear());
  const decades = (() => {
    const start = Math.floor(startYear/10)*10;
    const end = Math.floor(endYear/10)*10;
    let decades = [];
    for (let i=start; i<=end; i+=10) {
      decades.push({text: i +"s", key: i})
    }
    return decades;
  })();
  const initialDecadeState = (() => {
    let decadeState = {};
    decades.forEach(e => {
      decadeState[e.key] = false;
    });
    return decadeState;
  })();
  const decadeRef = useRef(null);
  const [decadeState,setDecadeState] = useState(initialDecadeState);
  const [rangeState,setRangeState] = useState({start: startYear, end: endYear});
  const [providedState,setProvidedState] = useState({start: startYear, end: endYear, done: true});

  const changeValues = (e) => {
    if (e.target.checked) {
      let start = e.target.value;
      start = Math.max(start,startYear);
      let end = Math.min(start+10,endYear);
      setProvidedState(state => {
        return ({start, end, done: false});
      });
    }
  }
  
  const makeRadios = () => {
    return decades.map(decade => {
      return (<label
        htmlFor={ decade.key }
        className={ ((decadeState[decade.key]) ? "selected ":"") + "btn h-12 leading-10 m-1" }
        key={ decade.key }>
        <input
          name="decades"
          type="radio"
          id={ decade.key }
          value={ decade.key } />
        { decade.text }
      </label>)
    });
  }

  const updateRange = (range) => {
    if (range.providedValue) {
      setProvidedState(state => ({
        done: true,
        start: -1,
        end: -1
      }));
    }
    setRangeState(state => {
      return ({ start: range.start, end: range.end });
    });
    setDecadeState(state => {
      Object.keys(state).forEach(e => {
        state[e] = ((parseInt(e) === range.start)
        && (Math.floor(range.start/10) === range.start/10)
        && (range.end === Math.min(range.start+10,endYear)));
      });
      if (!Object.values(state).some(e => e === true)) {
        try {
          decadeRef.current.querySelector("input:checked").checked = false;
        } catch {}
      }
      return state;
    });
  };
  return (
    <section>
      <DoubleRange
        start={ startYear }
        end={ endYear }
        providedValue={ providedState }
        onRangeChange={ updateRange } />
      <fieldset
        ref={ decadeRef }
        onChange={ changeValues }
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        { makeRadios() }
      </fieldset>
    </section>
  );
}

export default DateSelector;
