import { getData } from "../helper/helper";
export default class SeriesBuilder {
  static graph(e, data, propertyKey) {
    const properties = e.barChartProperty;

    return (
      properties?.barChartSeriesProperty?.map((el) => ({
        name: el.name,
        data:
          data && el.yaxisKey && propertyKey
            ? getData(data, propertyKey).map((e) => e[el.yaxisKey])
            : [],
      })) ?? []
    );
  }
  static chart(e, data, propertyKey) {
    const properties = e.barChartProperty;

    return (
      properties?.barChartSeriesProperty?.map((el) => ({
        name: el.name,
        data:
          data && el.yaxisKey && propertyKey
            ? getData(data, propertyKey).map((e) => e[el.yaxisKey])
            : [],
      })) ?? []
    );
  }
}
