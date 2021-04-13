import React from "react";

import GenresLinks from "./genres-links.js";
import PersonLinks from "./person-links.js";

function MovieDetails(props) {
  const { rating, duration, genres, persons } = props;
  return (
    <ul className="details-list">
      <li className="col-start-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fillRule="evenodd" d="M4.75 2a.75.75 0 000 1.5h.75v2.982a4.75 4.75 0 002.215 4.017l2.044 1.29a.25.25 0 010 .422l-2.044 1.29A4.75 4.75 0 005.5 17.518V20.5h-.75a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5h-.75v-2.982a4.75 4.75 0 00-2.215-4.017l-2.044-1.29a.25.25 0 010-.422l2.044-1.29A4.75 4.75 0 0018.5 6.482V3.5h.75a.75.75 0 000-1.5H4.75zM17 3.5H7v2.982A3.25 3.25 0 008.516 9.23l2.044 1.29a1.75 1.75 0 010 2.96l-2.044 1.29A3.25 3.25 0 007 17.518V20.5h10v-2.982a3.25 3.25 0 00-1.516-2.748l-2.044-1.29a1.75 1.75 0 010-2.96l2.044-1.29A3.25 3.25 0 0017 6.482V3.5z"></path>
        </svg>
        { duration }
      </li>
      <li className="col-start-2">
        <svg className="rating-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <mask id="rating">
            <rect x="0" y="0" fill="white" stroke="none" height="24" width={ 24*rating/10 }></rect>
          </mask>
          <path  mask="url(#rating)" fillRule="evenodd" d="M12.672.668a.75.75 0 00-1.345 0L8.27 6.865l-6.838.994a.75.75 0 00-.416 1.279l4.948 4.823-1.168 6.811a.75.75 0 001.088.791L12 18.347l6.117 3.216a.75.75 0 001.088-.79l-1.168-6.812 4.948-4.823a.75.75 0 00-.416-1.28l-6.838-.993L12.672.668z"></path>
          <path fillRule="evenodd" d="M12 .25a.75.75 0 01.673.418l3.058 6.197 6.839.994a.75.75 0 01.415 1.279l-4.948 4.823 1.168 6.811a.75.75 0 01-1.088.791L12 18.347l-6.117 3.216a.75.75 0 01-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 01.416-1.28l6.838-.993L11.328.668A.75.75 0 0112 .25zm0 2.445L9.44 7.882a.75.75 0 01-.565.41l-5.725.832 4.143 4.038a.75.75 0 01.215.664l-.978 5.702 5.121-2.692a.75.75 0 01.698 0l5.12 2.692-.977-5.702a.75.75 0 01.215-.664l4.143-4.038-5.725-.831a.75.75 0 01-.565-.41L12 2.694z"></path>
        </svg>
        { rating }
      </li>
      <GenresLinks genres={ genres } />
      <PersonLinks persons={ persons } type="director"/>
      <PersonLinks persons={ persons } type="actor"/>
    </ul>)
}

export default MovieDetails;
