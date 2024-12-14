import { NavLink } from "react-router-dom";
import { CONFIGURATION_USER_ACCESS_FEATURE } from "../helpers/const-service";
import CrudService from "./crud-service";
export default class FeatureService extends CrudService {
  url = CONFIGURATION_USER_ACCESS_FEATURE;
}
