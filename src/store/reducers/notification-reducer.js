const defaultState = {
  list: [],
  count: 0,
};

const notificationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "NOTIFICATION_LIST_":
      return {
        ...state,
        list: action.data,
        count: action.data?.length,
      };
    case "UPDATE_NOTIFICATION_STATUS_":
      return {
        ...state,
        list: action.data,
      };

    default:
      return state;
  }
};
export default notificationReducer;
