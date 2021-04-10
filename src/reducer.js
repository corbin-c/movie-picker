import filtersReducer from "./reducers/filters.js";
import moviesReducer from "./reducers/movies.js";

const initialState = {
  filters: {
    dates: { start: 0, end: 0 },
    rating: { start: 0, end: 10 },
    runtime: { start: 5, end: 240 },
    genres: [],
    persons: {
      p0: {name:"", id:""},
      p1: {name:"", id:""}
    },
    awards: [],
    sort: {
      key: "",
      direction: ""
    },
    plot: ""
  },
  movies: {
    body: {},
    results: []
  }
}

export default function rootReducer(state = initialState, action) {
  return {
    filters: filtersReducer(state.filters,action),
    movies: moviesReducer(state.movies, action)
  }
}
