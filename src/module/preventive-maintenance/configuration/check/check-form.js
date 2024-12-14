import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import React from "react";
import CheckService from "../../../../services/preventive-maintenance-services/check-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";

import { PlusOutlined } from "@ant-design/icons";
import { checkPageId } from "../../../../helpers/page-ids";
import CheckTypeService from "../../../../services/preventive-maintenance-services/check-type-service";
import { withForm } from "../../../../utils/with-form";
import CheckTypeForm from "../check-type/check-type-form";
import { validateName } from "../../../../helpers/validation";

const { Option } = Select;

class CheckForm extends PageForm {
  label = "Check";
  pageId = checkPageId;
  service = new CheckService();
  checktypeservice = new CheckTypeService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(data.data);
  }
  loadCheckType = () => {
    this.setState((state) => ({ ...state, checkTypeLoading: true }));
    this.checktypeservice
      .list({ active: true })
      .then((response) => {
        this.setState((state) => ({ ...state, checkTypeName: response.data }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, checkTypeLoading: false }));
      });
  };
  componentDidMount() {
    this.loadCheckType();
    super.componentDidMount();
  }

  patchForm(data) {
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        checkType: data.checkType.map((e) => e.checkType?.checkTypeId),
      });
    }
  }
  addCheckType = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Check Type", mode: "Add", open: true },
    }));
  };
  onClose = (val) => {
    if (val) {
      this.loadCheckType();
    }
    this.setState((state) => ({ ...state, popup: { open: false } }));
  };
  render() {
    return (
      <>
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
              <Form.Item name="checkId" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                label={`${this.label} Name`}
                name="checkName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Check Name!",
                  },
                  // {
                  //   validator: validateName,
                  // },
                ]}
              >
                <Input maxLength={200} />
              </Form.Item>
              <Form.Item
                label={`${this.label} Type`}
                name="checkType"
                rules={[
                  {
                    required: true,
                    message: "Please select the Check Type!",
                  },
                ]}
              >
                <Select
                  loading={this.state.checkTypeLoading}
                  mode="multiple"
                  optionFilterProp="label"
                  options={this.state.checkTypeName?.map((e) => ({
                    label: e.checkTypeName,
                    value: e.checkTypeId,
                  }))}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider />
                      <Button
                        onClick={this.addCheckType}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add new
                      </Button>
                    </>
                  )}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the description!",
                  },
                ]}
              >
                <Input.TextArea maxLength={200} />
              </Form.Item>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[
                  {
                    required: true,
                    message: "Please select the Priority!",
                  },
                ]}
              >
                <Select>
                  <Option value="HIGH">High</Option>
                  <Option value="MEDIUM">Medium</Option>
                  <Option value="LOW">Low</Option>
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
        <CheckTypeForm {...this.state.popup} close={this.onClose} />
      </>
    );
  }
}

export default withForm(CheckForm);
