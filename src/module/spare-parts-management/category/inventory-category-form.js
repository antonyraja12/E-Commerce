import React from "react";

import { Button, Col, Form, Input, InputNumber, Radio, Row, Spin } from "antd";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { validateName } from "../../../helpers/validation";
const { TextArea } = Input;
class InventoryCategoryForm extends PageForm {
  service = new InventoryCategoryService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  render() {
    return (
      <Popups
        footer={[
          <Row justify="space-between">
            <Col>
              {(this.props.mode == "Add" || this.props.mode == "Update") && (
                <Button key="close" onClick={this.closePopup}>
                  Cancel
                </Button>
              )}
            </Col>
            <Col>
              {(this.props.mode == "Add" || this.props.mode == "Update") && (
                <Button
                  key="submit"
                  type="primary"
                  onClick={this.props.form.submit}
                  htmlType="submit"
                >
                  {this.props.mode == "Add" ? "Save" : "Update"}
                </Button>
              )}
            </Col>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}
      >
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            labelAlign="left"
            className="form-horizontal"
            colon={false}
            layout="horizontal"
            form={this.props.form}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 16, xs: 24 }}
            onFinish={this.onFinish}
            disabled={this.props.disabled}
          >
            <Form.Item label="Spare Part Type Id" name="sparePartTypeId" hidden>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Category Name"
              name="sparePartTypeName"
              rules={[
                {
                  required: true,
                  message: "Please enter your category name!",
                },
                {
                  validator: validateName,
                },
              ]}
            >
              <Input autoFocus maxLength={20} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea rows={3} maxLength={30} />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue={true}>
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(InventoryCategoryForm);
