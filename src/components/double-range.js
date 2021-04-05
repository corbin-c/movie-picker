import React, { useState } from "react";
import "./double-range.css";

function DoubleRange(limits) {
  const { start, end } = limits;
  //~ const end = parseInt((new Date()).getFullYear());
  const [state,setState] = useState({start, end});
  const onChange = (e) => {
    setState(prevState => {
      let name = e.target.name;
      let value = parseInt(e.target.value);
      if (((name === "start") && (value <= state.end)) || (name === "end")) {
        return ({ ...prevState, [name]: value });
      }
      return ({ ...prevState });
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
    "--wOrZ": "max(" + width + " - 1.26rem, 0rem)",
  }
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
    <fieldset className="flex flex-row justify-evenly">
      <span className="flex-grow text-center">{ state.start }</span>
      <div className="w-5/6 relative ranges" style={ indicatorStyle }>
        { renderRange("start", startStyle) }
        { renderRange("end", endStyle) }
      </div>
      <span className="flex-grow text-center">{ state.end }</span>
    </fieldset>
  )
}

export default DoubleRange;
