import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TreeSelect,
  Typography,
} from "antd";
import dayjs from "dayjs";
import OptionService from "../services/option-service";
export const renderElement = (ele, filterOption, option) => {
  let e = ele?.toLowerCase();
  let element;
  let options = [];
  if (filterOption) {
    if (filterOption?.dataSource === 2) {
      options = filterOption.options;
    } else {
      if (ele === "TreeSelect") {
        const { labelKey, parentKey, primaryKey, valueKey } = filterOption;
        if (primaryKey && parentKey) {
          let config = {
            label: labelKey,
            value: valueKey,
            primary: primaryKey,
            parent: parentKey,
          };
          options = OptionService.convertToTree(
            option[filterOption.type],
            null,
            config
          );
        }
      } else {
        options = mapData(
          option[filterOption.type],
          filterOption.labelKey,
          filterOption.valueKey
        );
      }
    }
  }

  switch (e) {
    case "treeselect":
      element = <TreeSelect treeData={options} allowClear />;
      break;
    case "select":
      element = <Select options={options} allowClear />;
      break;
    case "radio":
      element = <Radio options={options} />;
      break;
    case "checkbox":
      element = <Checkbox.Group options={options} />;
      break;
    case "date":
      element = <DatePicker format="DD-MM-YYYY" />;
      break;
    case "input":
    default:
      element = <Input />;
      break;
  }
  return element;
};

export const getOptionFn = (mode) => {
  let optionFn;
  switch (mode) {
    case "user":
      optionFn = OptionService.getUsers();
      break;
    case "asset":
      optionFn = OptionService.getAssets();
      break;
    case "entity":
      optionFn = OptionService.getEntities();
      break;
    default:
      break;
  }
  return optionFn;
};

export const renderField = (
  { element, name, label, width, filterOption },
  option = {}
) => {
  return (
    <>
      <Form.Item name={name} label={label} style={{ width: width }}>
        {renderElement(element, filterOption, option)}
      </Form.Item>
    </>
  );
};
const mapData = (source, label, value) => {
  return source?.map((e) => ({ label: e[label], value: e[value] }));
};
