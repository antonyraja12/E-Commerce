export const setProduct = (id) => {
  return (dispatch) => {
    dispatch({ type: "SET_PRODUCT_", data: id });
    dispatch({ type: "SET_COMPONENT_", data: null });
  };
};

export const setComponent = (id) => {
  return (dispatch) => {
    dispatch({ type: "SET_COMPONENT_", data: id });
  };
};
