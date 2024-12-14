import React, { useEffect } from "react";
import ComponentService from "../../../services/asset-component service";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Radio,
  Row,
  Col,
  TreeSelect,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const { Option } = Select;
class ComponentForm extends PageForm {
  service = new ComponentService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  componentDidMount() {
    this.service.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, componentName: response.data }));
    });
    super.componentDidMount();
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
            <Form.Item name="assetId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="Component Name"
              name="componentName"
              rules={[
                { required: true, message: "Please enter Component name!" },
              ]}
            >
              <Input autoFocus maxLength={20} />
            </Form.Item>

            <Form.Item name="active" label="Status" initialValue={true}>
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

export default withForm(ComponentForm);
