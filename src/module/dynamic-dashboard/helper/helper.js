import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  CreditCardOutlined,
  TableOutlined,
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { createContext } from "react";

export const DashboardContext = createContext();
export const WidgetContext = createContext();
const getDataFromNestedObject = (obj, ...keys) => {
  let result = obj;
  for (const key of keys) {
    if (result?.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return undefined; // Key not found, return undefined or handle the error accordingly.
    }
  }
  return result;
};

export const getData = (obj, key) => {
  if (!key) return undefined;
  let keys = key?.split(".");
  if (keys?.length > 0) return getDataFromNestedObject(obj, ...keys);
  return undefined;
};

export const fieldType = [
  {
    label: "Input",
    value: "Input",
  },
  {
    label: "Select",
    value: "Select",
  },
  {
    label: "Date",
    value: "Date",
  },
  {
    label: "Radio",
    value: "Radio",
  },
  {
    label: "Checkbox",
    value: "Checkbox",
  },
  {
    label: "Tree Select",
    value: "TreeSelect",
  },
];

export const widgetTypeOption = [
  {
    label: "Gauge",
    value: "Gauge",
    icon: <DashboardOutlined />,
  },
  {
    label: "Mixed Chart",
    value: "Graph",
    icon: <AreaChartOutlined />,
  },
  {
    label: "Pie Chart",
    value: "PieChart",
    icon: <PieChartOutlined />,
  },
  {
    label: "Donut Chart",
    value: "DonutChart",
    icon: <PieChartOutlined />,
  },
  {
    label: "Polar Area Chart",
    value: "PolarAreaChart",
    icon: <PieChartOutlined />,
  },
  {
    label: "Radar Chart",
    value: "RadarChart",
    icon: <RadarChartOutlined />,
  },
  {
    label: "Card",
    value: "Card",
    icon: <CreditCardOutlined />,
  },
  {
    label: "Table",
    value: "Table",
    icon: <TableOutlined />,
  },
  {
    label: "Bar Chart",
    value: "BarChart",
    icon: <BarChartOutlined />,
  },
  {
    label: "Line Chart",
    value: "LineChart",
    icon: <LineChartOutlined />,
  },
  {
    label: "Area Chart",
    value: "AreaChart",
    icon: <AreaChartOutlined />,
  },
];
widgetTypeOption.sort((a, b) => a.label?.localeCompare(b.label));
export const gaugeTypeOption = [
  {
    label: "Grafana",
    value: "grafana",
  },
  {
    label: "Semicircle",
    value: "semicircle",
  },
  {
    label: "Radial",
    value: "radial",
  },
];

export const chartTypeOption = [
  {
    label: "Pie",
    value: "pie",
  },
  {
    label: "Donut",
    value: "donut",
  },
];

export const graphTypeOption = [
  { value: "line", label: "Line Graph" },
  { value: "bar", label: "Bar Graph" },
  { value: "area", label: "Area Graph" },
];
export const alignOption = [
  { value: "LEFT", label: <AlignLeftOutlined /> },
  { value: "CENTER", label: <AlignCenterOutlined /> },
  { value: "RIGHT", label: <AlignRightOutlined /> },
];

export const preDefinedService = [
  {
    label: "Asset",
    value: "asset",
    fields: ["assetId", "assetName", "description", "latitude", "longitude"],
  },
  {
    label: "User",
    value: "user",
    fields: ["userId", "userName", "email", "contactNumber"],
  },
  {
    label: "Entity",
    value: "entity",
    fields: ["ahid", "ahname", "mode", "ahlevel", "ahparentId"],
  },
];
