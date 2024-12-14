import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import { alignOption, getData } from "../../helper/helper";
import { useEffect, useState } from "react";

function TableProperties(props) {
  const [options, setOptions] = useState([]);
  const { data, propertyKey, propertyOptions } = props;
  useEffect(() => {
    let d = getData(data, propertyKey);

    let options = [];
    for (let x in d) {
      for (let y in d[x]) {
        // console.log(y);
        options.push({
          value: y,
          label: y,
        });
      }
      break;
    }
    setOptions(options);
  }, [data, propertyKey, propertyOptions]);
  return (
    <>
      <Form.Item
        name={["tableProperty", "showHeader"]}
        label="Show Header"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={["tableProperty", "sticky"]}
        label="Sticky"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={["tableProperty", "bordered"]}
        label="Bordered"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={["tableProperty", "pagination"]}
        label="Pagination"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Divider />
      <h5>Columns</h5>
      <Form.List name={["tableProperty", "columns"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <>
                <Form.Item
                  name={[name, "title"]}
                  label="Title"
                  rules={[{ required: true, message: "Title is required" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={[name, "dataIndex"]}
                  label="Data Index"
                  rules={[{ required: true, message: "Key is required" }]}
                >
                  <AutoComplete options={options} />
                </Form.Item>

                <Form.Item name={[name, "key"]} label="Key">
                  <AutoComplete options={options} />
                </Form.Item>
                <Form.Item name={[name, "align"]} label="Align">
                  <Radio.Group optionType="button" options={alignOption} />
                </Form.Item>
                <Form.Item
                  wrapperCol={{ span: 8 }}
                  name={[name, "width"]}
                  label="Width"
                >
                  <Input />
                </Form.Item>
                <Form.Item name={[name, "fixed"]} label="Fixed">
                  <Select
                    allowClear
                    options={[
                      { label: "Left", value: "left" },
                      { label: "Right", value: "right" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={[name, "render"]} label="Render">
                  {/* <>
                    <span>{"(text,record,index)=>{"}</span> */}
                  <Input.TextArea rows={5} />
                  {/* <span>{"}"}</span>
                  </> */}
                </Form.Item>

                <Form.Item
                  name={[name, "filter"]}
                  label="Enable Filter"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  name={[name, "sorting"]}
                  label="Enable Sorting"
                  valuePropName="checked"
                >
                  <Checkbox />
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

            <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "right" }}>
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

export default TableProperties;
