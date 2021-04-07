const initialState = {
  filters: {
    dates: { start: 0, end: 0 },
    genres: [],
    awards: []
  }
}
const filtersReducer = (state, action) => {
  if (action.type === "filters/dates/set") {
    return {
      ...state,
      dates: action.payload
    }
  } else if (action.type === "filters/awards/add") {
    return {
      ...state,
      awards: [...state.awards, action.payload]
    }
  } else if (action.type === "filters/awards/remove") {
    return {
      ...state,
      awards: state.awards.filter(e => e !== action.payload)
    }
  } else if (action.type === "filters/awards/set") {
    return {
      ...state,
      awards: action.payload
    }
  } else if (action.type === "filters/genres/add") {
    return {
      ...state,
      genres: [...state.genres, action.payload]
    }
  } else if (action.type === "filters/genres/remove") {
    return {
      ...state,
      genres: state.genres.filter(e => e !== action.payload)
    }
  } else if (action.type === "filters/genres/set") {
    return {
      ...state,
      genres: action.payload
    }
  }
  return state;
}

export default function rootReducer(state = initialState, action) {
  // always return a new object for the root state

  return {
    filters: filtersReducer(state.filters,action)
  }
    // the value of `state.todos` is whatever the todos reducer returns
    //~ todos: todosReducer(state.todos, action),
    // For both reducers, we only pass in their slice of the state
    //~ filters: filtersReducer(state.filters, action)
}
