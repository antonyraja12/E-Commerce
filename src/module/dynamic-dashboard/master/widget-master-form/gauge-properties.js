import { InputNumber, Checkbox, Form, Input, Select } from "antd";
import { gaugeTypeOption, getData } from "../../helper/helper";
import { useState, useEffect } from "react";
function GaugeProperties(props) {
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
        name={["gaugeProperty", "type"]}
        label="Type"
        rules={[{ required: true }]}
      >
        <Select options={gaugeTypeOption} />
      </Form.Item>

      <Form.Item
        name={["gaugeProperty", "min"]}
        label="Min"
        rules={[{ required: true }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={["gaugeProperty", "max"]}
        label="Max"
        rules={[{ required: true }]}
      >
        <InputNumber />
      </Form.Item>
    </>
  );
}

export default GaugeProperties;
