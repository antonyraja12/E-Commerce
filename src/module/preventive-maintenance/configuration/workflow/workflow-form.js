import { Button, Col, Form, Input, Radio, Row, Select, Spin } from "antd";
import React from "react";
import WorkflowService from "../../../../services/preventive-maintenance-services/work-flow-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";

const { Option } = Select;

class WorkflowForm extends PageForm {
  service = new WorkflowService();
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
                <Button key="cancel" onClick={this.closePopup}>
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
            <Form.Item name="workflowId" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Workflow Name"
              name="workflowName"
              rules={[
                {
                  required: true,
                  message: "Please enter the above field !",
                  space: false,
                },
              ]}
            >
              <Input maxLength={200} />
            </Form.Item>

            <Form.Item
              label="Workflow Type"
              name="workflowType"
              rules={[
                { required: true, message: "Please select the Workflow Type" },
              ]}
            >
              <Select showSearch>
                <Option value="Maintenance">Maintenance</Option>
                <Option value="Audit">Audit</Option>
                <Option value="Incident">Incident</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Frequency" name="frequency">
              <Select showSearch>
                <Option value="Daily">Daily</Option>
                <Option value="Weekly">Weekly</Option>
                <Option value="Monthly">Monthly</Option>
                <Option value="Quarterly">Quarterly</Option>
                <Option value="HalfYearly">HalfYearly</Option>
                <Option value="Yearly">Yearly</Option>
              </Select>
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

export default withForm(WorkflowForm);
