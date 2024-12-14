import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Spin,
  Typography,
} from "antd";
import React from "react";

import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import Page from "../../../utils/page/page";
import OeeCalculationService from "../../../services/oee-calculation-service";
import { withRouter } from "../../../utils/with-router";

class OeeSettingForm extends PageForm {
  oeeManualService = new OeeCalculationService();

  state = { manualDataStatus: false, manualData: [] };
  componentDidMount() {
    super.componentDidMount();
    this.oeeManualService
      .getManualEntry(this.props.params.assetId)
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          manualDataStatus: !!data,
          manualData: data,
        }));
        if (!!data) {
          super.patchForm(data);
        }
      });
  }
  onFinish1 = (values) => {
    if (this.state.manualDataStatus && this.state.manualData.oeeManualId) {
      this.oeeManualService
        .putManualEntry(this.state.manualData?.oeeManualId, values)
        .then(({ data }) => {
          super.onSuccess(data);
        });
    } else {
      this.oeeManualService.postManualEntry(values).then(({ data }) => {
        super.onSuccess(data);
      });
    }
  };
  render() {
    const { form, params } = this.props;

    return (
      <Spin spinning={!!this.state.isLoading}>
        <Typography.Title level={5}>OEE Manual Entry</Typography.Title>
        {/* <Page title="OEE Manual Entry"> */}
        <Form
          // size="small"
          form={form}
          colon={false}
          // labelCol={{ sm: 12, xs: 24 }}
          // wrapperCol={{ sm: 12, xs: 24 }}
          // labelAlign="left"
          layout="vertical"
          onFinish={this.onFinish1}
          preserve={false}
          initialValues={{
            availability: false,
            performance: false,
            quality: false,
            assetId: params.assetId,
          }}
        >
          <Row align="bottom" gutter={[10, 10]}>
            <Col md={24}>
              <Form.Item label="Asset Id" name="assetId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="availability"
                label="Availability Status"
                rules={[
                  {
                    required: true,
                    message: "Please select availability status",
                  },
                ]}
              >
                <Radio.Group defaultValue={false}>
                  <Radio value={true}>Manual</Radio>
                  <Radio value={false}>Auto</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                name="performance"
                label="Performance Status"
                rules={[
                  {
                    required: true,
                    message: "Please select performance status",
                  },
                ]}
              >
                <Radio.Group defaultValue={false}>
                  <Radio value={true}>Manual</Radio>
                  <Radio value={false}>Auto</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                name="quality"
                label="Quality Status"
                rules={[
                  { required: true, message: "Please select quality status" },
                ]}
              >
                <Radio.Group defaultValue={false}>
                  <Radio value={true}>Manual</Radio>
                  <Radio value={false}>Auto</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col md={24}>
              <Flex justify="flex-end">
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
        {/* </Page> */}
      </Spin>
    );
  }
}

export default withRouter(withForm(OeeSettingForm));
