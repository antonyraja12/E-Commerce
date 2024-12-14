import moment from "moment";
import { Link } from "react-router-dom";
export const dayDate = moment().format("MM/DD/YYYY"); // '12/29/2021'//
export const weekDate = moment().format("MM/DD/YYYY"); // '12/29/2021'//
export const monthDate = moment().format("MM/DD/YYYY"); // '12/29/2021'//
export const yearDate = moment().format("MM/DD/YYYY"); // '12/29/2021'//
// export const START_TIME = moment('01/07/2022 18:00:00', 'DD/MM/YYYY HH:mm:ss').subtract(3, 'h').format("X")
// export const END_TIME = moment('01/07/2022 18:00:00', 'DD/MM/YYYY HH:mm:ss').format("X")

export const START_TIME = moment().subtract(3, "h").format("X");
export const END_TIME = moment().format("X");
// export function customSelectFilter(input, option) {
//   const optionValue = String(option.props.children).toLowerCase();
//   const inputValue = input.toLowerCase();

//   return optionValue === inputValue || optionValue.startsWith(inputValue);
// }
export function customSelectFilter(input, option) {
  const optionValue = String(option.props.children).toLowerCase();
  const inputValue = input.toLowerCase();

  return optionValue === inputValue || optionValue.startsWith(inputValue);
}
export const numberFormat = (val) => {
  if (!isNaN(val)) {
    return val?.toFixed(1);
  }
  return "";
};

export const breadcrumbRender = (route, params, routes, paths) => {
  return paths.indexOf(route.path) === routes.length - 1 ? (
    <span>{route.title}</span>
  ) : (
    <Link to={route.path}>{route.title}</Link>
  );
};
