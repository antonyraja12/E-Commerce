import React, { Component, createRef } from "react";

import { DatePicker, Form, Input } from "antd";
import { DateTimeFormat } from "../../utils/helper";
class ShiftMasterForm extends Component {
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
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Form.Item
          name="shiftName"
          label="Shift Name"
          rules={[{ required: true, message: "Please input shift name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="shiftDate"
          label="Shift Date"
          rules={[{ required: true, message: "Please select Shift Date" }]}
        >
          <DatePicker format={DateTimeFormat} showTime />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select start time" }]}
        >
          <DatePicker format={DateTimeFormat} showTime />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="End Time"
          rules={[{ required: true, message: "Please select end time" }]}
        >
          <DatePicker format={DateTimeFormat} showTime />
        </Form.Item>
      </Form>
    );
  }
}

export default ShiftMasterForm;
