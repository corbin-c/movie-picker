import React from "react";

import DispatchLink from "../../dispatch-link.js";

function GenresLinks(props) {
  const { genres } = props;
  return (
    <li className="col-span-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"></path>
        <path fillRule="evenodd" d="M2.5 1A1.5 1.5 0 001 2.5v8.44c0 .397.158.779.44 1.06l10.25 10.25a1.5 1.5 0 002.12 0l8.44-8.44a1.5 1.5 0 000-2.12L12 1.44A1.5 1.5 0 0010.94 1H2.5zm0 1.5h8.44l10.25 10.25-8.44 8.44L2.5 10.94V2.5z"></path>
      </svg>
      <ul>
        { genres.map(e => (
          <li key={ e }>
            <DispatchLink
              href="/grid/"
              title={ "Browse movies with the genre "+e }
              action={ { type: "filters/genres/add", payload: e.toLowerCase(), reset: true } }>
              {e}
            </DispatchLink>
          </li>
        )) }
      </ul>
    </li>
  )
}

export default GenresLinks;
