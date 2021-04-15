import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import SearchForm from "../components/grid-view/movie-trimmer/search-form.js";
import "./home.css";

function HomeView() {
  const { home } = useParams();
  const history = useHistory();
  const [homeView,setHomeView] = useState(true);
  const handleChanges = (e) => {
    if (e.id !== "") {
      const page = (e.id.slice(0,2) === "tt") ? "/movie/":"/person/";
      history.push(page+e.id, { from: "/" });
    }
  }
  const toGrid = (e) => {
    e.preventDefault();
    setHomeView(state => false);
    setTimeout(() => {
      setHomeView(state => true);
      history.push("/grid/");
    },1300);
  }
  return (
    <section id="home" className={ ((typeof home !== "undefined") ? "hidden ":"flex ") + ((homeView) ? "":"closing")}>
      <header>
        <h1>explore</h1>
        <h1>discover</h1>
        <h1>pick</h1>
      </header>
      <div>
        <p>Feel like you watching a movie but don't know which one?</p>
        <p>This web app is here to help you! You can start a search below:</p>
        <SearchForm
          formId=""
          placeHolder="Citizen Kane, Orson Welles…"
          handleChanges={ handleChanges }
          path={{root: "/imdb/search/", type: "" }} />
        <p><a onClick={ toGrid } title="explore movies by browsing a grid view" href="/grid/">…or just explore the grid</a></p>
      </div>
      <footer>
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M24 5.25a.75.75 0 00-1.136-.643L16.5 8.425V6.25a1.75 1.75 0 00-1.75-1.75h-13A1.75 1.75 0 000 6.25v11C0 18.216.784 19 1.75 19h13a1.75 1.75 0 001.75-1.75v-2.175l6.364 3.818A.75.75 0 0024 18.25v-13zm-7.5 8.075l6 3.6V6.575l-6 3.6v3.15zM15 9.75v-3.5a.25.25 0 00-.25-.25h-13a.25.25 0 00-.25.25v11c0 .138.112.25.25.25h13a.25.25 0 00.25-.25v-7.5z"></path></svg>
        <h1>Movie Picker</h1>
        <p>find a good movie to watch. simply.</p>
      </footer>
    </section>
  );
}
export default HomeView;
//        <Link className="absolute right-0" to="/grid/">GRID</Link>
