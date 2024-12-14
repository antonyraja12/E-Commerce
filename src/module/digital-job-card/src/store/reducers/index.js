// import counterReducer from "./counter";
import productModuleReducer from "./product-module-reducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  productModuleReducer,
});

export default allReducers;
