import MailConfigurationService from "../../../services/mail-configuration-service";
import SmsConfigurationService from "../../../services/sms-configuration-service";
import PageList from "../../../utils/page/page-list";
import Page from "../../../utils/page/page";
import {
  Table,
  Steps,
  Card,
  Col,
  Row,
  Typography,
  notification,
  Form,
  message,
  InputNumber,
  Button,
  Radio,
  Select,
  Input,
  Checkbox,
  Space,
  Alert,
} from "antd";

import TextArea from "antd/es/input/TextArea";
import { withForm } from "../../../utils/with-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { BiPencil } from "react-icons/bi";
//import { useState } from "react";
const { Text, Link } = Typography;
const { Step } = Steps;

class MailConfiguration extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      mailFormDisabled: true, // Separate formDisabled state for mail configuration
      smsFormDisabled: true, // Separate formDisabled state for SMS configuration
      confirmPasswordVisible: false,
      // ... existing state variables
    };
  }
  service = new MailConfigurationService();
  smsservice = new SmsConfigurationService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
    this.setState({ formDisabled: true });
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
    notification.success({
      message: "Success",
      description: "Mail configured successfully",
      duration: 2,
    });
  }

  patchForm(data) {
    if (this.props.form) {
      // console.log(data, "SDF");
      this.props.form.setFieldsValue({ ...data });
    }
  }

  componentDidMount() {
    this.setState((state) => ({
      ...state,
      enableTLS: false,
      authentication: false,
    }));
    this.getDate();
  }

  getDate = () => {
    this.service.list({}).then((response) => {
      this.patchForm(response.data[0]);
      this.setState((state) => ({ ...state, mailId: response.data }));

      this.smsservice.list({ active: true }).then((response) => {
        this.patchForm(response.data[0]);
        this.setState((state) => ({ ...state, smsId: response.data }));
      });
    });
  };
  saveFn(data) {
    if (this.props.id || this.props.params?.id) {
      if (this.props.id) return this.service.update(data, this.props.id);
      else return this.service.update(data, this.props.params.id);
    }
    return this.service.add(data);
  }
  saveFun(data) {
    if (this.props.id || this.props.params?.id) {
      if (this.props.id) return this.smsservice.update(data, this.props.id);
      else return this.smsservice.update(data, this.props.params.id);
    }
    return this.smsservice.add(data);
  }
  setCheckAuthentication = (e) => {
    this.setState({ authentication: e.target.checked });
  };

  setCheckEnableTLS = (e) => {
    this.setState({ enableTLS: e.target.checked });
  };

  onSubmit = (data) => {
    // console.log("button clicked", data);
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.saveFn(data)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          this.props.next();
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({
          ...this.state,
          confirmPasswordVisible: false,
          isLoading: false,
        });
      });
  };

  title = "SMS Configuration";

  render() {
    return (
      <Card
        title="Mail Configuration"
        extra={
          <>
            {this.props.update || (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  this.setState({
                    mailFormDisabled: !this.state.mailFormDisabled,
                    confirmPasswordVisible: false,
                  });
                  this.getDate();
                }}
              >
                {this.state.mailFormDisabled ? "Update" : "Cancel"}
              </Button>
            )}
          </>
        }
      >
        <Row justify={"space-between"}>
          <Col></Col>
        </Row>

        <Form
          size="small"
          form={this.props.form}
          className="form-horizontal"
          colon={false}
          labelCol={{ sm: 16, xs: 20 }}
          wrapperCol={{ sm: 10, xs: 10 }}
          labelAlign="left"
          layout="horizontal"
          onFinish={this.onSubmit}
          //disabled={this.state.formDisabled}
          disabled={this.state.mailFormDisabled}
        >
          <Row gutter={[20, 20]} justify="space-between">
            <Col sm={16} xs={24}>
              <Form.Item
                name="smtpServer"
                label="SMTP Server"
                rules={[
                  {
                    required: true,
                    message: "Please enter the SmtpServer Name!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input style={{ width: "250%" }} />
              </Form.Item>
              <Form.Item
                name="smtpPort"
                label="SMTP Port"
                rules={[
                  {
                    required: true,
                    message: "Please enter the SMTP port!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input style={{ width: "250%" }} />
              </Form.Item>
              <Form.Item
                name="userName"
                label="Account User"
                rules={[
                  {
                    required: true,
                    message: "Please enter the UserName!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input style={{ width: "250%" }} />
                {/* <Input.Password
                  style={{ width: "250%" }}
                  disabled={this.state.mailFormDisabled}
                /> */}
              </Form.Item>

              <Form.Item
                label=" Account Password"
                name="accountPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Account Password!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input
                  type="password"
                  style={{ width: "250%" }}
                  disabled={this.state.mailFormDisabled}
                  suffix={
                    <>
                      <BiPencil
                        onClick={() => {
                          this.props.form.setFieldsValue({
                            accountPassword: null,
                            cp: null,
                          });
                          this.setState((state) => ({
                            ...state,
                            confirmPasswordVisible: true,
                          }));
                        }}
                      />
                    </>
                  }
                />
              </Form.Item>

              {this.state.confirmPasswordVisible && (
                <Form.Item
                  label="Confirm Password"
                  name="cp"
                  dependencies={["accountPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("accountPassword") === value
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Account passwords do not match!")
                        );
                      },
                    }),
                  ]}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Input.Password style={{ width: "250%" }} />
                </Form.Item>
              )}
              <Form.Item
                name="authentication"
                label="Authentication"
                initialValue={false}
                valuePropName="checked"
              >
                <Checkbox
                  onChange={this.setCheckAuthentication}
                  checked={this.state.authentication}
                />
              </Form.Item>
              <Form.Item
                name="enableTLS"
                label="Enable TLS"
                initialValue={false}
                valuePropName="checked"
              >
                <Checkbox
                  onChange={this.setCheckEnableTLS}
                  checked={this.state.enableTLS}
                />
              </Form.Item>
              <Form.Item
                name="active"
                label="Status"
                initialValue={true}
                wrapperCol={{ span: 24 }}
              >
                <Radio.Group>
                  <Space direction="horizontal">
                    <Radio value={true}>Active</Radio>

                    <Radio value={false}>InActive</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col>
              <Button type="primary" htmlType="mail">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default withForm(MailConfiguration);
