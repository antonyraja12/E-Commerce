import { Button, Col, Form, InputNumber, Row, Spin, Input, Radio } from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import ModelMasterConfigurationService from "../../../services/oee/model-master-configuration-service";

class ModelMasterConfigurationForm extends PageForm {
  service = new ModelMasterConfigurationService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();
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
      if (data.length == 0) {
        this.props.form.setFieldValue("asset", "");
      }
    });
  };

  loadHierarchy = () => {
    const assetId = this.props.form.getFieldValue("asset");
    this.assetService.list({ assetId: assetId }).then(({ data }) => {
      this.props.form.setFieldValue("ahid", data[0].ahid);
    });
  };

  render() {
    // const { hidden } = this.state;
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
                  htmlType="submit">
                  {this.props.mode == "Add" ? "Save" : "Update"}
                </Button>
              )}
            </Col>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}>
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
            disabled={this.props.disabled}>
            <Form.Item name="modelMasterId" hidden>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Model Name"
              name="modelName"
              rules={[{ required: true, message: "Please entre your Name!" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Model Number "
              name="modelNumber"
              rules={[
                { required: true, message: "Please enter your Number!" },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item label=" Status " name="status" initialValue={true}>
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(ModelMasterConfigurationForm);
