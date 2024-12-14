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
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { withForm } from "../../../utils/with-form";
import MailConfiguration from "./email-config";
import { withAuthorization } from "../../../utils/with-authorization";
// import EmailConfig from "./email-config";
//import { useState } from "react";
const { Text, Link } = Typography;
const { Step } = Steps;

class SmsConfiguration extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      mailFormDisabled: true,
      smsFormDisabled: true,
    };
  }
  // service = new MailConfigurationService();
  service = new SmsConfigurationService();
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
      this.props.form.setFieldsValue({ ...data });
      setTimeout(() => {
        this.triggerInitialChange();
      }, 500);
    }
  }

  componentDidMount() {
    this.setState((state) => ({
      ...state,
      enableTLS: false,
      authentication: false,
    }));

    this.service.list({}).then((response) => {
      this.patchForm(response.data[0]);
      this.setState((state) => ({ ...state, smsId: response.data }));
    });
  }

  saveFun(data) {
    if (this.props.id || this.props.params?.id) {
      if (this.props.id) return this.service.update(data, this.props.id);
      else return this.service.update(data, this.props.params.id);
    }
    return this.service.add(data);
  }
  setCheckAuthentication = (e) => {
    this.setState({ authentication: e.target.checked });
  };

  setCheckEnableTLS = (e) => {
    this.setState({ enableTLS: e.target.checked });
  };

  onSubmit1 = (data) => {
    // console.log("button clicked", data);
    this.setState((state) => ({ ...state, isLoading: true }));
    this.saveFun(data)
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
        this.setState({ ...this.state, isLoading: false });
      });
  };

  title = "SMS Configuration";

  render() {
    return (
      <Card
        title="SMS Configuration"
        extra={
          <>
            {this.props.update || (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() =>
                  this.setState({
                    smsFormDisabled: !this.state.smsFormDisabled,
                  })
                }
              >
                {this.state.smsFormDisabled ? "Update" : "Cancel"}
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
          labelCol={{ sm: 10, xs: 16 }}
          wrapperCol={{ sm: 10, xs: 10 }}
          labelAlign="left"
          layout="horizontal"
          onFinish={this.onSubmit1}
          //disabled={this.state.formDisabled}
          disabled={this.state.smsFormDisabled}
        >
          <Row justify="space-between">
            <Col sm={16} xs={16}>
              {/* <Form.Item name="smsConfigurationId" hidden>
                      <InputNumber />
                    </Form.Item> */}
              <Form.Item
                label="Account SID"
                name="accountSID"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Account SID!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input.Password
                  style={{ width: "200%" }}
                  disabled={this.state.smsFormDisabled}
                />
              </Form.Item>
              <Form.Item
                label="Auth ID"
                name="authToken"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Auth ID!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input.Password
                  style={{ width: "200%" }}
                  disabled={this.state.smsFormDisabled}
                />
              </Form.Item>
              <Form.Item
                label="Twilio Number"
                name="twilioNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Twilio Number!",
                  },
                ]}
                style={{ whiteSpace: "nowrap" }}
              >
                <Input style={{ width: "200%" }} />
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
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default withForm(SmsConfiguration);
