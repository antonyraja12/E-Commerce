import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Spin,
  Input,
  Space,
  TreeSelect,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import ModelConfigurationService from "../../../services/oee/model-configuration-service";
import ModelMasterConfigurationService from "../../../services/oee/model-master-configuration-service";
const { Option } = Select;
const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log(`selected ${value}`);
};
const { TextArea } = Input;

class ModelConfigurationForm extends PageForm {
  service = new ModelConfigurationService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();
  modelMasterConfigurationService = new ModelMasterConfigurationService();
  constructor(props) {
    super(props);
    this.state = {
      val: "",
    };
  }

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
    this.service.list().then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId === null),
      }));
    });
    this.setState((state) => ({ ...state, hidden: false }));
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  componentDidMount() {
    this.assetService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
    this.modelMasterConfigurationService
      .list()
      .then((response) => {
        this.setState((state) => ({ ...state, modelName: response.data }));
      })
      .catch((error) => {
        console.error("Error fetching appHierarchy:", error);
      });
    this.loadAppHierarchy();
    super.componentDidMount();
  }
  logValues = (values) => {
    console.log("values", values);
  };
  loadAsset = () => {
    const ahId = this.props.form.getFieldValue("ahid");
    this.assetService.list({ aHId: ahId }).then(({ data }) => {
      this.setState((state) => ({ ...state, asset: data }));

      if (data.length == 0) {
        this.props.form.setFieldValue("asset", data);
      }
      // console.log("ahid", data);
    });
  };
  handleChange = (e) => {
    this.setState({
      val: e.target.value.replace(/[^0-9]/g, "").replace(/[eE-]/g, ""),
    });
  };
  handleAssetChange = (assetId) => {
    const selectedAsset = this.state.asset.find(
      (asset) => asset.assetId === assetId
    );

    if (selectedAsset && selectedAsset.appHierarchy) {
      const selectedHierarchy = selectedAsset.appHierarchy;
      this.setState({
        selectedHierarchy: {
          title: selectedHierarchy.ahname,
          value: selectedHierarchy.ahid,
          key: selectedHierarchy.ahid,
          selectable: false,
        },
      });
      this.props.form.setFieldsValue({
        ahid: selectedHierarchy.ahid,
      });
    } else {
      this.setState({
        selectedHierarchy: null,
      });
      this.props.form.setFieldsValue({
        ahid: undefined,
      });
    }
  };
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
    // console.log(this.state.modelName, "ModelName");
    const { hidden } = this.state;
    // console.log("ahid", this.state.loadAppHierarchy);
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
            <Form.Item
              label="Model Configuration Id"
              name="modelConfigurationId"
              hidden
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Asset"
              name="assetId"
              rules={[{ required: true, message: "Please select the asset !" }]}
            >
              <Select
                style={{
                  width: "315px",
                }}
                showSearch
                placeholder="Select Asset"
                optionFilterProp="children"
                onChange={this.handleAssetChange}
                onSearch={onSearch}
              >
                {this.state.asset?.map((e) => (
                  <Option key={`asset${e.assetId}`} value={e.assetId}>
                    {e.assetName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Hierarchy"
              name="ahid"
              rules={[{ required: true }]}
            >
              <TreeSelect
                showSearch
                placeholder="Select Hierarchy"
                treeDefaultExpandAll={false}
                style={{ width: "100%" }}
                allowClear
                treeData={
                  this.state.selectedHierarchy
                    ? [this.state.selectedHierarchy]
                    : []
                }
              />
            </Form.Item>

            <Form.Item
              label="Model Name"
              name="modelName"
              rules={[
                { required: true, message: "Please select the Model Name !" },
              ]}
            >
              <Select
                style={{
                  width: "315px",
                }}
                showSearch
                placeholder="Select Model Name"
                optionFilterProp="children"
                onChange={this.loadHierarchy}
                onSearch={onSearch}
              >
                {this.state.modelName?.map((e) => (
                  <Option key={`modelName${e.modelName}`} value={e.modelName}>
                    {e.modelName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Program Name"
              name="programName"
              rules={[
                { required: true, message: "Please enter the Program Name !" },
              ]}
            >
              <Input
                style={{
                  width: "315px",
                }}
                placeholder="Enter Program Name"
              />
            </Form.Item>
            <Form.Item
              label="Product Code"
              name="productCode"
              rules={[
                { required: true, message: "Please Enter the Product Code!" },
              ]}
            >
              <Input placeholder="Enter Product Code" />
            </Form.Item>
            <Form.Item
              label="Cycle Time (mins)"
              name="cycleTime"
              rules={[
                { required: true, message: "Please Enter the Cycle Time!" },
              ]}
            >
              <InputNumber
                type="number"
                placeholder="Enter Cycle Time"
                style={{ width: "100%" }}
                value={this.state.val}
                onChange={this.handleChange}
              />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea
                rows={4}
                placeholder="Enter the Description"
                maxLength={100}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ModelConfigurationForm);
