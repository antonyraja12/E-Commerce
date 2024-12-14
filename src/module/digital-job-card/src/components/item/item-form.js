import React, { Component, createRef } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from "antd";
import { ProductService } from "../../services/product-services";
import { DateTimeFormat } from "../../utils/helper";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";

class ItemForm extends Component {
  state = { isProductOptionLoading: false, productOption: [] };
  // productService = new ProductService();

  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  // componentDidMount() {
  //   this.setState((state) => ({ ...state, isProductOptionLoading: true }));
  //   this.productService
  //     .list()
  //     .then(({ data }) => {
  //       this.setState((state) => ({
  //         ...state,
  //         productOption: data.map((e) => ({
  //           label: e.productName,
  //           value: e.productId,
  //         })),
  //       }));
  //     })
  //     .finally(() => {
  //       this.setState((state) => ({ ...state, isProductOptionLoading: false }));
  //     });
  // }

  // onValuesChange = (changedValues, allValues) => {
  //   const { quantity, unitPrice } = allValues;
  //   if (quantity && unitPrice) {
  //     this.ref.current.setFieldsValue({
  //       extPrice: quantity * unitPrice,
  //     });
  //   }
  // };

  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };

  // multipleOfThreeValidator = (rule, value) => {
  //   if (value % 3 !== 0) {
  //     return Promise.reject("Quantity must be a multiple of 3");
  //   }
  //   return Promise.resolve();
  // };

  render() {
    const { isProductOptionLoading, productOption } = this.state;
    return (
      <Form
        ref={this.ref}
        onFinish={this.onFinish}
        // onValuesChange={this.onValuesChange}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ status: true }}
        disabled={this.props.mode === "view"}
      >
        <Row gutter={10}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="itemName"
              label="Item Name"
              rules={[{ required: true, message: "Please enter item name" }]}
              // labelCol={{ span: 24 }}
              // wrapperCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="itemCode"
              label="Item Code"
              rules={[{ required: true, message: "Please enter item code" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="barCode"
              label="Bar Code"
              rules={[{ required: true, message: "Please enter bar code" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: "Please input quantity" },
                // { validator: this.multipleOfThreeValidator },
              ]}
            >
              <InputNumber min={1} step={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="action"
              label="Action"
              rules={[{ required: true, message: "Please enter action" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
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
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ItemForm;
