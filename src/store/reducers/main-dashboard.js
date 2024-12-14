const defaultState = {
    ahId:null,
    selectedAssetId:null,
    selectedAhId:null,
  };
  
  const mainDashboardReducer = (state = defaultState, action) => {
    switch (action.type) {
      case "SET_AHID":
        localStorage.setItem("AHID", parseInt(action.data));
        return {
          ...state,
          ahId: parseInt(action.data),
        };
      case "SET_ASSETID":
        localStorage.setItem("SELECTED_AHID", parseInt(action.data.ahId));
        localStorage.setItem("SELECTED_ASSETID", parseInt(action.data.assetId));
        return {
          ...state,
          selectedAhId: parseInt(action.data.ahId),
          selectedAssetId: parseInt(action.data.assetId),
        };
      default:
        return state;
    }
  };
  export default mainDashboardReducer;
  