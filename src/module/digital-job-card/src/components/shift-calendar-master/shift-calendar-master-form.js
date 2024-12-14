import React, { Component, createRef } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Button, Select, Divider, Radio } from "antd";
import { DateTimeFormat } from "../../utils/helper";
class ShiftCalendarMasterForm extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.ref = createRef();
  }
  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };

  render() {
    return (
      <Form
        ref={this.ref}
        onFinish={this.onFinish}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        <Form.Item
          name="day"
          label="Day"
          rules={[{ required: true, message: "Please select day" }]}
        >
          <Select
            options={[
              { value: "Sunday" },
              { value: "Monday" },
              { value: "Tuesday" },
              { value: "Wednesday" },
              { value: "Thursday" },
              { value: "Friday" },
              { value: "Saturday" },
            ]}
          />
        </Form.Item>
        <Form.List name="shiftCalendarDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, i) => (
                <>
                  {/* {i != 0 && <Divider />} */}
                  <Divider />
                  <Form.Item
                    name={[field.name, "shiftName"]}
                    label="Shift Name"
                    rules={[
                      { required: true, message: "Please enter shift Name" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "startTime"]}
                    label="Start Time"
                    rules={[
                      { required: true, message: "Please select start time" },
                    ]}
                  >
                    <DatePicker format={DateTimeFormat} showTime />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "endTime"]}
                    label="End Time"
                    rules={[
                      { required: true, message: "Please select end time" },
                    ]}
                  >
                    <DatePicker format={DateTimeFormat} showTime />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 6, span: 10 }}>
                    <Button
                      type="primary"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Shift
                    </Button>
                  </Form.Item>
                </>
              ))}

              <Form.Item wrapperCol={{ offset: 6 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Shift
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>In-Active</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  }
}

export default ShiftCalendarMasterForm;
