import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  TreeSelect,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { validateName } from "../../../../helpers/validation";
import MaintenanceTypeService from "../../../../services/inspection-management-services/maintenance-type-service";
import PriorityService from "../../../../services/inspection-management-services/priority-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";
import PriorityForm from "../priority/priority-form";

class MaintenanceTypeForm extends PageForm {
  service = new MaintenanceTypeService();
  priorityservice = new PriorityService();

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: { open: false },
    }));
    this.loadPriority();
    this.loadParent();
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  addPriority = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Priority", mode: "Add", open: true },
    }));
  };
  componentDidMount() {
    super.componentDidMount();
    this.loadParent();
    this.loadPriority();
  }
  loadPriority = () => {
    this.priorityservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, priorityData: response.data }));
    });
  };

  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.service
      .list({ status: true })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.service.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };

  render() {
    return (
      <>
        <Popups
          footer={[
            <Row justify="end">
              <Space>
                <Col>
                  {(this.props.mode === "Add" ||
                    this.props.mode === "Update") && (
                    <Button key="close" onClick={this.closePopup}>
                      Cancel
                    </Button>
                  )}
                </Col>
                <Col>
                  {(this.props.mode === "Add" ||
                    this.props.mode === "Update") && (
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
              </Space>
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
                disabled={this.state.disabled}
              >
                <Form.Item
                  name="maintenanceTypeName"
                  label=" Issue Type Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter the Issue Type ",
                    },
                    {
                      validator: validateName,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="maintenanceTypeParentId" label="Parent">
                  <TreeSelect
                    treeNodeFilterProp="title"
                    showSearch
                    treeDefaultExpandAll
                    style={{ width: "100%" }}
                    allowClear
                    treeData={this.state.parentTreeList}
                  />
                </Form.Item>
                <Row>
                  <Col sm={22}>
                    <Form.Item
                      name="priorityGroupId"
                      label="Priority"
                      rules={[
                        {
                          required: true,
                          message: "select Priority",
                        },
                      ]}
                    >
                      <Select
                        style={{
                          width: "90%",
                          marginLeft: "5%",
                        }}
                        showSearch
                        allowClear
                        optionFilterProp="children"
                      >
                        {this.state.priorityData?.map((option) => (
                          <Option
                            key={option.priorityGroupId}
                            value={option.priorityGroupId}
                            selected={option.priorityGroupName}
                          >
                            {option.priorityGroupName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col sm={1}>
                    <Form.Item label=" ">
                      <Tooltip title="Add Priority">
                        <Button onClick={() => this.addPriority()}>
                          <PlusOutlined />
                        </Button>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                </Row>
                {/* </Row> */}

                <Form.Item name="description" label="description">
                  <TextArea />
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
        </Popups>
        <PriorityForm {...this.state.popup} close={this.onClose} />
      </>
    );
  }
}
export default withForm(MaintenanceTypeForm);
