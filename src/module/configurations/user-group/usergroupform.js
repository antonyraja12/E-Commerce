import React from "react";
import UserGroupService from "../../../services/user-group-service";

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  TreeSelect,
} from "antd";
import userform from "../user/user-form";
import { userGroupPageId } from "../../../helpers/page-ids";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import RoleService from "../../../services/role-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { AddButton } from "../../../utils/action-button/action-button";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import Userform from "../user/user-form";
import UserService from "../../../services/user-service";
// import { validateName } from "../../../helpers/validation";
import { validateName } from "../../../helpers/validation";
// import { customSelectFilter } from "../../../helpers/constants";
import { customSelectFilter } from "../../../helpers/constants";
const { Option } = Select;
const CustomOption = ({ option }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span>{option.userName}</span>
    <Tag color="volcano">{option.role.roleName}</Tag>
  </div>
);
class UserGroupForm extends PageForm {
  roleService = new RoleService();
  service = new UserGroupService();
  appHierarchyService = new AppHierarchyService();
  userService = new UserService();
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
    this.userService.list({ active: true }).then((response) => {
      this.setState((state) => ({
        ...state,
        userData: response.data,
      }));
    });
    this.loadAppHierarchy();
    // this.getUserName();
    super.componentDidMount();
  }

  customTagRender = (props) => {
    const { label, value, closable, onClose } = props;

    return (
      <Tag closable={closable} onClose={onClose} style={{ display: "flex" }}>
        {label}
      </Tag>
    );
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

  addUser = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Users", mode: "Add", open: true },
    }));
  };
  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: { open: false },
    }));
    this.handleSiteChange(this.state.siteAhId);
  };
  // addUser = () => {

  // };
  patchForm = (data) => {
    // console.log("path data ", data);
    this.handleSiteChange(data.ahid);
    this.props.form.setFieldsValue({
      userGroupId: data.userGroupId,
      description: data.description,
      ahid: data.ahid,
      userIds: data.userMappings?.map((e) => e.userId),
      status: data.status,
      userGroupName: data.userGroupName,
    });

    this.setState((state) => ({
      ...state,
      siteAhId: data.ahid,
    }));
  };
  handleSiteChange = (value) => {
    this.props.form.resetFields(["userIds"]);
    this.userService.list({ aHId: value }).then((response) => {
      this.setState((state) => ({
        ...state,
        userData: response.data,
        siteAhId: value,
      }));
    });
  };

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
              <Form.Item hidden name="userGroupId">
                <Input />
              </Form.Item>
              <Form.Item
                label="Name"
                name="userGroupName"
                rules={[
                  {
                    validator: validateName,
                  },
                  {
                    required: true,
                    message: "Please enter the user group name!",
                  },
                ]}
              >
                <Input autoFocus maxLength={20} />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input autoFocus maxLength={40} />
              </Form.Item>
              <Form.Item
                label="Entity"
                name="ahid"
                rules={[{ required: true, message: "Please select customer" }]}
              >
                <TreeSelect
                  onChange={this.handleSiteChange}
                  showSearch
                  treeDefaultExpandAll={false}
                  style={{ width: "100%" }}
                  allowClear
                  treeData={this.state.parentTreeList}
                />
              </Form.Item>
              <Form.Item
                label="Select Users"
                name="userIds"
                // rules={[{ required: true, message: "Please select the users" }]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select Users"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.props.option.userName
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  tagRender={this.customTagRender}
                  tokenSeparators={[","]}
                  // defaultValue={}

                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Button
                        onClick={this.addUser}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add new
                      </Button>
                    </>
                  )}
                >
                  {this.state.userData?.map((option) => (
                    <Select.Option key={option.userId} value={option.userId}>
                      <CustomOption option={option} />
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="status" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          }
        </Spin>
        <Userform {...this.state.popup} close={this.onClose} />
      </Popups>
    );
  }
}

export default withForm(UserGroupForm);
