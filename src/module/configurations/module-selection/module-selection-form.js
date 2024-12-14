import {
  Button,
  Form,
  Select,
  Input,
  TreeSelect,
  Radio,
  Spin,
  Row,
  Col,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import ModuleSelectionService from "../../../services/preventive-maintenance-services/module-selection-service";
import { Option } from "antd/es/mentions";
const customFilterOption = (input, option) => {
  const inputValue = input.trim().toLowerCase();
  const optionValue = option.props.children.trim().toLowerCase();
  return optionValue.includes(inputValue);
};
class ModuleSelectionForm extends PageForm {
  // pageId = appHierarchyPageId;
  constructor(props) {
    super(props);
    this.state = {
      ahid: null,
      isLoading: false,
    };
  }

  service = new ModuleSelectionService();
  apphierarchyservice = new AppHierarchyService();

  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };
  onSuccess(data) {
    // console.log(data, "data success");
    super.onSuccess(data);
    this.closePopup(true);
    this.service.list();

    // this.loadParent();
  }
  componentDidMount() {
    // console.log("Received Entity Id:", this.props.ahid);
    this.setState({ isLoading: true });
    this.service.list({ active: true }).then((response) => {
      this.setState((state) => ({
        ...state,
        module: response.data,
        isLoading: false,
      }));
      // console.log(response.data, "Modulename");
    });
    this.loadParent();
    this.loadahid();
    super.componentDidMount();

    // this.onRetrieve()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.ahid !== this.props.ahid) {
      this.setState({ ahid: this.props.ahid }, () => {
        this.loadahid();
      });
    }
  }

  loadahid() {
    const { form, ahid } = this.props;
    // console.log(this.props,"props")

    if (form && ahid !== undefined && ahid !== null) {
      form.setFieldsValue({
        entityId: ahid,
      });
    } else {
      console.error("Form or ahid is not available");
    }
  }

  patchForm(data) {
    // console.log(data, "Update module data");
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        moduleSelectionId: data.moduleName.map(
          (e) => e.moduleName?.moduleSelectionId
        ),
      });
    }
  }
  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.apphierarchyservice
      .list()
      .then(({ data }) => {
        const dataNull = data.filter((e) => e.ahparentId === null);

        this.setState((state) => ({
          ...state,
          parentTreeList: this.apphierarchyservice.convertToSelectTree(data),
          parentTreeListFilter:
            this.apphierarchyservice.convertToSelectTree(dataNull),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };

  render() {
    // console.log("prop123", this.props);
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
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.props.form.submit}
                    htmlType="submit"
                  >
                    Add
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
              <Form.Item name="moduleSelectionId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Entity"
                name="entityId"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll
                  style={{ width: "100%" }}
                  allowClear
                  disabled={true}
                  treeData={this.state.parentTreeList}
                />
              </Form.Item>
              <Form.Item
                label="Module Selection"
                name="moduleName"
                rules={[
                  {
                    required: true,
                    message: "Please Select Module",
                  },
                ]}
              >
                <Select mode="multiple" filterOption={customFilterOption}>
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
                  <Option value="sparepartsinventory">
                    Spare Parts Inventory
                  </Option>
                </Select>
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
        {/* <AppHierarchyForm {...this.state.popup} close={this.onClose} /> */}
      </>
    );
  }
}

export default withForm(ModuleSelectionForm);
