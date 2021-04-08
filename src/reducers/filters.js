const filtersReducer = (state, action) => {
  const domain = action.type.split("/")[1];
  const type = action.type.split("/")[2];
  if (["awards","genres"].includes(domain)) {
    if (type === "add") {
      return {
        ...state,
        [domain]: [...state[domain], action.payload]
      }
    } else if (type === "remove") {
      return {
        ...state,
        [domain]: state[domain].filter(e => e !== action.payload)
      }
    }
  } else if (domain === "persons") {
    return {
      ...state,
      persons: { ...state.persons, [type]: action.payload }
    }
  }
  if (type === "set") {
    return {
      ...state,
      [domain]: action.payload
    }
  }
  return state;
}

export default filtersReducer;
