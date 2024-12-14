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
import React, { useEffect, useState } from "react";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { JobOrderService } from "../../../services/djc/job-order-service";
import { SaleOrderService } from "../../../services/djc/sale-order-service";
import { dateFormat } from "../../../helpers/url";
import moment from "moment";

const JobOrderForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [saleOrderOption, setSaleOrderOption] = useState([]);
  const service = new JobOrderService();
  const saleOrderService = new SaleOrderService();

  useEffect(() => {
    if (modal.id) {
      onRetrieve(modal.id);
    }
  }, [modal.id]);
  useEffect(() => {
    if (modal.open) {
      fetchProductOption();
    }
  }, [modal.open]);
  const fetchProductOption = async () => {
    setIsLoading(true);
    try {
      const response = await saleOrderService.list();
      setSaleOrderOption(
        response.data?.map((e) => ({
          label: e.soNo,
          value: e.soId,
          pendingQuantity: e.soQuantity,
          productId: e.productId,
          productName: e.materialName,
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
      message.error("Failed to fetch job order");
    } finally {
      setIsLoading(false);
    }
  };
  const patchForm = (data) => {
    form.setFieldsValue({
      ...data,
      joDate: moment(data.joDate),
      pendingQuantity: data.saleOrder.soQuantity,
      productName: data.material.materialName,
    });
  };
  const onFinish = async (value) => {
    let response;
    if (modal.id) {
      response = await service.update(value, modal.id);
    } else {
      response = await service.save(value);
    }
    if (response.status == 200) {
      const action = modal.id ? "updated" : "added";
      message.success(`job order ${action} successfully`);
    } else {
      message.success(`Something went wrong, Try again!`);
    }
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    props.onClose();
  };
  const loadItems = (value) => {
    const SelelectedValues = saleOrderOption.find((opt) => opt.value === value);
    form.setFieldsValue({ ...SelelectedValues });
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
          colon={false}
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
            name="soId"
            label="Sales Order No"
            rules={[
              {
                required: true,
                message: "Please enter salse order no",
              },
            ]}
          >
            <Select
              options={saleOrderOption}
              onChange={loadItems}
              placeholder="Select sales order no"
            ></Select>
          </Form.Item>
          <Form.Item
            name="productName"
            label="Product Name"
            disabled
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter product name" disabled />
          </Form.Item>
          <Form.Item
            hidden
            name="productId"
            label="productId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pendingQuantity"
            label="Pending Quantity"
            rules={[
              {
                required: true,
                message: "Please enter quantity",
              },
            ]}
          >
            <InputNumber
              disabled
              placeholder="Enter quantity"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="joQuantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: "Please enter quantity",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const pendingQuantity = getFieldValue("pendingQuantity");
                  if (value <= pendingQuantity) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Quantity must be less than or equal to pending quantity"
                    )
                  );
                },
              }),
            ]}
          >
            <InputNumber
              max={form.getFieldValue("pendingQuantity")}
              placeholder="Enter quantity"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="joNo"
            label="JO Number"
            rules={[
              {
                required: true,
                message: "Please enter job order number",
              },
            ]}
          >
            <Input placeholder="Enter job order number" />
          </Form.Item>
          <Form.Item
            name="joDate"
            label="Date"
            rules={[
              {
                required: true,
                message: "Please enter date",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>

          <Form.Item
            name="joStatus"
            label="Status"
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

export default withForm(JobOrderForm);
