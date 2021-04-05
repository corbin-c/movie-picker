import React, { useState, useEffect, useRef } from "react";
import "./double-range.css";

function DoubleRange(props) {
  const { start, end, providedValue, onRangeChange } = props;
  const [state,setState] = useState({start, end});
 
  const previousValueRef = useRef(providedValue);
  const previousValue = previousValueRef.current;
  const previousStateRef = useRef(state);
  const previousState = previousStateRef.current;
  
  useEffect(() => {
    if (providedValue.done === false) {
      if ((providedValue.start !== previousValue.start && providedValue.start !== state.start)
      || (providedValue.end !== previousValue.end && providedValue.end !== state.end)) {
        setState(prevState => providedValue);
        onRangeChange({ ...state, providedValue: true });
      }
    }
    if ((state.start !== previousState.start) || (state.end !== previousState.end)) {
      onRangeChange(state);
      previousStateRef.current = state;
    }
    if ((providedValue.done !== previousValue.done)
      || (providedValue.start !== previousValue.start)
      || (providedValue.end !== previousValue.end)) {
      previousValueRef.current = providedValue;
    }
  });
  const onChange = (e) => {
    setState(prevState => {
      let name = e.target.name;
      let value = parseInt(e.target.value);
      let state = { ...prevState };
      if (((name === "start") && (value <= state.end)) || (name === "end")) {
        state = { ...prevState, [name]: value };
      }
      return (state);
    });
  };
  const renderRange = (name, style) => {
    return (
      <input
        type="range"
        step="1"
        style={ style }
        className="appearance-none bg-gray-300 h-2 z-10 absolute top-1/3"
        name={ name }
        min={ (name === "end") ? state.start:start }
        max={ end }
        value={ state[name] }
        onChange={ onChange }
      />
    );
  }
  /* styles for inputs: */
  let endValue = 100 * ((end - state.start) / (end - start));
  let rem = 0.0125 * endValue;
  let width = "max(" + endValue + "% - " + rem + "rem, 1.26rem)";
  let endStyle = { width };
  let startStyle = {
    "--zi": (state.start === end) ? 20:10
  };
  /* style for indicator */
  let endPosition = 1-((state.end - state.start) / (end - state.start));
  let startPosition = (state.start - start) / (end - start);
  startPosition *= 100;
  let startRem = .0125 * (100-startPosition);
  let endRem = .0125 * (50-endPosition*endValue);
  endRem += .625 * (1-endPosition)
  let indicatorStyle = {
    "--indicatorLeft": "calc(" + startPosition + "% + " + (startRem-.1) + "rem",
    "--indicatorRight": "calc("
      + width + " * " + endPosition
      + " + " + (endRem-.1) + "rem)",
  }
  return (
    <fieldset className="flex flex-wrap md:flex-nowrap flex-row justify-evenly mb-5 md:mb-2">
      <span className="w-1/2 order-1 md:w-auto flex-grow text-left md:text-center mb-2 md:mb-0 pl-2 md:pl-0">{ state.start }</span>
      <div className="w-full order-3 md:order-2 md:w-5/6 relative ranges" style={ indicatorStyle }>
        { renderRange("start", startStyle) }
        { renderRange("end", endStyle) }
      </div>
      <span className="w-1/2 order-2 md:order-3 md:w-auto flex-grow text-right md:text-center mb-2 md:mb-0 pr-2 md:pr-0">{ state.end }</span>
    </fieldset>
  )
}

export default DoubleRange;
