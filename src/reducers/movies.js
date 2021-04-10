const moviesReducer = (state, action) => {
  switch (action.type) {
    case "movies/update":
      let results = state.results.map(e => {
        if (e.id === action.payload.id) {
          e[action.payload.property] = action.payload.value;
        }
        return e;
      })
      return {
        ...state,
        results
      }
    case "movies/nextPage":
      return {
        ...state,
        results: [...state.results, ...action.payload]
      }
    case "movies/setResults":
      return {
        ...state,
        results: action.payload
      }
    case "movies/setBody":
      return {
        ...state,
        body: action.payload
      }
    default:
      return state
  }
}

export default moviesReducer;
