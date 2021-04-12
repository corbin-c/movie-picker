import React, { useEffect, useRef } from "react";

function TrailerOverlay(props) {
  const { title, trailer, handleChange, classes } = props;
  const div = useRef(null);
  const tryToExit = (event) => {
    if (event.key === "Escape") {
      handleChange();
    }
  }
  useEffect(() => {
    if (classes === "") {
      div.current.focus();
    }
  },[trailer, classes]);
  return (
    <div ref={ div } onKeyDown={ tryToExit } tabIndex="1" className={ classes + "trailer fixed top-0 left-0 w-screen h-screen bg-opacity-80 bg-black flex justify-center items-center"}>
      <button title="Close trailer" className="btn-icon absolute top-2 right-2" onClick={ handleChange }>
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fillRule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"></path></svg>
      </button>
      { ((trailer) && (trailer.youtube) && (classes === ""))
      && <div className="relative video-container">
          <iframe
            className="w-full h-full absolute top-0 left-0"
            width="560"
            height="315"
            src={ "https://www.youtube-nocookie.com/embed/" + trailer.youtube + "?autoplay=1&modestbranding=1&disablekb=1&controls=0&showinfo=0" }
            title={ title + "trailer" }
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div> }
      { ((trailer) && (trailer.imdb) && (classes === ""))
      && <video src={ trailer.imdb } autoPlay={ true } controls={ true }></video> }
    </div>
  );
}

export default TrailerOverlay;
