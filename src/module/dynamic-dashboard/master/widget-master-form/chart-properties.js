import { InputNumber, Checkbox, Form, AutoComplete, Select, Radio } from "antd";
import { alignOption, chartTypeOption, getData } from "../../helper/helper";
import { useState, useEffect } from "react";
function ChartProperties(props) {
  const { data, propertyKey, propertyOptions } = props;
  const [options, setOptions] = useState([]);
  useEffect(() => {
    let d = getData(data, propertyKey);
    let options = [];
    for (let x in d) {
      for (let y in d[x]) {
        options.push({
          value: y,
        });
      }
      break;
    }
    setOptions(propertyOptions);
  }, [data, propertyKey, propertyOptions]);
  return (
    <>
      <Form.Item
        name={["chartProperty", "labelKey"]}
        label="Lebel Property Key"
        rules={[{ required: true }]}
      >
        <AutoComplete options={options} />
      </Form.Item>
      <Form.Item
        name={["chartProperty", "valueKey"]}
        label="Value Property Key"
        rules={[{ required: true }]}
      >
        <AutoComplete options={options} />
      </Form.Item>
      <h1>Legend Property</h1>
      <Form.Item
        label="Show"
        name={["chartProperty", "legend", "show"]}
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item
        label="Font Size"
        name={["chartProperty", "legend", "fontSize"]}
      >
        <InputNumber min={6} max={30} step={1} />
      </Form.Item>
      <Form.Item
        label="Font Weight"
        name={["chartProperty", "legend", "fontWeight"]}
      >
        <InputNumber min={200} max={900} step={100} />
      </Form.Item>
      <Form.Item
        label="Position"
        name={["chartProperty", "legend", "position"]}
      >
        <Select
          options={[
            { value: "top", label: "Top" },
            { value: "right", label: "Right" },
            { value: "bottom", label: "Bottom" },
            { value: "left", label: "Left" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Align"
        name={["chartProperty", "legend", "horizontalAlign"]}
      >
        <Radio.Group optionType="button" options={alignOption} />
      </Form.Item>

      <Form.Item
        label="Show For Single Series"
        name={["chartProperty", "legend", "showForSingleSeries"]}
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item
        label="Show For Null Series"
        name={["chartProperty", "legend", "showForNullSeries"]}
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item
        label="Show For Zero Series"
        name={["chartProperty", "legend", "showForZeroSeries"]}
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item
        label="floating"
        name={["chartProperty", "legend", "floating"]}
        valuePropName="checked"
      >
        <Checkbox></Checkbox>
      </Form.Item>
    </>
  );
}

export default ChartProperties;
