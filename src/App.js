import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/footer.js";
import GridView from "./views/grid-view.js";
import MovieView from "./views/movie-view.js";
import PersonView from "./views/person-view.js";

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
          <Route path="/person/:id">
            <PersonView />
          </Route>
        </Switch>
        <Footer />
    </Router>
  );
}
export default App;
