import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/footer.js";
import HomeView from "./views/home-view.js";
import GridView from "./views/grid-view.js";
import MovieView from "./views/movie-view.js";
import PersonView from "./views/person-view.js";
import Error404 from "./views/error-404.js";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/movie/:id">
            <MovieView />
          </Route>
          <Route path="/person/:id">
            <PersonView />
          </Route>
          <Route path="/404">
            <Error404 />
          </Route>
          <Route path="/:home?">
            <HomeView />
            <GridView />
          </Route>
        </Switch>
        <Footer />
    </Router>
  );
}
export default App;
