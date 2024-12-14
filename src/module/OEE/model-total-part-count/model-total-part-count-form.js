import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Spin,
  Input,
  Radio,
  DatePicker,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import ModelTotalPartCountService from "../../../services/oee/model-total-part-count-service";
import ModelConfigurationService from "../../../services/oee/model-configuration-service";
import dayjs from "dayjs";
import moment from "moment";
const { Option } = Select;
class ModelTotalPartCountForm extends PageForm {
  state = {
    hideDateRange: true,
  };
  service = new ModelTotalPartCountService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();
  modelConfigurationService = new ModelConfigurationService();
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
    this.appHierarchyService.list({ active: true }).then((response) => {
      this.setState((state) => ({
        ...state,
        parentTreeList: this.appHierarchyService.convertToSelectTree(
          response.data
        ),
      }));
      this.setState((state) => ({ ...state, appHierarchy: response.data }));
    });
    this.assetService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
      // console.log(response.data, "data");
    });
  }

  loadAsset = () => {
    const ahId = this.props.form.getFieldValue("ahid");
    this.assetService.list({ aHId: ahId }).then(({ data }) => {
      this.setState((state) => ({ ...state, asset: data }));
      if (data.length === 0) {
        this.props.form.setFieldValue("asset", "");
      }
    });
  };
  handleAssetChange = (assetId) => {
    this.modelConfigurationService
      .list({ assetId: assetId })
      .then(({ data }) => {
        this.setState((state) => ({ ...state, modelName: data }));
      });
  };
  loadHierarchy = () => {
    const assetId = this.props.form.getFieldValue("asset");
    this.assetService.list({ assetId: assetId }).then(({ data }) => {
      this.props.form.setFieldValue("ahid", data[0].ahid);
    });
  };
  // onFinish = (data) => {
  //   // if (data.success) {
  //   this.service.postTargetedPartCount(data).then(({ data }) => {
  //     console.log("targetdata", data);
  //   });
  //   // }
  // };
  // setDate = (value) => {
  //   switch (value) {
  //     case "day":
  //       this.props.form.setFieldsValue({
  //         range: `${dayjs().startOf("D").format("DD-MM-YYYY")} to ${dayjs()
  //           .endOf("D")
  //           .format("DD-MM-YYYY")}`,
  //       });
  //       this.setState({ hideDateRange: false });
  //       break;
  //     case "weekly":
  //       this.props.form.setFieldsValue({
  //         range: `${dayjs().startOf("week").format("DD-MM-YYYY")} to ${dayjs()
  //           .endOf("week")
  //           .format("DD-MM-YYYY")}`,
  //       });
  //       this.setState({ hideDateRange: false });
  //       break;
  //     case "monthly":
  //       this.props.form.setFieldsValue({
  //         range: `${dayjs().startOf("M").format("DD-MM-YYYY")} to ${dayjs()
  //           .endOf("M")
  //           .format("DD-MM-YYYY")}`,
  //       });
  //       this.setState({ hideDateRange: false });
  //       break;

  //     default:
  //       this.setState({ hideDateRange: true });
  //       break;
  //   }
  // };
  patchForm(data) {
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        startDate: moment(data.startDate),
      });
    }
  }
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
              label="Asset"
              name="assetId"
              rules={[{ required: true, message: "Please select the asset !" }]}
            >
              <Select
                style={{
                  width: 315,
                }}
                showSearch
                placeholder="Select Asset"
                optionFilterProp="children"
                onChange={this.handleAssetChange}
              >
                {this.state.asset?.map((e) => (
                  <Option key={e.assetId} value={e.assetId}>
                    {e.assetName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Model Name"
              name="modelId"
              rules={[
                { required: true, message: "Please select the Model Name !" },
              ]}
            >
              <Select
                style={{
                  width: 315,
                }}
                showSearch
                placeholder="Select Model Name"
                optionFilterProp="children"
                onChange={this.loadHierarchy}
              >
                {this.state.modelName?.map((e) => (
                  <Option
                    key={e.modelConfigurationId}
                    value={e.modelConfigurationId}
                  >
                    {e.modelName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Targeted Partcount"
              name="targetedPartCount"
              rules={[
                { required: true, message: "Please enter targeted number!" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Duration Period"
              name="durationPeriod"
              initialValue={"day"}
              rules={[
                {
                  required: true,
                  message: "Please select the duration period!",
                },
              ]}
            >
              <Select
                onChange={this.setDate}
                style={{
                  width: 315,
                }}
              >
                {/* <Option key={1} value={"shift"}>
                  {"Shift"}
                </Option> */}
                <Option key={2} value={"day"}>
                  {"Day"}
                </Option>
                {/* <Option key={3} value={"weekly"}>
                  {"Weekly"}
                </Option>
                <Option key={4} value={"monthly"}>
                  {"Monthly"}
                </Option> */}
              </Select>
            </Form.Item>
            {/* {!this.state.hideDateRange && (
              <Form.Item label="Range" name={"range"}>
                <Input style={{ minWidth: "250px" }} readOnly />
              </Form.Item>
            )} */}
            <Form.Item
              label="Start Date "
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Please select the Start Date!",
                },
              ]}
            >
              <DatePicker
                style={{
                  width: 315,
                }}
              />
            </Form.Item>
            <Form.Item
              label=" Performance "
              name="setPerformance"
              initialValue={true}
            >
              <Radio.Group>
                <Radio value={true}>100% Performance </Radio>
                <Radio value={false}>Calculate</Radio>
              </Radio.Group>
            </Form.Item>
            {this.props.mode === "Update" ? (
              <Form.Item
                label="PartProduced"
                name="actualPartProduced"
                rules={[
                  {
                    required: true,
                    message: "Please enter PartProduced !",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            ) : (
              ""
            )}
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ModelTotalPartCountForm);
