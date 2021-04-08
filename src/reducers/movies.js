const moviesReducer = (state, action) => {
  switch (action.type) {
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
