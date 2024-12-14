import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";

import AssemblyService from "../../../services/track-and-trace-service/assembly-service";
import { withForm } from "../../../utils/with-form";
import Popups from "../../../utils/page/popups";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import { dateFormat } from "../../../helpers/date-format";
import dayjs from "dayjs";
import ProductService from "../../../services/track-and-trace-service/product-service";

const AssemblyForm = (props) => {
  const { form, open, mode, title, onClose, disabled, id } = props;
  const [jobOrderOptions, setJobOrderOptions] = useState({});
  const [productOptions, setProductOptions] = useState({});
  const productService = new ProductService();
  const service = new AssemblyService();
  const jobOrderService = new TatJobOrderService();

  useEffect(() => {
    if (id) {
      patchForm(id);
    }
  }, [open, id]);

  useEffect(() => {
    const service = new TatJobOrderService();

    service
      .list()
      .then((response) => {
        setJobOrderOptions(
          response?.data?.map((e) => ({
            value: e.jobOrderId,
            label: `${e.jobOrderNo}`,
          }))
        );
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);
  const handleJobOrderChange = (jobOrderId) => {
    jobOrderService.retrieve(jobOrderId).then(({ data }) => {
      const productOptions = data?.productMasters?.map((e) => ({
        value: e.productId,
        label: e.productName,
      }));
      setProductOptions(productOptions);
    });
  };
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
        disabled={disabled}
      >
        <Form.Item
          label="Job order"
          name="jobOrderId"
          rules={[
            {
              required: true,
              message: "Please select job order",
            },
          ]}
        >
          <Select
            options={jobOrderOptions}
            showSearch
            onChange={handleJobOrderChange}
          />
        </Form.Item>
        <Form.Item
          name="productId"
          label="Product name"
          rules={[
            {
              required: true,
              message: "Please select product name",
            },
          ]}
        >
          <Select options={productOptions} showSearch />
        </Form.Item>
        <Form.Item
          label="Date"
          name="assemblyDate"
          rules={[
            {
              required: true,
              message: "Please select date",
            },
          ]}
        >
          <DatePicker
            format={dateFormat}
            style={{ width: "100%" }}
            disabledDate={(current) => {
              return current && current < dayjs().add(-1, "days");
            }}
          />
        </Form.Item>
      </Form>
    </Popups>
  );
};
export default withForm(AssemblyForm);
