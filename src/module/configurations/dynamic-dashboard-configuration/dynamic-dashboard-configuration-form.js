import React from "react";
import RoleService from "../../../services/role-service";
import { Button, Col, Form, Input, InputNumber, Radio, Row, Spin } from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { validateName } from "../../../helpers/validation";
import { withRouter } from "../../../utils/with-router";
import DynamicDashboardConfigurationService from "../../../services/dynamic-dashboard-configuration-service";

class DynamicDashboardConfigurationForm extends PageForm {
  service = new DynamicDashboardConfigurationService();

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };

  onFinishForm = (data, buttonType) => {
    this.setState({ isLoading: true });
    this.saveFn(data)
      .then(({ data }) => {
        if (data.success) {
          this.onSuccess(data);
        } else {
          this.onSuccess({ success: true, message: "Added Successfully" });
        }
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  onFinishRoleForm = (formData, buttonType) => {
    this.props.form
      .validateFields()
      .then(() => {
        this.onFinishForm(formData, buttonType);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
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
              {(this.props.mode === "Add" || this.props.mode === "Update") && (
                <Button key="close" onClick={this.closePopup}>
                  Cancel
                </Button>
              )}
            </Col>
            <Col>
              {(this.props.mode === "Add" || this.props.mode === "Update") && (
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  onClick={() =>
                    this.onFinishRoleForm(
                      this.props.form.getFieldsValue(),
                      "submit"
                    )
                  }
                >
                  {this.props.mode === "Add" ? "Save" : "Update"}
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
            // onFinish={this.onFinish}
            disabled={this.props.disabled}
          >
            <Form.Item name="dynamicDashboardConfigurationId" hidden>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Parameter Name"
              name="dynamicDashboardName"
              rules={[
                { required: true, message: "Please enter your energy name!" },
                { validator: validateName },
              ]}
            >
              <Input autoFocus maxLength={20} />
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
export default withRouter(withForm(DynamicDashboardConfigurationForm));
