import {
  Button,
  Form,
  Input,
  TreeSelect,
  Radio,
  Spin,
  Row,
  Col,
  InputNumber,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { AppHierarchyStructure_Pageid } from "../../../helpers/page-id-mapping";
import AppHierarchyStructureService from "../../../services/app-hierarchy/app-hierarchy-structure-service";
class AppHierarchyStructureForm extends PageForm {
  pageId = AppHierarchyStructure_Pageid;
  service = new AppHierarchyStructureService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  render() {
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
              <Form.Item
                label="Name"
                name="asName"
                rules={[
                  {
                    required: true,
                    message: "Please enter name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Level"
                name="level"
                rules={[
                  {
                    required: true,
                    message: "Please enter level",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="active" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(AppHierarchyStructureForm);
