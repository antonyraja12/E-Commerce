import React from "react";
import UserService from "../../../services/user-service";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Progress,
  Radio,
  Row,
  Select,
  Spin,
  Tooltip,
  TreeSelect,
  message,
} from "antd";
// import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import RoleService from "../../../services/role-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import UserGroupService from "../../../services/user-group-service";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Usergroupform from "../user-group/usergroupform";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../../helpers/validation";
const { Option } = Select;

class ResetPasswordForm extends PageForm {
  roleService = new RoleService();
  service = new UserService();
  appHierarchyService = new AppHierarchyService();
  userGroupService = new UserGroupService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: { open: false },
    }));
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  componentDidMount() {
    super.componentDidMount();
  }

  passwordGetter = () => {
    this.setState({ isLoading: true });
    this.service
      .getGeneratedPassword()
      .then((res) => {
        const password = res.data;
        this.props.form.setFieldsValue({ password: password });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };
  onFinish = (value) => {
    console.log("user", value);
    value.userId = this.state.userId;
    this.setState({ isLoading: true });
    this.service
      .resetPassword(value)
      .then((res) => {
        this.onSuccess(res.data);
      })
      .finally(() => {});
  };
  //   calculatePasswordStrength = (value) => {
  //     if (
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
  //         value
  //       )
  //     ) {
  //       return 100;
  //     } else if (
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/.test(value)
  //     ) {
  //       return 75;
  //     } else if (/^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/.test(value)) {
  //       return 50;
  //     } else {
  //       return 0;
  //     }
  //   };
  calculatePasswordStrength = (value) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharacterRegex = /[@$!%*?&]/;

    let strength = 0;

    // Check for uppercase letters
    if (uppercaseRegex.test(value)) {
      strength += 20;
    }

    if (value) {
      if (lowercaseRegex.test(value)) {
        strength += 20;
      }
    }
    // Check for digits
    if (digitRegex.test(value)) {
      strength += 20;
    }

    // Check for special characters
    if (specialCharacterRegex.test(value)) {
      strength += 20;
    }

    // Check for length

    if (value?.length >= 8 && value?.length <= 16) {
      strength += 20;
    }

    return strength;
  };

  render() {
    return (
      <Popups
        title={"Reset Password"}
        open={this.state?.open}
        onCancel={this.closePopup}
        footer={null}
      >
        <Spin spinning={!!this.state.isLoading}>
          <div
            style={{
              textAlign: "center",
              color: "GrayText",
            }}
          >
            <img
              src="/changepassword.svg"
              style={{ width: "100%", height: "150px" }}
            />
            <p>Click on generate button to generate new Password</p>
          </div>
          <Form
            layout="vertical"
            form={this.props.form}
            labelAlign="left"
            colon={false}
            disabled={this.props.disabled}
            onFinish={this.onFinish}
          >
            <Row justify={"space-between"}>
              <Col sm={17}>
                <Form.Item
                  label="New password"
                  name="password"
                  rules={[
                    {
                      validator: validatePassword,
                    },
                  ]}
                >
                  <Input
                    maxLength={16}
                    onChange={(e) => {
                      const password = e.target.value;
                      this.props.form.setFieldsValue({ password }); // Update the form value
                      if (password) {
                        this.setState({
                          passwordStrength:
                            this.calculatePasswordStrength(password),
                        });
                      }
                    }}
                    suffix={
                      <Tooltip
                        trigger={"click"}
                        placement="bottom"
                        title={
                          <>
                            <div>
                              <ul>
                                <li>Be 8-16 characters in length</li>
                                <li>
                                  Contain at least one uppercase and lowercase
                                </li>
                                <li>Contain at least one digit</li>
                                <li>
                                  Contain at least one special character (e.g.,
                                  @$!%*?&)
                                </li>
                              </ul>
                            </div>
                          </>
                        }
                      >
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                          }}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
                <Progress
                  percent={this.calculatePasswordStrength(
                    this.props.form.getFieldValue("password")
                  )}
                  status={
                    this.calculatePasswordStrength(
                      this.props.form.getFieldValue("password")
                    ) === 100
                      ? "success"
                      : "normal"
                  }
                  style={{ width: "100%", marginTop: 5 }}
                />
              </Col>

              <Col sm={6}>
                <Form.Item label=" ">
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => {
                      this.passwordGetter();
                    }}
                  >
                    Generate
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <br></br>
            <Row justify={"center"}>
              <Col sm={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    style={{
                      // background: "red",
                      // color: "#fff",
                      width: "100%",
                    }}
                    htmlType="submit"
                  >
                    Reset Password
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ResetPasswordForm);
