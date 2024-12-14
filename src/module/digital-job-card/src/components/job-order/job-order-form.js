import React, { Component, createRef } from "react";
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import dayjs from "dayjs";
import { SaleOrderService } from "../../services/sale-order-service";

class JobOrderForm extends Component {
  state = { isProductOptionLoading: false, productOption: [] };
  orderService = new SaleOrderService();
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.state = {
      pendingQuantity: 0,
    };
  }
  componentDidMount() {
    this.setState((state) => ({ ...state, isOrderOptionLoading: true }));
    this.orderService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          orderOption: data.map((e) => ({
            label: e.saleOrderNumber,
            value: e.saleOrderId,
            productName: e.productName,
            productId: e.productId,
            pendingQuantity: e.pendingQuantity,
          })),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isOrderOptionLoading: false }));
      });
  }

  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };
  orderChange = (value, data) => {
    this.ref.current.setFieldsValue({
      productName: data.productName,
      productId: data.productId,
      pendingQuantity: data.pendingQuantity,
    });
    this.setState((state) => ({
      ...state,
      pendingQuantity: data.pendingQuantity,
    }));
  };
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  multipleOfThreeValidator = (rule, value) => {
    if (value > this.state.pendingQuantity) {
      return Promise.reject("Quantity must be less than pending quantity");
    }

    if (value % 3 !== 0) {
      return Promise.reject("Quantity must be a multiple of 3");
    }
    return Promise.resolve();
  };
  disabledTime = (current) => {
    if (current && current.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      const currentSecond = dayjs().second();

      return {
        disabledHours: () =>
          Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => hour < currentHour
          ),
        disabledMinutes: (selectedHour) => {
          if (selectedHour === currentHour) {
            return Array.from({ length: 60 }, (_, i) => i).filter(
              (minute) => minute < currentMinute
            );
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          if (
            selectedHour === currentHour &&
            selectedMinute === currentMinute
          ) {
            return Array.from({ length: 60 }, (_, i) => i).filter(
              (second) => second < currentSecond
            );
          }
          return [];
        },
      };
    }
    return {};
  };

  // render() {
  //   const { isOrderOptionLoading, orderOption } = this.state;
  //   return (
  //     <Form
  //       ref={this.ref}
  //       onFinish={this.onFinish}
  //       labelCol={{ span: 8 }}
  //       wrapperCol={{ span: 16 }}
  //       disabled={this.props.mode === "view"}
  //     >
  //       <Row gutter={10}>
  //         <Col xs={24} sm={12} md={12}>
  //           <Form.Item
  //             label="Sales Order No"
  //             name="saleOrderId"
  //             labelCol={{ span: 24 }}
  //             wrapperCol={{ span: 24 }}
  //             rules={[
  //               { required: true, message: "Please select sale order number" },
  //             ]}
  //           >
  //             <Select
  //               options={orderOption}
  //               loading={isOrderOptionLoading}
  //               onChange={this.orderChange}
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12} md={12}>
  //           <Form.Item
  //             name="productName"
  //             label="Product Name"
  //             labelCol={{ span: 24 }}
  //             wrapperCol={{ span: 24 }}
  //           >
  //             <Input disabled />
  //           </Form.Item>
  //           <Form.Item name="productId" hidden>
  //             <Input disabled />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //       <span>Pending quantity 100</span>
  //       <Row gutter={10}>
  //         <Col xs={12} sm={12} md={8}>
  //           <Form.Item
  //             name="jobOrderNumber"
  //             label="JO Number"
  //             rules={[
  //               { required: true, message: "Please enter job order number" },
  //             ]}
  //             labelCol={{ span: 24 }}
  //             wrapperCol={{ span: 24 }}
  //           >
  //             <Input />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={12} sm={12} md={8}>
  //           <Form.Item
  //             name="orderQuantity"
  //             label="Quantity"
  //             rules={[
  //               { required: true, message: "Please input quantity" },
  //               { validator: this.multipleOfThreeValidator },
  //             ]}
  //             labelCol={{ span: 24 }}
  //             wrapperCol={{ span: 24 }}
  //           >
  //             <InputNumber min={1} style={{ width: "100%" }} />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={24} md={8} lg={8}>
  //           <Form.Item
  //             name="startTime"
  //             label="Start Time"
  //             rules={[{ required: true, message: "Please enter Start time" }]}
  //             labelCol={{ span: 24 }}
  //             wrapperCol={{ span: 24 }}
  //           >
  //             <DatePicker
  //               format="YYYY-MM-DD HH:mm:ss"
  //               showTime
  //               disabledTime={this.disabledTime}
  //               disabledDate={this.disabledDate}
  //             />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  render() {
    const { isOrderOptionLoading, orderOption } = this.state;
    return (
      <Form
        ref={this.ref}
        onFinish={this.onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        disabled={this.props.mode === "view"}
        layout="horizontal"
      >
        <Form.Item
          label="Sales Order No"
          name="saleOrderId"
          wrapperCol={{ md: 10 }}
          rules={[
            { required: true, message: "Please select sale order number" },
          ]}
        >
          <Select
            options={orderOption}
            loading={isOrderOptionLoading}
            onChange={this.orderChange}
          />
        </Form.Item>

        <Form.Item name="productName" label="Product Name">
          <Input disabled />
        </Form.Item>
        <Form.Item name="productId" hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item name="pendingQuantity" label="Pending Quantity">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item
          name="orderQuantity"
          label="Quantity"
          rules={[
            { required: true, message: "Please input quantity" },
            { validator: this.multipleOfThreeValidator },
          ]}
        >
          <InputNumber min={3} max={12} step={3} />
        </Form.Item>

        <Form.Item
          name="jobOrderNumber"
          label="JO Number"
          wrapperCol={{ md: 10 }}
          rules={[{ required: true, message: "Please enter job order number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select Start time" }]}
        >
          <DatePicker
            format="DD-MM-YYYY HH:mm:ss"
            showTime
            disabledTime={this.disabledTime}
            disabledDate={this.disabledDate}
          />
        </Form.Item>
      </Form>
    );
  }
}

export default JobOrderForm;
