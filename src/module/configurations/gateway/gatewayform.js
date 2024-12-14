import React from "react";
import GatewayService from "../../../services/gateway-service";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const { Option } = Select;

class GatewayForm extends PageForm {
  service = new GatewayService();
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
                  onClick={this.props.form.submit}
                  htmlType="submit"
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
          {/* <pre>{JSON.stringify(this.props)}</pre> */}

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
            <Form.Item hidden label="mqttId" name="mqttId">
              <Input />
            </Form.Item>
            {/* <Form.Item name="connectivityProtocol" label="Connectivity Protocol" initialValue="MQTT">
              <Radio.Group>
                <Radio value="MQTT">MQTT</Radio>
              </Radio.Group>
            </Form.Item> */}
            <Form.Item
              label="MQTT Name"
              name="mqttName"
              rules={[{ required: true, message: "Please input  MQTT name!" }]}
            >
              <Input autoFocus />
            </Form.Item>
            <Form.Item
              label="Server Name"
              name="serverName"
              rules={[
                { required: true, message: "Please input  server name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Server Port"
              name="port"
              rules={[
                { required: true, message: "Please input  server port!" },
              ]}
            >
              <InputNumber min="0" />
            </Form.Item>
            <Form.Item label="Client Id" name="clientId">
              <Input />
            </Form.Item>

            <Form.Item label="UserName" name="userId">
              <Input />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password />
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

export default withForm(GatewayForm);
