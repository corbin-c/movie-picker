import React from "react";
import { useHistory, useLocation } from "react-router-dom";

function BackButton(props) {
  const { icon, title, href } = props;
  const history = useHistory();
  const location = useLocation();
  const handleClick = (e) => {
    e.preventDefault();
    if ((href === true)
    || ((location.pathname.slice(0,8) === "/person/") && (typeof location.state === "undefined"))
    || (location.state?.from === "/")) {
      history.push("/grid/");
    } else {
      history.goBack();
    }
  };
  return (<a onClick={ handleClick } title={ title } className="btn-icon fixed top-2 left-2" href="/grid/">
      { (icon === "arrow")
        ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M10.78 19.03a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06l6.25-6.25a.75.75 0 111.06 1.06L5.81 11.5h14.44a.75.75 0 010 1.5H5.81l4.97 4.97a.75.75 0 010 1.06z"></path></svg>
        : <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <svg id="square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M4 5.75C4 4.784 4.784 4 5.75 4h4.5c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0110.25 12h-4.5A1.75 1.75 0 014 10.25v-4.5zm1.75-.25a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h4.5a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-4.5z"></path></svg>
            </defs>
            <use transform="translate(-0.5 -1)" href="#square"></use>
            <use transform="translate(9 -1)" href="#square"></use>
            <use transform="translate(-0.5 8.5)" href="#square"></use>
            <use transform="translate(9 8.5)" href="#square"></use>
          </svg> }
    </a>);
}

export default BackButton;
