import { getData } from "../helper/helper";
export default class PropertyBuilder {
  static graph(e, data, propertyKey) {
    let type = "";

    switch (e.widgetType?.toLowerCase()) {
      case "areachart":
        type = "area";
        break;
      case "linechart":
        type = "line";
        break;
      case "barchart":
        type = "bar";
        break;
      case "radarchart":
        type = "radar";
        break;
      default:
        break;
    }
    return {
      ...e.barChartProperty,
      type: type,
      categories:
        data && e.barChartProperty?.xaxis?.propertyKey && propertyKey
          ? getData(data, propertyKey).map(
              (el) => el[e.barChartProperty.xaxis.propertyKey]
            )
          : [],
    };
  }
  static chart(e, data, propertyKey) {
    let type = "";

    switch (e.widgetType?.toLowerCase()) {
      case "piechart":
        type = "pie";
        break;
      case "polarareachart":
        type = "polarArea";
        break;
      case "donutchart":
        type = "donut";
        break;
      default:
        type = e.chartProperty?.type;
        break;
    }

    return {
      ...e.chartProperty,
      type: type,
      data:
        data && propertyKey
          ? getData(data, propertyKey)?.map((ele) => ({
              label: getData(ele, e.chartProperty?.labelKey),
              value: getData(ele, e.chartProperty?.valueKey),
            }))
          : [],
    };
  }
}
