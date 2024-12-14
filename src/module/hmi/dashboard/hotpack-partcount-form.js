import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Spin,
  Input,
  Radio,
  Select,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import QualityRejectionService from "../../../services/oee/quality-rejection-service";
import ModelConfigurationService from "../../../services/oee/model-configuration-service";

class HotPackPartCountForm extends PageForm {
  modelService = new ModelConfigurationService();
  service = new QualityRejectionService();

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  onFinish1 = (data) => {
    this.service
      .addParts(this.props.shiftAllocationId, data.modelId, data.partCounts)
      .then(({ data }) => {
        this.onSuccess({ message: "Added Successfully" });
      });
  };
  componentDidMount() {
    this.modelService.list({ assetId: this.props.assetId }).then((response) => {
      this.setState((state) => ({
        ...state,
        modelList: response.data.map((item) => ({
          label: item.modelName,
          value: item.modelConfigurationId,
        })),
      }));
    });
  }

  render() {
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
            onFinish={this.onFinish1}
            disabled={this.props.disabled}
          >
            <Form.Item
              label="Model Name"
              name="modelId"
              rules={[{ required: true, message: "Please select model!" }]}
            >
              <Select
                showSearch
                placeholder="Model Name"
                options={this.state.modelList}
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label="Part Count"
              name="partCounts"
              rules={[
                { required: true, message: "Please enter the part count!" },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(HotPackPartCountForm);
