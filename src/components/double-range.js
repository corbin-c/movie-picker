import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"

import "./double-range.css";

/* this component merges two input[type=range] to allow a min-max interval slider selection */

function DoubleRange(props) {
  const { start, end, use } = props;
  const [internalState,setState] = useState({start, end});
  const selected = useSelector(state => state.filters[use]) || { start, end };
  const previousGlobalStateRef = useRef(selected);
  const previousGlobalState = previousGlobalStateRef.current;
  const previousInternalStateRef = useRef(internalState);
  const previousInternalState = previousInternalStateRef.current;

  const dispatch = useDispatch();

  const dispatchChanges = (state) => {
    dispatch({ type:"filters/dates/set", payload: state });
  }

  useEffect(() => {
    if ((selected.start !== previousGlobalState.start && selected.start !== internalState.start)
      || (selected.end !== previousGlobalState.end && selected.end !== internalState.end)) {
      setState(state => selected);
    } else if ((internalState.start !== previousInternalState.start)
      || (internalState.end !== previousInternalState.end)) {
      dispatchChanges(internalState);
      previousInternalState.current = internalState;
    } else if ((selected.start !== previousGlobalState.start)
      || (selected.end !== previousGlobalState.end)) {
      previousGlobalState.current = selected;
    }
  });

  const onChange = (e) => {
    setState(prevState => {
      let name = e.target.name;
      let value = parseInt(e.target.value);
      let state = { ...prevState };
      if (((name === "start") && (value <= internalState.end)) || (name === "end")) {
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
        min={ (name === "end") ? internalState.start:start }
        max={ end }
        value={ internalState[name] }
        onChange={ onChange }
      />
    );
  }
  /* styles for inputs: */
  let endValue = 100 * ((end - internalState.start) / (end - start));
  let rem = 0.0125 * endValue;
  let width = "max(" + endValue + "% - " + rem + "rem, 1.26rem)";
  let endStyle = { width };
  let startStyle = {
    "--zi": (internalState.start === end) ? 20:10
  };
  /* style for indicator */
  let endPosition = 1-((internalState.end - internalState.start) / (end - internalState.start));
  let startPosition = (internalState.start - start) / (end - start);
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
      <span className="w-1/2 order-1 md:w-auto flex-grow text-left md:text-center mb-2 md:mb-0 pl-2 md:pl-0">{ internalState.start }</span>
      <div className="w-full order-3 md:order-2 md:w-5/6 relative ranges" style={ indicatorStyle }>
        { renderRange("start", startStyle) }
        { renderRange("end", endStyle) }
      </div>
      <span className="w-1/2 order-2 md:order-3 md:w-auto flex-grow text-right md:text-center mb-2 md:mb-0 pr-2 md:pr-0">{ internalState.end }</span>
    </fieldset>
  )
}

export default DoubleRange;
