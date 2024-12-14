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
import UserGroupService from "../../../services/user-group-service";
import { PlusOutlined } from "@ant-design/icons";
import Usergroupform from "../user-group/usergroupform";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
    this.loadUserGroup();
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
    this.loadUserGroup();
    super.componentDidMount();
  }
  loadUserGroup = () => {
    this.userGroupService.list({ status: true }).then((response) => {
      this.setState((state) => ({ ...state, userGroup: response.data }));
    });
  };
  loadAppHierarchy = () => {
    this.appHierarchyService
      .list({ active: true })
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
  addUserGroup = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Users Group", mode: "Add", open: true },
    }));
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
                  { required: true, message: "Please enter your user name!" },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input autoFocus maxLength={20} />
              </Form.Item>
              <Form.Item
                label="Role"
                name="roleId"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select showSearch optionFilterProp="children">
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
                    validator: validateEmail,
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
                <PhoneInput
                  disabled={this.props.disabled}
                  international
                  defaultCountry="IN"
                  value={this.props.form.getFieldValue("contactNumber")}
                  onChange={(value) =>
                    this.props.form.setFieldsValue({ contactNumber: value })
                  }
                  maxLength={20}
                />
              </Form.Item>
              {/* <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input minLength={6} maxLength={14} />

              </Form.Item> */}
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
                  <Input.Password minLength={6} maxLength={14} />
                </Form.Item>
              )}
              <Form.Item
                label="Entity"
                name="ahid"
                // rules={[{ required: true, message: "Please select entity" }]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  style={{ width: "100%" }}
                  allowClear
                  treeData={this.state.parentTreeList}
                  treeNodeFilterProp="title"
                />
              </Form.Item>
              <Form.Item
                label="User Group"
                name="userGroupMappings"
                // rules={[
                //   { required: true, message: "Please Select the Group!" },
                // ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showArrow
                  optionFilterProp="children"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Button
                        onClick={this.addUserGroup}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add new
                      </Button>
                    </>
                  )}
                >
                  {this.state.userGroup?.map((e) => (
                    <Option key={e.userGroupId} value={e.userGroupId}>
                      {e.userGroupName}
                    </Option>
                  ))}
                </Select>
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
        <Usergroupform {...this.state.popup} close={this.onClose} />
      </Popups>
    );
  }
}

export default withForm(UserForm);
