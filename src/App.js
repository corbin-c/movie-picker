import store from "./store.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GridView from "./views/grid-view.js";
import MovieView from "./views/movie-view.js";
import PersonView from "./views/person-view.js";
import "./App.css";

const unsubscribe = store.subscribe(() =>
  console.log('State after dispatch: ', store.getState())
)

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <GridView />
          </Route>
          <Route path="/movie/:id">
            <MovieView />
          </Route>
          <Route path="/person">
            <PersonView />
          </Route>
        </Switch>
    </Router>
  );
}
export default App;

/*
 * Disclaimer:
 * This website exposes data from the Internet Movie DataBase (IMDB). All our bases are belong to them.
 * It does not intent to become a competitor of IMDB nor has commercial purpose: It only has experimental
 * and learning purpose.
 * This website basically acts like a proxy to provide a better browsing & film discovery experience and does not store IMDB
 * or user data in any way.
 * All displayed information remains the intellectual property of IMDB or their legal owner..
 */
