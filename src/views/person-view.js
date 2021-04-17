import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import DispatchLink from "../components/dispatch-link.js";
import MoviePoster from "../components/movie-poster.js";
import BackButton from "../components/item-view/back-button.js";
import EnrichedLinks from "../components/item-view/enriched-links.js";
import CommercialLinks from "../components/item-view/commercial-links.js";

import "./item-view.css";

function PersonView() {
  let { id } = useParams();
  const history = useHistory();
  const [person, setPerson] = useState({});
  const [readMore, setMore] = useState(false);

  const handleReadMore = () => {
    setMore(state => !state);
  }
  
  const getShortText = (text,limit) => {
    text = text.split(" ");
    const dot = text.findIndex((e,i) => e.includes(".") && i >= limit);
    return text.slice(0,dot+1).join(" ");
  }

  useEffect(() => {
    if ((document.title !== "Movie Picker | "+person.name) && (typeof person.name !== "undefined")) {
      document.title = "Movie Picker | "+person.name;
    }
    if ((!person.enriched) && (person.id)){
      (async () => {
      let enrichedData = await fetch("/imdb/enrich/person/"+person.id+"/"+person.name);
        enrichedData = await enrichedData.json();
        if (!enrichedData.error) {
          person.enriched = enrichedData;
          setPerson(state => ({...person}));
        }
      })();
    }
  },[person]);

  useEffect(() => {
    setMore(state => false);
    (async () => {
      let person = await fetch("/imdb/person/"+id);
      person = await person.json();
      if (person.error) {
        //REDIRECT TO 404
        history.push("/404");
      }
      setPerson(state => ({...person}));
    })();
    window.scrollTo(0, 0);
  },[id,history]);

  return (
    (Object.keys(person).length === 0)
      ? <section>
          <BackButton title="Go back to movie view" icon="arrow" />
        </section>
      : <section className="item-view person">
        <BackButton title="Go back to movie view" icon="arrow" />
        <header>
          <h1>{ person.name }</h1>
        </header>
        <article className="mt-9">
          <figure>
            <MoviePoster
              classes="mx-auto"
              vw={ Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) }
              size="big"
              type="person"
              cover={ person.picture }
              title={ person.name } />
          </figure>
          <p>{ (readMore) ? person.bio : getShortText(person.bio,100) }
          <button className="ml-auto rounded-lg border-2 border-solid bg-black m-2 block text-center border-yellow-50 hover:bg-yellow-50 hover:text-black active:bg-red-700 active:border-red-900 active:text-red-50 px-3 py-2" onClick= { handleReadMore }>
            Read { (readMore) ? "less":"more" }
          </button>
          </p>
          <section className="links">
            <div className="w-full flex-grow flex justify-around mb-1">
              <DispatchLink
                href="/grid/"
                title={ "Browse filmography: "+person.name }
                action={ { type: "filters/persons/p0", payload: {id: person.id, name: person.name}, reset: true } }>
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fillRule="evenodd" d="M24 5.25a.75.75 0 00-1.136-.643L16.5 8.425V6.25a1.75 1.75 0 00-1.75-1.75h-13A1.75 1.75 0 000 6.25v11C0 18.216.784 19 1.75 19h13a1.75 1.75 0 001.75-1.75v-2.175l6.364 3.818A.75.75 0 0024 18.25v-13zm-7.5 8.075l6 3.6V6.575l-6 3.6v3.15zM15 9.75v-3.5a.25.25 0 00-.25-.25h-13a.25.25 0 00-.25.25v11c0 .138.112.25.25.25h13a.25.25 0 00.25-.25v-7.5z"></path>
                </svg>
                Filmography
              </DispatchLink>
            </div>
            <EnrichedLinks enrichedData={ person.enriched } title={ person.name } />
            <CommercialLinks title={ person.name } />
          </section>
        </article>
      </section>
  )
}

export default PersonView
