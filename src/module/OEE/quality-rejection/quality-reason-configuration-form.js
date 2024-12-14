import React from "react";
import { Button, Col, Form, InputNumber, Row, Select, Spin, Input } from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import QualityReasonService from "../../../services/oee/quality-reason-service";
import AssetService from "../../../services/asset-service";

const { Option } = Select;

class QualityReasonConfigurationForm extends PageForm {
  service = new QualityReasonService();
  assetservice = new AssetService();

  state = {
    reasons: [],
    asset: [],
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
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  handleAssetChange = (assetId) => {
    const selectedAsset = this.state.asset.find((e) => e.assetId === assetId);
    if (selectedAsset) {
      this.props.form.setFieldsValue({
        assetId: selectedAsset.assetId,
        assetName: selectedAsset.assetName,
      });
    }
  };

  patchForm(values) {
    console.log(values, "values");
    if (values.colourCode) {
      this.setState((state) => ({ ...state, hidden: false }));
    } else {
      this.setState((state) => ({ ...state, hidden: true }));
    }
    this.props.form.setFieldsValue({
      qualityRejectionReasonId: values.qualityRejectionReasonId,
      qualityRejectionReason: values.qualityRejectionReason,
      parentId: values.parentId,
      assetId: values.assetId,
      assetName: values.assetName,
    });
    this.service.list().then(({ data }) => {
      const ind = data.findIndex(
        (e) => e.qualityRejectionReasonId === values.qualityRejectionReasonId
      );
      data.splice(ind, 1);
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId == null),
      }));
    });
  }

  componentDidMount() {
    this.service.list().then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId === null),
        normalReasons: data,
      }));
    });
    this.assetservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
  }

  render() {
    const { hidden } = this.state;
    return (
      <Popups
        footer={[
          <Row justify="space-between" key="footer">
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
            <Form.Item label="Reason Id" name="qualityRejectionReasonId" hidden>
              <InputNumber />
            </Form.Item>
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
              >
                {this.state.asset?.map((e) => (
                  <Option key={`asset${e.assetId}`} value={e.assetId}>
                    {e.assetName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quality Reason"
              name="qualityRejectionReason"
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
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(QualityReasonConfigurationForm);
