import React, { Component, createRef } from "react";

import { Form, Input, Radio } from "antd";
class OperatorMasterForm extends Component {
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
          name="operatorName"
          label="Operator Name"
          rules={[{ required: true, message: "Please input shift name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please select Shift Date" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="labourCode"
          label="Labour Code"
          rules={[{ required: true, message: "Please select start time" }]}
        >
          <Input />
        </Form.Item>
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

export default OperatorMasterForm;
