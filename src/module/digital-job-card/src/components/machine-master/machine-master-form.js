import React, { Component, createRef } from "react";
import { Radio, Form, Input, InputNumber, Select } from "antd";
import { DateTimeFormat } from "../../utils/helper";

class MachineMasterForm extends Component {
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
          name="machineName"
          label="Resource Name"
          rules={[{ required: true, message: "Please input machine name" }]}
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

export default MachineMasterForm;
