import { Button, Col, Form, Input, message, Radio, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { ProductService } from "../../../services/djc/product-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const ProductForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const service = new ProductService();

  useEffect(() => {
    if (modal.id) {
      onRetrieve(modal.id);
    }
  }, [modal.id]);
  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
    } catch (error) {
      message.error("Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };
  const onFinish = async (value) => {
    let response;
    if (modal.id) {
      response = await service.update(value, modal.id);
    } else {
      response = await service.save(value);
    }
    console.log(response);
    props.onClose();
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
          initialValues={{ status: true }}
          disabled={modal.disabled}
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
            name="model"
            label="Model"
            rules={[
              {
                required: true,
                message: "Please enter model",
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
      </Spin>
    </Popups>
  );
};

export default withForm(ProductForm);
