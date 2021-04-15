const listsReducer = (state, action) => {
  switch (action.type) {
    case "lists/awards":
      return { ...state, awards: action.payload };
    case "lists/genres":
      return { ...state, genres: action.payload };
    default:
      return state;
  }
}
export default listsReducer;
