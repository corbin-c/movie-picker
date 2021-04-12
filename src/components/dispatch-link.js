import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function DispatchLink(props) {
  const { href, title, action, classes, children } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(action);
    history.push(href)
  };
  return (
    <a
      className={ classes }
      href={ href }
      title={ title }
      onClick={ handleClick }>
      { children }
    </a>
  )
}

export default DispatchLink;
