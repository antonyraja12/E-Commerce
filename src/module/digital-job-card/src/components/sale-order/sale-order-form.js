import React, { Component, createRef } from "react";
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { ProductService } from "../../services/product-services";
import { DateTimeFormat } from "../../utils/helper";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";

class SaleOrderForm extends Component {
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

  onValuesChange = (changedValues, allValues) => {
    const { orderQuantity, unitPrice } = allValues;
    if (orderQuantity && unitPrice) {
      this.ref.current.setFieldsValue({
        extPrice: orderQuantity * unitPrice,
      });
    }
  };

  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };

  multipleOfThreeValidator = (rule, value) => {
    if (value % 3 !== 0) {
      return Promise.reject("Quantity must be a multiple of 3");
    }
    return Promise.resolve();
  };

  render() {
    const { isProductOptionLoading, productOption } = this.state;
    return (
      <Form
        ref={this.ref}
        onFinish={this.onFinish}
        onValuesChange={this.onValuesChange}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // initialValues={{ orderDate: moment() }}
      >
        <Row gutter={10}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="orderDate"
              label="Order Date"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValue={moment()}
            >
              <DatePicker format={DateTimeFormat} showTime disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="saleOrderNumber"
              label="Sales Order No"
              rules={[{ required: true, message: "Please enter SO.No" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input disabled={this.props.id && true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="productId"
              label="Product Name"
              rules={[{ required: true, message: "Please select product" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                options={productOption}
                loading={isProductOptionLoading}
                allowClear
                disabled={this.props.id && true}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="buyerName"
              label="Buyer Name"
              rules={[{ required: true, message: "Please input Buyer Name" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="orderQuantity"
              label="Quantity"
              rules={[
                { required: true, message: "Please input quantity" },
                { validator: this.multipleOfThreeValidator },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber min={3} step={3} disabled={this.props.id && true} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="unitPrice"
              label="Unit Price"
              rules={[{ required: true, message: "Please input Unit Price" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="extPrice"
              label="Extended Price"
              rules={[
                { required: true, message: "Please input Extended Price" },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber min={1} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter Description" }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <TextArea />
        </Form.Item>
      </Form>
    );
  }
}

export default SaleOrderForm;
