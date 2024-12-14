import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { OperatorService } from "../../../services/djc/operator-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { SaleOrderService } from "../../../services/djc/sale-order-service";
import { MaterialService } from "../../../services/djc/material-service";

const SaleOrderForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const service = new SaleOrderService();
  const materialService = new MaterialService();

  useEffect(() => {
    if (modal.open) {
      fetchProductOption({ materialType: "Product" });
    }
  }, [modal.open]);

  useEffect(() => {
    if (modal.id) {
      onRetrieve(modal.id);
    }
  }, [modal.id]);
  const fetchProductOption = async (filter = {}) => {
    setIsLoading(true);
    try {
      const response = await materialService.list(filter);
      setProductOption(
        response.data?.map((e) => ({
          label: e.materialName,
          value: e.materialId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };
  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      message.error("Failed to fetch sale order");
    } finally {
      setIsLoading(false);
    }
  };
  const patchForm = (data) => {
    form.setFieldsValue({ ...data, soDate: moment(data.soDate) });
  };
  const onFinish = async (value) => {
    console.log(value, "value");
    let response;
    if (modal.id) {
      response = await service.update(value, modal.id);
    } else {
      response = await service.save(value);
    }
    if (response.status == 200) {
      const action = modal.id ? "updated" : "added";
      message.success(`Sale order ${action} successfully`);
    } else {
      message.success(`Something went wrong, Try again!`);
    }
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Popups
      title={modal.title}
      open={modal.open}
      onCancel={onClose}
      footer={[
        <Row justify="space-between">
          <Col>
            {(modal.mode == "Add" || modal.mode == "Update") && (
              <Button key="close" onClick={onClose}>
                Cancel
              </Button>
            )}
          </Col>
          <Col>
            {(modal.mode == "Add" || modal.mode == "Update") && (
              <Button
                key="submit"
                type="primary"
                onClick={() => form.submit()}
                htmlType="submit"
              >
                {modal.mode == "Add" ? "Save" : "Update"}
              </Button>
            )}
          </Col>
        </Row>,
      ]}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          labelAlign="left"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{ soStatus: true }}
          disabled={modal.disabled}
        >
          <Form.Item
            name="soNo"
            label="SO.NO"
            rules={[
              {
                required: true,
                message: "Please enter sale order number",
              },
            ]}
          >
            <Input placeholder="Enter sale order number" />
          </Form.Item>
          <Form.Item
            name="productId"
            label="Product"
            rules={[
              {
                required: true,
                message: "Please select product",
              },
            ]}
          >
            <Select placeholder="Select product" options={productOption} />
          </Form.Item>
          <Form.Item
            name="soQuantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: "Please enter quantity",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="Enter quantity"
            />
          </Form.Item>
          <Form.Item
            name="soCustomerName"
            label="Customer Name"
            rules={[
              {
                required: true,
                message: "Please enter customer name",
              },
            ]}
          >
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item
            name="soDate"
            label="Date"
            rules={[
              {
                required: true,
                message: "Please select Date",
              },
            ]}
          >
            <DatePicker
              showTime
              format="DD-MM-YYYY HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="soStatus"
            label="soStatus"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Radio.Group>
              <Radio value={true}>Active</Radio>
              <Radio value={false}>In-Active</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Spin>
    </Popups>
  );
};

export default withForm(SaleOrderForm);
