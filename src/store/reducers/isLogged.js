const defaultState = {
  menuList: {},
  menuRefresh: true,
};

const loggedReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "MENU_LIST_":
      return { ...state, menuList: action.data };
    case "MENU_REFRESH_":
      return { ...state, menuRefresh: action.data };
    default:
      return state;
  }
};
export default loggedReducer;
