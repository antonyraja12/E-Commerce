import { Button, Col, Form, Input, Radio, Row, Select, Spin, Tour } from "antd";
import React from "react";
import { validateName } from "../../../../helpers/validation";
import ProcessListService from "../../../../services/digital-work-instruction-service/process-list-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";

// import { checkTypePageId } from "../../../helpers/page-ids";

const { Option } = Select;
var openSet;

class ProcessForm extends PageForm {
  // pageId = checkTypePageId;
  service = new ProcessListService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.service.list();
  }
  patchForm(data) {
    this.setState((state) => ({ ...state, isLoading: false }));
    if (this.props.form) {
      // console.log("data", data);
      this.props.form.setFieldsValue({
        ...data,
        processId: data.processId,
      });
    }
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
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button key="close" onClick={this.closePopup}>
                    Cancel
                  </Button>
                )}
              </Col>
              <Col>
                {(this.props.mode === "Add" || this.props.mode == "Update") && (
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
              {/* <Form.Item name="checkTypeId" hidden>
                <Input />
              </Form.Item> */}

              <Form.Item
                label="Process Name"
                name="processName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Process name!",
                  },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea maxLength={200} />
              </Form.Item>
              <Form.Item name="status" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Spin>
          <Tour
            steps={this.state.steps}
            isOpen={this.state.openTour}
            onRequestClose={this.handleClose}
          />
        </Popups>
      </>
    );
  }
}

export default withForm(ProcessForm);
