import React, { Component, createRef } from "react";

import { DatePicker, Form, InputNumber } from "antd";
import { DateTimeFormat } from "../../utils/helper";
class ShiftPlanningProduction extends Component {
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
          name="producedQuantity"
          label="Produced Quantity"
          rules={[
            { required: true, message: "Please select produced quantity" },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="rejectedQuantity"
          label="Rejected Quantity"
          rules={[
            { required: true, message: "Please input rejected quantity" },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="actualStartTime"
          label="Actual Start Time"
          rules={[
            { required: true, message: "Please select actual start time" },
          ]}
        >
          <DatePicker format={DateTimeFormat} showTime />
        </Form.Item>
        <Form.Item
          name="actualEndTime"
          label="Actual End Time"
          rules={[{ required: true, message: "Please select actual end time" }]}
        >
          <DatePicker format={DateTimeFormat} showTime />
        </Form.Item>
      </Form>
    );
  }
}

export default ShiftPlanningProduction;
