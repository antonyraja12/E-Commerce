import moment from "moment";

export const baseUrl = process.env.REACT_APP_API;
export const djcUrl = process.env.REACT_APP_DJC_API;

export const suggestionAI = process.env.REACT_APP_SUGGESTION_API;
export const mapKey = process.env.REACT_APP_MAP_KEY;
export const doc360Url = process.env.REACT_APP_DOC360_API;
export const webSocketUrl = () => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem).token : null;
  return token
    ? `${baseUrl + process.env.REACT_APP_SETTING_API}/ws?token=${token}`
    : `${baseUrl + process.env.REACT_APP_SETTING_API}/ws`;
};

export const rootUrl = baseUrl + "/api";

export const publicUrl = `${
  baseUrl + process.env.REACT_APP_SETTING_API
}/public`;
export const graphqlUrl = `${
  baseUrl + process.env.REACT_APP_SETTING_API
}/graphql`;

export const remoteAsset = (url) => {
  return `${publicUrl}${url}`;
};

export const DatePickerformat = "DD-MM-YYYY";
export const dateFormat = (date) => {
  return date ? moment(date).format("DD-MM-yyyy") : null;
};
export const dateTimeFormat = (date) => {
  return date ? moment(date).format("DD-MM-yyyy hh:mm:ss A") : null;
};
export const timeFormat = (date) => {
  return date ? moment(date).format("hh:mm A") : null;
};
