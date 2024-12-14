import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import CategoryService from "../../../../services/track-and-trace-service/category-service";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";

const CategoryForm = (props) => {
  const { form, open, mode, title, onClose, disabled } = props;
  const service = new CategoryService();

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
          label="Name"
          name={"categoryName"}
          rules={[
            {
              required: true,
              message: "Please enter category",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Popups>
  );
};
export default withForm(CategoryForm);
