import listsReducer from "./reducers/lists.js";
import filtersReducer from "./reducers/filters.js";
import moviesReducer from "./reducers/movies.js";

const initialState = {
  filters: {
    dates: { start: 1900, end: parseInt((new Date()).getFullYear()) },
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
  lists: {
    awards: [],
    genres: []
  },
  movies: {
    body: {},
    results: []
  }
}

export default function rootReducer(state = initialState, action) {
  if (action.reset) {
    state = {...state, filters: initialState.filters, movies: initialState.movies };
  }
  return {
    filters: filtersReducer(state.filters,action,initialState.filters),
    movies: moviesReducer(state.movies, action),
    lists: listsReducer(state.lists, action)
  }
}
