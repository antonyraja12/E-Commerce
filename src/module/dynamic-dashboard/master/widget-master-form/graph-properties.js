import { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Divider, Form, Input, Select } from "antd";
import { graphTypeOption, getData } from "../../helper/helper";

function GraphProperties(props) {
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
      <Form.List name="graphProperties">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <>
                <Form.Item
                  name={[name, "name"]}
                  label="Legend Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={[name, "type"]}
                  label="Type"
                  rules={[{ required: true }]}
                >
                  <Select options={graphTypeOption} />
                </Form.Item>
                <Form.Item
                  name={[name, "xaxis"]}
                  label="X axis key"
                  rules={[{ required: true }]}
                >
                  <Select options={options} />
                </Form.Item>
                <Form.Item
                  name={[name, "yaxis"]}
                  label="Y axis key"
                  rules={[{ required: true }]}
                >
                  <Select options={options} />
                </Form.Item>
                <Divider>
                  <Button
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                </Divider>
              </>
            ))}

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add New
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default GraphProperties;
