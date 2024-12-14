import React from "react";
import UserService from "../../../services/user-service";

import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  TreeSelect,
} from "antd";
// import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import RoleService from "../../../services/role-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../../helpers/validation";
const { Option } = Select;

class UserForm extends PageForm {
  roleService = new RoleService();
  service = new UserService();
  appHierarchyService = new AppHierarchyService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  componentDidMount() {
    this.roleService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, role: response.data }));
    });
    this.loadAppHierarchy();
    // this.getUserName();
    super.componentDidMount();
  }
  loadAppHierarchy = () => {
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));
      })
      .catch((error) => {
        console.error("Failed to load app hierarchy:", error);
      });
  };

  render() {
    const { mode } = this.props;
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
          {
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
              <Form.Item hidden name="userId">
                <Input />
              </Form.Item>
              <Form.Item
                label="User Name"
                name="userName"
                rules={[
                  { required: true, message: "Please enter your username!" },
                ]}
              >
                <Input autoFocus maxLength={20} />
              </Form.Item>
              <Form.Item
                label="Role"
                name="roleId"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select>
                  {this.state.role?.map((e) => (
                    <Option key={`Role${e.roleId}`} value={e.roleId}>
                      {e.roleName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  { required: true, message: "Please enter your e-mail id!" },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                label="Mobile No."
                name="contactNumber"
                rules={[
                  { required: true, message: "Please enter your mobile no!" },
                ]}
              >
                <Input maxLength={15} />
              </Form.Item>

              {mode === "Add" && (
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                    {
                      validator: validatePassword,
                    },
                  ]}
                >
                  <Input minLength={6} maxLength={14} />
                </Form.Item>
              )}
              <Form.Item
                label="Site"
                name="ahid"
                rules={[{ required: true, message: "Please select customer" }]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  style={{ width: "100%" }}
                  allowClear
                  treeData={this.state.parentTreeList}
                />
              </Form.Item>
              <Form.Item name="active" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          }
        </Spin>
      </Popups>
    );
  }
}

export default withForm(UserForm);
