import { Form, Input, InputNumber, Radio, Select } from "antd";
import React, { Component, createRef } from "react";

import { ProductService } from "../../services/product-services";

class ComponentMasterForm extends Component {
  state = {
    isRetrieveLoading: false,
    isLoading: false,
    isSaving: false,
    machineOption: [],
  };

  // machineMasterService = new MachineMasterService();
  productService = new ProductService();
  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  componentDidMount() {
    this.setState((state) => ({ ...state, isProductLoading: true }));
    this.productService
      .list({ status: true })
      .then(({ data }) => {
        let productOption = data.map((e) => ({
          value: e.productId,
          label: e.productName,
        }));
        this.setState((state) => ({ ...state, productOption: productOption }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isProductLoading: false }));
      });
    // this.machineMasterService.list({ status: true }).then(({ data }) => {
    //   let machineOption = data.map((e) => ({
    //     value: e.machineId,
    //     label: e.machineName,
    //   }));
    //   this.setState((state) => ({ ...state, machineOption: machineOption }));
    // });
  }

  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };
  render() {
    const { productOption, isProductLoading } = this.state;
    return (
      <>
        <Form
          labelAlign="left"
          style={{ maxWidth: "700px" }}
          ref={this.ref}
          onFinish={this.onFinish}
          layout="horizontal"
          initialValues={{ status: true, componentRoutings: [{}] }}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            wrapperCol={{
              span: 12,
            }}
            name="productId"
            label="Product"
            rules={[
              {
                required: true,
                message: "Please select product",
              },
            ]}
          >
            <Select loading={isProductLoading} options={productOption} />
          </Form.Item>
          <Form.Item
            name="componentName"
            label="Component Name"
            rules={[
              {
                required: true,
                message: "Please enter component name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 10,
            }}
            name="componentNumber"
            label="Component Number"
            rules={[
              {
                required: true,
                message: "Please enter component number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sequenceNumber"
            label="Sequence Number"
            rules={[
              {
                required: true,
                message: "Please enter sequence number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: "Please enter quantity",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          {/* <Form.Item
            name="componentMode"
            label="Mode"
            wrapperCol={{
              span: 6,
            }}
            rules={[{ required: true, message: "Please select mode" }]}
          >
            <Select options={[{ value: "Component" }, { value: "Assembly" }]} />
          </Form.Item> */}
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
      </>
    );
  }
}

export default ComponentMasterForm;
