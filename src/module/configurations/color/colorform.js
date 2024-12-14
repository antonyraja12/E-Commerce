import React from "react";
import { Button, Form, Input, Select, Radio, Spin, Row, Col } from "antd";
import PageForm from "../../../utils/page/page-form";
import ColorService from "../../../services/color-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import PageList from "../../../utils/page/page-list";
import ColorPicker from "./color-picker";
import Checkbox from "antd/es/checkbox/Checkbox";

class ColorForm extends PageForm {
  service = new ColorService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  render() {
    return (
      <Popups
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}
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
      >
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            className="form-horizontal"
            layout="horizontal"
            form={this.props.form}
            labelAlign="left"
            colon={false}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 16, xs: 24 }}
            disabled={this.props.disabled}
            onFinish={this.onFinish}
          >
            <Form.Item name="colorMasterId" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Color Name"
              name="colorName"
              rules={[
                {
                  required: true,
                  message: "Please enter the Color Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Color Code"
              name="colorCode"
              rules={[
                {
                  required: true,
                  message: "Please enter the Color Code!",
                },
              ]}
            >
              <ColorPicker
                value={this.props.form.getFieldValue("colorCode")}
                onChange={(color) =>
                  this.props.form.setFieldsValue({ colorCode: color })
                }
              />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ColorForm);
