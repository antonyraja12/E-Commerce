// import counterReducer from "./counter";
import loggedReducer from "./isLogged";
import notificationReducer from "./notification-reducer";
import mainDashboardReducer from "./main-dashboard";
// import productModuleReducer from "../../module/digital-job-card/src/store/reducers/product-module-reducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  loggedReducer,
  notificationReducer,
  mainDashboardReducer,
  // productModuleReducer,
});

export default allReducers;
