const defaultState = {
  productId: null,
  componentId: null,
};

const productModuleReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_PRODUCT_":
      return { ...state, productId: action.data };
    case "SET_COMPONENT_":
      return { ...state, componentId: action.data };
    default:
      return state;
  }
};
export default productModuleReducer;
