import {
  Button,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { MaterialService } from "../../../services/djc/material-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const MaterialForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const service = new MaterialService();

  useEffect(() => {
    if (modal.id) {
      onRetrieve(modal.id);
    }
  }, [modal.id]);
  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      message.error("Failed to fetch material");
    } finally {
      setIsLoading(false);
    }
  };
  const patchForm = (data) => {
    form.setFieldsValue({ ...data });
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
      message.success(`Material ${action} successfully`);
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
          initialValues={{ status: true }}
          disabled={modal.disabled}
        >
          <Form.Item
            name="materialName"
            label="Material Name"
            rules={[
              {
                required: true,
                message: "Please enter material name",
              },
            ]}
          >
            <Input placeholder="Enter material name" />
          </Form.Item>

          <Form.Item
            name="materialCode"
            label="Code"
            rules={[
              {
                required: true,
                message: "Please enter code",
              },
            ]}
          >
            <Input placeholder="Enter Code" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[
              {
                required: true,
                message: "Please enter unit",
              },
            ]}
          >
            <Input placeholder="Enter unit" />
          </Form.Item>
          <Form.Item
            name="materialType"
            label="Type"
            rules={[
              {
                required: true,
                message: "Please select type",
              },
            ]}
          >
            <Select
              placeholder="Select type"
              options={[
                {
                  value: "Component",
                  label: "Component",
                },
                {
                  value: "Material",
                  label: "Material",
                },
                {
                  value: "Product",
                  label: "Product",
                },
              ]}
            />
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
            name="materialDescription"
            label="Material Description"
            rules={[
              {
                required: true,
                message: "Please enter material description",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Spin>
    </Popups>
  );
};

export default withForm(MaterialForm);
