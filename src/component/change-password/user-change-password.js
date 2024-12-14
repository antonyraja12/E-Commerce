import { Button, Col, Form, Input, Row, Spin, message } from "antd";
import React from "react";
import PageForm from "../../utils/page/page-form";
import Popups from "../../utils/page/popups";
import { withForm } from "../../utils/with-form";
import LoginService from "../../services/login-service";
import { CheckOutlined } from "@ant-design/icons";
import { validatePassword } from "../../helpers/validation";
class UserChangePassword extends PageForm {
  state = {
    title: "Change Password",
    userName: "",
  };
  auth = new LoginService();
  getUserName = () => {
    return this.auth.getUserName();
  };
  componentDidMount() {
    const userName = this.getUserName();
    this.setState((state) => ({ ...state, userName }));
    this.props.form.setFieldsValue({ userName: userName });
  }
  validateConfirmPassword = (newPassword) => ({
    validator(_, value) {
      if (!value || newPassword === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("confirm password do not match"));
    },
  });
  onFinishForm = (value) => {
    this.auth.updatePassword(value).then((data) => {
      if (data.data.success) {
        localStorage.removeItem("token");
        this.auth.saveToken(data.data.token);
        message.success(data.data.message);
        this.closePopup();
      } else {
        message.error(data.data.message);
      }
    });
  };
  closePopup = () => {
    this.props.form.resetFields();
    this.props.close();
  };
  render() {
    return (
      <>
        <Popups
          title={this.state?.title}
          open={this.props?.open}
          onCancel={this.closePopup}
          footer={[
            <div>
              <Button
                key="close"
                onClick={this.closePopup}
                style={{ borderRadius: "30px" }}
              >
                Cancel
              </Button>
              <Button
                style={{ borderRadius: "30px" }}
                key="submit"
                type="primary"
                onClick={this.props.form.submit}
                htmlType="submit"
              >
                <CheckOutlined /> Update
              </Button>
            </div>,
          ]}
        >
          <Spin spinning={!!this.state.isLoading}>
            <Row
              gutter={[16, 16]}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Col
                span={10}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  src="/changepassword.svg"
                  style={{ width: "100%", height: "100%" }}
                />
              </Col>
              <Col span={14}>
                <Form
                  size="small"
                  className="form-vertical"
                  layout="vertical"
                  form={this.props.form}
                  // labelAlign="left"
                  colon={false}
                  // labelCol={{ sm: 8, xs: 24 }}
                  // wrapperCol={{ sm: 16, xs: 24 }}
                  requiredMark={false}
                  disabled={this.props.disabled}
                  onFinish={this.onFinishForm}
                >
                  <Form.Item
                    label="User Name"
                    name="userName"
                    initialValue={this.state.userName}
                  >
                    <Input autoComplete="off" readOnly />
                  </Form.Item>

                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your old password!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="middle"
                      maxLength={16}
                      placeholder="Old Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <Input.Password
                      size="middle"
                      maxLength={16}
                      placeholder="New Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password again!",
                      },
                      ({ getFieldValue }) =>
                        this.validateConfirmPassword(
                          getFieldValue("newPassword")
                        ),
                    ]}
                  >
                    <Input.Password
                      size="middle"
                      maxLength={16}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(UserChangePassword);
