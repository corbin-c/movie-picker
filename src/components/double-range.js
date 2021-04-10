import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./double-range.css";

/* this component merges two input[type=range] to allow a min-max interval slider selection */

function DoubleRange(props) {
  const { start, end, use } = props;
  const selected = useSelector(state => state.filters[use]);
  const dispatch = useDispatch();

  const onChange = (e) => {
    let name = e.target.name;
    let value = parseInt(e.target.value);
    let state = { ...selected };
    if (((name === "start") && (value <= selected.end)) || (name === "end")) {
      state = { ...state, [name]: value };
      dispatch({ type:"filters/" + use + "/set", payload: state });
    }
  };
  const renderRange = (name, style) => {
    return (
      <input
        type="range"
        step="1"
        style={ style }
        className="appearance-none bg-red-200 h-2 z-10 absolute top-1/3"
        name={ name }
        min={ (name === "end") ? selected.start:start }
        max={ end }
        value={ selected[name] }
        onChange={ onChange }
      />
    );
  }
  /* styles for inputs: */
  let endValue = 100 * ((end - selected.start) / (end - start));
  let rem = 0.0125 * endValue;
  let width = "max(" + endValue + "% - " + rem + "rem, 1.26rem)";
  let endStyle = { width };
  let startStyle = {
    "--zi": (selected.start === end) ? 20:10
  };
  /* style for indicator */
  let endPosition = 1-((selected.end - selected.start) / (end - selected.start));
  let startPosition = (selected.start - start) / (end - start);
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
      <span className="w-1/2 order-1 md:w-auto flex-grow text-left md:text-center mb-2 md:mb-0 pl-2 md:pl-0 md:pr-2">{ selected.start }</span>
      <div className="w-full order-3 md:order-2 md:w-5/6 relative ranges" style={ indicatorStyle }>
        { renderRange("start", startStyle) }
        { renderRange("end", endStyle) }
      </div>
      <span className="w-1/2 order-2 md:order-3 md:w-auto flex-grow text-right md:text-center mb-2 md:mb-0 pr-2 md:pr-0 md:pl-2">{ selected.end }</span>
    </fieldset>
  )
}

export default DoubleRange;
