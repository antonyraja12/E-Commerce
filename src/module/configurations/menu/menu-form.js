import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Table,
  TreeSelect,
} from "antd";
import React from "react";
import MenuService from "../../../services/menu-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { Option } from "antd/es/mentions";
import { EditOutlined } from "@ant-design/icons";
import FeatureService from "../../../services/feature-service";
import {
  DeleteButton,
  EditButton,
} from "../../../utils/action-button/action-button";
import AddNewFeature from "./add-new-feature";
import { connect } from "react-redux";
import { menuRefresh } from "../../../store/actions";

class MenuForm extends PageForm {
  service = new MenuService();
  featureService = new FeatureService();
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      featureEditMode: false,
      featureEditId: null,
      isFeatureDisabled: true,
    };
    this.featureEditModeCancel = this.featureEditModeCancel.bind(this);
  }
  closePopup = (status = false) => {
    this.props.form.resetFields();
    this.props.close(status);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.props.menuRefresh(true);
    this.closePopup(true);
  }
  children(list, parent) {
    let filtered = list.filter((e) => e.parentId === parent);
    return filtered.map((e) => {
      let children = this.children(list, e.menuId);
      if (children.length > 0) {
        return { title: e.menuName, value: e.menuId, children: children };
      } else return { title: e.menuName, value: e.menuId };
    });
  }
  handleData(list) {
    let l = list.sort((a, b) => a.orderNumber - b.orderNumber);
    return this.children(l, null);
  }
  loadCheckType = () => {
    this.setState((state) => ({ ...state, checkTypeLoading: true }));
    this.featureService
      .list()
      .then((response) => {
        // Sort the featureName alphabetically
        const sortedFeatureName = response.data
          .filter((feature) => feature.status === true)
          .sort((a, b) => a.featureName.localeCompare(b.featureName));
        const sortedFeatureNameForEdit = response.data.sort((a, b) =>
          a.featureName.localeCompare(b.featureName)
        );
        this.setState((state) => ({
          ...state,
          featureName: sortedFeatureName,
          featureNameForEdit: sortedFeatureNameForEdit,
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, checkTypeLoading: false }));
      });
  };

  componentDidMount() {
    this.loadCheckType();
    this.service.list({ active: true }).then((response) => {
      this.setState((state) => ({
        ...state,
        menu: response.data,
        treeData: this.handleData(response.data),
        isFeatureDisabled:
          this.props.form.getFieldValue().parentId === null ||
          this.props.form.getFieldValue().parentId === undefined,
      }));
    });
    super.componentDidMount();
  }

  componentWillUnmount() {
    this.props.form.resetFields();
  }
  saveFn(data) {
    if (this.props.mode === "Duplicate") {
      let obj = { ...data };
      delete obj.menuId;
      return this.service.add(obj);
    } else return super.saveFn(data);
  }
  addFeature = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Feature", mode: "Add", open: true },
    }));
  };
  onClose = (val) => {
    this.setState((state) => ({ ...state, popup: { open: false } }));
    this.componentDidMount();
  };

  patchForm(data) {
    console.log(data, "dattta");
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        userAccessFeatureMappings: Array.isArray(data.userAccessFeatureMappings)
          ? data.userAccessFeatureMappings.map(
              // (e) => e && e.userAccessFeatureId
              (e) => e && e
            )
          : [],
      });
    }
  }

  showModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCancel = () => {
    this.setState({
      isModalOpen: false,
      featureEditMode: false,
      featureEditId: null,
    });
    this.componentDidMount();
  };

  featureDelete(value) {
    this.featureService.delete(value).then((response) => {
      if (response.data.success) {
        this.loadCheckType();
      }
    });
  }

  featureEdit(value) {
    this.setState({ featureEditMode: true, featureEditId: value });
  }

  featureEditModeCancel() {
    this.setState((state) => ({
      ...state,
      featureEditMode: false,
      featureEditId: null,
    }));
  }

  enableFeature = (value) => {
    if (value === undefined) {
      this.props.form.setFieldsValue({ userAccessFeatureMappings: [] });
    }
    this.setState({ isFeatureDisabled: !value });
  };
  onFinish1 = (values) => {
    console.log(values, "value");
    this.onFinish(values);
  };

  render() {
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        align: "left",
        width: 0,
        render: (value, record, index) => {
          return index + 1;
        },
      },
      {
        title: "Feature Name",
        dataIndex: "featureName",
        key: "featureName",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value) => {
          return value ? "Active" : "Inactive";
        },
      },
      {
        title: "Action",
        dataIndex: "userAccessFeatureId",
        key: "userAccessFeatureId",
        align: "center",
        width: "100px",
        render: (value) => (
          <Flex>
            <EditButton onClick={() => this.featureEdit(value)} />
            <DeleteButton onClick={() => this.featureDelete(value)} />
          </Flex>
        ),
      },
    ];
    console.log(this.state, "statette");
    return (
      <>
        <Popups
          footer={[
            <Row justify="space-between">
              <Col>
                <Button key="close" onClick={this.closePopup}>
                  Cancel
                </Button>
              </Col>
              <Col>
                {this.props.mode !== "View" && (
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
            <Form
              size="small"
              disabled={this.props.disabled}
              labelAlign="left"
              className="form-horizontal"
              colon={false}
              layout="horizontal"
              form={this.props.form}
              labelCol={{ sm: 8, xs: 24 }}
              wrapperCol={{ sm: 16, xs: 24 }}
              onFinish={this.onFinish1}
            >
              <Form.Item hidden name="menuId">
                <Input />
              </Form.Item>
              <Form.Item
                label="Menu Name"
                name="menuName"
                rules={[
                  {
                    required: true,
                    message: "Please input menu name!",
                  },
                ]}
              >
                <Input autoFocus placeholder={"Menu name"} />
              </Form.Item>
              <Form.Item label="Icon" name="icon">
                <Input placeholder={"Icon"} />
              </Form.Item>
              <Form.Item
                label="Order No"
                name="orderNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input order no.",
                  },
                ]}
              >
                <InputNumber min={1} placeholder="Order no" />
              </Form.Item>
              <Form.Item label="Path" name="path">
                <Input placeholder="Path" />
              </Form.Item>
              <Form.Item label="Parent" name="parentId">
                <TreeSelect
                  style={{
                    width: "100%",
                  }}
                  treeData={this.state.treeData ?? []}
                  placeholder="Select Parent"
                  treeDefaultExpandAll={false}
                  showSearch
                  allowClear
                  onChange={this.enableFeature}
                />
              </Form.Item>
              <Form.Item
                name="moduleName"
                rules={[
                  {
                    required: true,
                    message: "Please input module name!",
                  },
                ]}
                label="Module Selection"
              >
                <Select placeholder="Select Module">
                  <Option value="oee">OEE</Option>
                  <Option value="energy">Energy</Option>
                  <Option value="preventivemaintenance">
                    Preventive Maintenance
                  </Option>
                  <Option value="inspectionmanagement">
                    Inspection Management
                  </Option>
                  <Option value="qualityinspection">Quality Inspection</Option>
                  <Option value="managementconsole">Management Console</Option>
                  <Option value="conditionbasedmonitoring">
                    Condition Monitoring
                  </Option>
                  <Option value="digitalworkinstructions">
                    Digital Work Instructions
                  </Option>
                  <Option value="digitaljobcard">Digital Job Card</Option>
                  <Option value="sparepartsinventory">
                    Spare Parts Inventory
                  </Option>
                  <Option value="digitalJobCard">Digital Job Card</Option>
                  <Option value="trackAndTrace">Track & Trace</Option>
                </Select>
              </Form.Item>
              <Form.Item label={`Feature`} name="userAccessFeatureMappings">
                <Select
                  loading={this.state.checkTypeLoading}
                  placeholder="Select Feature"
                  mode="multiple"
                  // optionFilterProp="label"
                  options={this.state.featureName?.map((e) => ({
                    label: e.featureName,
                    value: e.userAccessFeatureId,
                  }))}
                  disabled={this.state.isFeatureDisabled}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "5px 0px 0px" }} />
                      <AddNewFeature
                        handleCancel={this.handleCancel}
                        mode={"Add"}
                      />
                      <Button
                        icon={<EditOutlined />}
                        block
                        onClick={this.showModal}
                        disabled={this.state.isFeatureDisabled}
                      >
                        Edit list
                      </Button>
                    </>
                  )}
                />
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

        <Modal
          title="Edit Feature"
          open={this.state.isModalOpen}
          footer={null}
          onCancel={this.handleCancel}
        >
          {this.state.featureEditMode ? (
            <AddNewFeature
              handleCancel={this.handleCancel}
              mode={"Update"}
              featureEditModeCancel={this.featureEditModeCancel}
              id={this.state.featureEditId}
            />
          ) : (
            <>
              <Table
                size="middle"
                dataSource={this.state.featureNameForEdit}
                columns={columns}
                pagination={{
                  showSizeChanger: true,

                  //showQuickJumper: true,

                  size: "default",
                }}
                style={{ margin: "5px 0px 0px" }}
              />
            </>
          )}
        </Modal>
      </>
    );
  }
}
const mapDispatchToProps = {
  menuRefresh: menuRefresh,
};

export default connect(null, mapDispatchToProps)(withForm(MenuForm));
