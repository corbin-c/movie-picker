import React from "react";

import "./footer.css";

function Footer(props) {
  return (
    <footer>
      <p>Created & developed by Clément Corbin</p>
      <ul>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.twitter.com/clem_corbin" title="Follow on Twitter">Follow on Twitter</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/clement-corbin/" title="Connect on LinkedIn">Connect on LinkedIn</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/corbin-c" title="Code on GitHub">Code on Github</a></li>
      </ul>
      <h3>Disclaimer</h3>
      <p className="disclaimer">This website exposes data from <a target="_blank" rel="noopener noreferrer" href="https://www.imdb.com/" title="IMDB website">the Internet Movie DataBase (IMDB)</a>. All our bases are belong to them.</p>
      <p className="disclaimer">It does not intent to become a competitor of IMDB nor has commercial purpose: It only has experimental
      and learning purpose.</p>
      <p className="disclaimer">This website basically acts like a proxy to provide a better browsing & movie discovery experience and does not store IMDB
      or user data in any way.</p>
      <p className="disclaimer">All displayed information remains the intellectual property of IMDB or their legal owner.</p>
    </footer>
  )
}

export default Footer;
