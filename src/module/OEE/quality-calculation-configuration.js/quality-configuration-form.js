import { Button, Col, Form, Input, InputNumber, Row, Select, Spin } from "antd";
import ModelMasterConfigurationService from "../../../services/oee/model-master-configuration-service";
import QualityCalculationService from "../../../services/oee/quality-calculation-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
const { Option } = Select;
const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log(`selected ${value}`);
};
const { TextArea } = Input;

class QualityConfigurationForm extends PageForm {
  service = new QualityCalculationService();
  modelMasterConfigurationService = new ModelMasterConfigurationService();
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
    this.modelMasterConfigurationService.list().then((response) => {
      this.setState((state) => ({ ...state, modelName: response.data }));
    });
    this.modelMasterConfigurationService.list().then((response) => {
      this.setState((state) => ({ ...state, modelNumber: response.data }));
    });
  }
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
              label="Quality Configuration Id"
              name="qualityconfigurationId"
              hidden
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              label="Model Name"
              name="modelMasterId"
              rules={[
                { required: true, message: "Please select the Model Name !" },
              ]}
            >
              <Select
                style={{
                  width: "315px",
                }}
                placeholder="Select Model Name"
                onChange={onChange}
                onSearch={onSearch}
              >
                {this.state.modelName?.map((e) => (
                  <Option
                    key={`modelName${e.modelMasterId}`}
                    value={e.modelMasterId}
                  >
                    {e.modelName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Model Number"
              name="modelMasterId"
              rules={[
                { required: true, message: "Please select the Model Number !" },
              ]}
            >
              <Select
                style={{
                  width: "315px",
                }}
                showSearch
                placeholder="Select Model Number"
                optionFilterProp="children"
                // onChange={this.loadHierarchy}
                onSearch={onSearch}
              >
                {this.state.modelNumber?.map((e) => (
                  <Option
                    key={`modelNumber${e.modelMasterId}`}
                    value={e.modelMasterId}
                  >
                    {e.modelNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Total Part Count"
              name="totalPartCount"
              rules={[
                {
                  required: true,
                  message: "Please Enter the Total Part Count!",
                },
              ]}
            >
              <Input placeholder="Enter Total Part Count" />
            </Form.Item>

            <Form.Item
              label="Rejected Part Count"
              name="rejectedPartCount"
              rules={[
                {
                  required: true,
                  message: "Please Enter the Rejected Part Count!",
                },
              ]}
            >
              <Input placeholder="Enter Accepted Part Count" />
            </Form.Item>
            <Form.Item label="Reason" name="reason">
              <TextArea
                rows={4}
                placeholder="Enter the Reason"
                maxLength={100}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(QualityConfigurationForm);
