import React, { useEffect, useState } from "react";
import { withForm } from "../../../utils/with-form";
import Popups from "../../../utils/page/popups";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
} from "antd";
import ProductService from "../../../services/track-and-trace-service/product-service";
import WorkInstructionService from "../../../services/track-and-trace-service/work-instruction-service";
import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import dayjs from "dayjs";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import { dateFormat } from "../../../helpers/date-format";
import LossReasonService from "../../../services/track-and-trace-service/loss-reason-service";

const OperationForm = (props) => {
  const { form, open, mode, title, onClose, disabled } = props;

  const service = new LossReasonService();

  useEffect(() => {
    if (props.id) {
      patchForm(props.id);
    }
  }, [open, props.id]);

  const patchForm = (id) => {
    service.retrieve(id).then(({ data }) => {
      form.setFieldsValue({
        ...data,
      });
    });
  };

  const closePopup = () => {
    form.resetFields();
    onClose();
  };

  const onFinish = (value) => {
    const response = props.id
      ? service.update(value, props.id)
      : service.add(value);

    response
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
          closePopup();
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {});
  };

  return (
    <Popups
      destroyOnClose
      title={title}
      open={open}
      onCancel={closePopup}
      footer={[
        <Row justify="space-between">
          <Col>
            {(mode == "Add" || mode == "Update") && (
              <Button key="close" onClick={closePopup}>
                Cancel
              </Button>
            )}
          </Col>
          <Col>
            {(mode == "Add" || mode == "Update") && (
              <Button
                key="submit"
                type="primary"
                onClick={form.submit}
                htmlType="submit"
              >
                {mode == "Add" ? "Save" : "Update"}
              </Button>
            )}
          </Col>
        </Row>,
      ]}
    >
      <Form
        labelAlign="left"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        layout="horizontal"
        colon={false}
        onFinish={onFinish}
        className="form-horizontal"
        initialValues={{ status: true }}
        disabled={disabled}
      >
        <Form.Item
          label="Operation Name"
          name={"operationName"}
          rules={[
            {
              required: true,
              message: "Please enter Opertion name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name={"operationType"}
          rules={[
            {
              required: true,
              message: "Please select operation type",
            },
          ]}
        >
          <Select>
            <Select.Option value={"auto"}>Auto </Select.Option>
            <Select.Option value={"semiAuto"}>Semi Auto </Select.Option>
            <Select.Option value={"manual"}>Manual </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Popups>
  );
};
export default withForm(OperationForm);
