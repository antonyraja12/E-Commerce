import { Form, Input, Radio } from "antd";
import React, { Component, createRef } from "react";
import { ComponentMasterService } from "../../services/component-master-service";

class ProductMasterForm extends Component {
  state = {
    componentOption: [],
    componentOptionLoading: false,
  };
  componentMasterService = new ComponentMasterService();
  constructor(props) {
    super(props);
    this.ref = createRef();
  }
  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };
  componentDidMount() {
    this.setState((state) => ({ ...state, componentOptionLoading: true }));
    this.componentMasterService
      .list({ status: true })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          componentOption: data.map((e) => ({
            value: e.componentId,
            label: e.componentName,
          })),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, componentOptionLoading: false }));
      });
  }
  render() {
    return (
      <>
        <Form
          ref={this.ref}
          onFinish={this.onFinish}
          layout="horizontal"
          labelAlign="left"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{ status: true, componentRoutings: [{}] }}
        >
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[
              {
                required: true,
                message: "Please enter product name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="itemNumber"
            label="Item Number"
            rules={[
              {
                required: true,
                message: "Please enter item number",
              },
            ]}
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

          <Form.Item
            name="itemDescription"
            label="Item Description"
            rules={[
              {
                required: true,
                message: "Please enter item description",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default ProductMasterForm;
