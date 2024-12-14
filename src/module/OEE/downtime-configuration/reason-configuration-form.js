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
  Radio,
  TreeSelect,
  // ColorPicker,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import ColorPicker from "./color-picker";
import AssetService from "../../../services/asset-service";
import ModuleSelectionService from "../../../services/preventive-maintenance-services/module-selection-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
const { Option } = Select;
class ReasonConfigurationForm extends PageForm {
  service = new DowntimeReasonService();
  assetservice = new AssetService();
  appHierarchyService = new AppHierarchyService();
  moduleService = new ModuleSelectionService();
  state = {
    reasons: [],
    asset: [],
    ticketStatus: false,
  };
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
    this.props.form.setFieldValue("colourCode", "#000000");
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  setColourHide = () => {
    if (this.props.form.getFieldValue("parentId")) {
      this.setState((state) => ({ ...state, hidden: true }));
    } else {
      this.setState((state) => ({ ...state, hidden: false }));
    }
  };
  handleAssetChange = (assetId) => {
    const selectedAsset = this.state.asset.find((e) => e.assetId === assetId);
    console.log(selectedAsset, "Seleee");
    if (selectedAsset) {
      this.props.form.setFieldsValue({
        assetId: selectedAsset.assetId,
        assetName: selectedAsset.assetName,
      });
    }
  };
  patchForm(values) {
    console.log(values, "value");
    if (values.colourCode || values.plannedDownTime) {
      this.setState((state) => ({ ...state, hidden: false }));
    } else {
      this.setState((state) => ({ ...state, hidden: true }));
    }
    this.props.form.setFieldsValue({
      downtimeReasonId: values.downtimeReasonId,
      downtimeReason: values.downtimeReason,
      parentId: values.parentId,
      colourCode: values.colourCode,
      assetId: values.assetId,
      assetName: values.assetName,
      plannedDownTime: values.plannedDownTime,
    });
    this.service.list().then(({ data }) => {
      const ind = data.findIndex(
        (e) => e.downtimeReasonId === values.downtimeReasonId
      );
      data.splice(ind, 1);
      // console.log("data", data);
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId == null),
      }));
    });
  }
  // changeStatus = (status) => {
  //   this.setState((state) => ({
  //     ...state,
  //     ticketStatus: status.target.value,
  //   }));
  //   if (status.target.value) {
  //     const desiredModules = [
  //       "preventivemaintenance",
  //       "qualityinspection",
  //       "inspectionmanagement",
  //     ];
  //     this.moduleService.basedOnAhid(assetData?.ahid).then(({ data }) => {
  //       const moduleNamesArray = data?.moduleName
  //         ?.filter((value) => desiredModules.includes(value))
  //         .map((name) => ({
  //           label: name,
  //           value: name,
  //         }));
  //       this.setState((state) => ({ ...state, moduleNames: moduleNamesArray }));
  //     });
  //   }
  // };
  // onFinish(data) {
  //   // this.assetservice.alertTicket({
  //   // })
  // }
  getAppHierarchyList() {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState(
          (state) => ({
            ...state,
            parentTreeList: this.appHierarchyService.convertToSelectTree(data),
          }),
          () => {
            this.props.form?.setFieldValue(
              "ahId",

              this.state.parentTreeList[0]?.value
            );
            this.getAssetList(this.state.parentTreeList[0]?.value);
          }
        );
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  }
  getAssetList = (ahId) => {
    this.assetservice.list({ active: true, aHId: ahId }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
  };
  componentDidMount() {
    this.service.list().then(({ data }) => {
      console.log("data", data);
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId === null),
        normalReasons: data,
      }));
    });
    this.getAppHierarchyList();
    this.props.form.setFieldValue("colourCode", "#000000");
    this.getAssetList();
  }

  render() {
    console.log("stateeee", this.state);

    const { hidden } = this.state;

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
            <Form.Item label="Main Reason Id" name="downtimeReasonId" hidden>
              <InputNumber />
            </Form.Item>

            <Form.Item
              label="Reason"
              name="downtimeReason"
              rules={[
                { required: true, message: "Please enter your Reason!" },
                {
                  validator: async (_, value) => {
                    if (/[A-Za-z]/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Field should contain Characters");
                  },
                },
              ]}
            >
              <Input autoFocus maxLength={40} />
            </Form.Item>
            <Form.Item label="Parent" name="parentId">
              <Select
                disabled={this.state.disable}
                onChange={this.setColourHide}
                allowClear
              >
                {this.state.reasons?.map((e) => (
                  <Option key={e.downtimeReasonId} value={e.downtimeReasonId}>
                    {e.downtimeReason}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="ahId" style={{ minWidth: "250px" }}>
              <TreeSelect
                treeNodeFilterProp="title"
                onChange={(v) => {
                  this.getAssetList(v);
                  this.list(v);
                }}
                showSearch
                loading={this.state.isparentTreeListLoading}
                placeholder="Entity"
                allowClear
                treeData={this.state.parentTreeList}
              ></TreeSelect>
            </Form.Item>
            {hidden ? null : (
              <Form.Item label="Planned Downtime" name="plannedDownTime">
                <Radio.Group defaultValue={false}>
                  <Radio value={true}>True</Radio>
                  <Radio value={false}>False</Radio>
                </Radio.Group>
              </Form.Item>
            )}
            {hidden ? null : (
              <Form.Item
                label="Asset"
                name="assetId"
                rules={[
                  {
                    required: true,
                    message: "Please Select Asset Name!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  onChange={this.handleAssetChange}
                  allowClear
                >
                  {this.state.asset?.map((e) => (
                    <Option key={`asset${e.assetId}`} value={e.assetId}>
                      {e.assetName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {/* <Form.Item label="Ticket Generation" name="status">
              <Radio.Group onChange={this.changeStatus} defaultValue={false}>
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>
            {this.state.ticketStatus && (
              <Form.Item
                label="Module Name"
                name={"moduleName"}
                rules={[
                  { required: true, message: "Please input module Name!" },
                ]}
              >
                <Select
                  // onChange={getParameter}
                  // loading={parameterLoading}

                  autoFocus
                  mode="multiple"
                  // options={moduleNames}
                />
              </Form.Item>
            )} */}
            {hidden ? null : (
              <Form.Item
                label="Colour"
                name="colourCode"
                rules={[
                  { required: true, message: "Please select any colour!" },
                ]}
              >
                {this.props.mode == "View" ? (
                  <Space>
                    <div
                      style={{
                        borderRadius: "5px",
                        backgroundColor:
                          this.props.form.getFieldValue("colourCode"),
                        width: "25px",
                        height: "25px",
                      }}
                    ></div>
                    {this.props.form.getFieldValue("colourCode")}
                    {/* <span style={{marginLeft:"5px"}}>{text}  </ span> */}
                  </Space>
                ) : (
                  <ColorPicker
                    value={this.props.form.getFieldValue("colourCode")}
                    onChange={(color) =>
                      this.props.form.setFieldsValue({ colorCode: color })
                    }
                  />
                )}
              </Form.Item>
            )}
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ReasonConfigurationForm);
