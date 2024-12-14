import { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Radio,
  Divider,
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
} from "antd";
import { getData } from "../../helper/helper";

function BarChartProperties(props) {
  const { data, propertyKey } = props;
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
    setOptions(options);
  }, [data, propertyKey]);
  return (
    <>
      {/* <Form.Item name={["barChartProperty", "type"]} label="Type">
        <Select options={graphTypeOption} />
      </Form.Item> */}
      {props.widgetType === "BarChart" && (
        <Form.Item name={["barChartProperty", "direction"]} label="Direction">
          <Radio.Group
            options={[
              { label: "Horizontal", value: "Horizontal" },
              { label: "Vertical", value: "Vertical" },
            ]}
          />
        </Form.Item>
      )}

      <Form.List name={["barChartProperty", "barChartSeriesProperty"]}>
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
                  name={[name, "yaxisKey"]}
                  label="Value Key"
                  rules={[{ required: true, message: "Enter property name" }]}
                >
                  <AutoComplete options={options} />
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
      <h5>X-axis Property</h5>
      <Form.Item
        name={["barChartProperty", "xaxis", "propertyKey"]}
        label="Category Key"
      >
        <AutoComplete options={options} />
      </Form.Item>
      {props.widgetType !== "RadarChart" && (
        <>
          <Form.Item
            name={["barChartProperty", "xaxis", "category"]}
            label="Category"
          >
            <Select
              options={[
                { value: "category", label: "Category" },
                { value: "datetime", label: "Datetime" },
                { value: "numeric", label: "Numeric" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Tick Amount"
            name={["barChartProperty", "xaxis", "tickAmount"]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Tick Placement"
            name={["barChartProperty", "xaxis", "tickPlacement"]}
          >
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                { value: "between", label: "Between" },
                { value: "on", label: "On" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name={["barChartProperty", "xaxis", "position"]}
          >
            <Radio.Group
              buttonStyle="solid"
              optionType="button"
              options={[
                { value: "bottom", label: "Bottom" },
                { value: "top", label: "Top" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Show Label"
            name={["barChartProperty", "xaxis", "showLabel"]}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="X axis Title"
            name={["barChartProperty", "xaxis", "title"]}
          >
            <Input />
          </Form.Item>
        </>
      )}
    </>
  );
}

export default BarChartProperties;
