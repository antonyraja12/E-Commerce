import moment from "moment";
export function dateFormat(date, format = "DD-MM-YYYY") {
  return moment(new Date(date)).format(format);
}
