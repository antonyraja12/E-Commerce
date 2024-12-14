import React, { Component, createRef } from "react";

import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import { ProductService } from "../../services/product-services";
import { DateTimeFormat } from "../../utils/helper";
class ShiftPlanningForm extends Component {
  state = { isProductOptionLoading: false, productOption: [] };
  productService = new ProductService();
  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  componentDidMount() {
    this.setState((state) => ({ ...state, isProductOptionLoading: true }));
    this.productService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          productOption: data.map((e) => ({
            label: e.productName,
            value: e.productId,
          })),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isProductOptionLoading: false }));
      });
  }
  onFinish = (value) => {
    this.props.submit(value);
  };
  render() {
    const { isProductOptionLoading, productOption } = this.state;
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
          name="productId"
          label="Product"
          rules={[{ required: true, message: "Please select product" }]}
        >
          <Select
            options={productOption}
            loading={isProductOptionLoading}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please input quantity" }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="salesOrderNo"
          label="Sales Order No"
          rules={[{ required: true, message: "Please enter SO.No" }]}
        >
          <Input />
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

export default ShiftPlanningForm;
