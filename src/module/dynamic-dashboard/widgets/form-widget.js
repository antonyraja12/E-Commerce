import { DatePicker, Form, Input, Select } from "antd";
import BaseWidget from "./base-widget";
import FilterBuilder from "../filter/filter-builder";

const field = [
  { name: "ahId", label: "Entity", element: "Input" },
  {
    name: "entityId",
    label: "Entity",
    element: "Select",
    mode: "entity",
  },
  {
    name: "assetId",
    label: "Asset",
    element: "Select",
    mode: "asset",
  },
  { name: "from_date", label: "From Date", element: "Date" },
  { name: "to_date", label: "To Date", element: "Date" },
];

export class FormWidget extends BaseWidget {
  // this.user = new USerServ
  widgetStyle() {
    return {
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      borderRadius: "10px",
    };
  }

  onSubmit = (value) => {
    console.log(value);
  };
  renderElement = (element) => {
    let val;
    switch (element) {
      case "Input":
        val = <Input />;
        break;
      case "Select":
        val = <Select />;
        break;
      case "Date":
        val = <DatePicker />;
        break;
      default:
        break;
    }
    return val;
  };
  render() {
    const { style, properties } = this.props;
    return <FilterBuilder />;
  }
}
