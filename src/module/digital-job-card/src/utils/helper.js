import dayjs from "dayjs";
// export const rootUrl = "/djc/api";
import { baseUrl } from "../../../../helpers/url";
export const rootUrl = baseUrl;
export const DateFormat = (date) => {
  return date ? dayjs(date).format("DD-MM-YYYY") : null;
};
export const TimeFormat = (date) => {
  return date ? dayjs(date).format("hh:mm A") : null;
};
export const DateTimeFormat = (date) => {
  return date ? dayjs(date).format("DD-MM-YYYY hh:mm:ss A") : null;
};

export const filterOption = (input, option) =>
  (option?.label.toLowerCase() ?? "").includes(input.toLowerCase());
