import { ColorPicker, Form } from "antd";
import { useEffect, useState } from "react";
import { getData } from "../../helper/helper";
function CardProperties(props) {
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
        name={["cardProperty", "backgroundColor"]}
        label="Background Color"
        getValueFromEvent={(val) => {
          return val.toHexString();
        }}
      >
        <ColorPicker
          allowClear
          format="hex"
          defaultFormat="hex"
          showText
          onChange={(value, hex) => {
            // console.log(value, hex, value.toHexString());
          }}
        />
      </Form.Item>

      <Form.Item
        name={["cardProperty", "fontColor"]}
        label="Font Color"
        getValueFromEvent={(val) => {
          return val.toHexString();
        }}
      >
        <ColorPicker allowClear showText format="hex" />
      </Form.Item>
    </>
  );
}

export default CardProperties;
