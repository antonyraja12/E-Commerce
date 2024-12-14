import { Button, Col, Form, Input, InputNumber, Row, Spin, Radio } from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import TextArea from "antd/es/input/TextArea";
import SupplierService from "../../../services/inventory-services/supplier-service";
import { withForm } from "../../../utils/with-form";
import {
  validateEmail,
  validateName,
  validateNumber,
} from "../../../helpers/validation";

class SupplierForm extends PageForm {
  service = new SupplierService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  render() {
    // console.log("propsss", this.props);
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
            <Form.Item name="supplierId" hidden>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Supplier"
              name="supplierName"
              rules={[
                {
                  required: true,
                  message: "Please enter your supplier",
                },
                {
                  validator: validateName,
                },
              ]}
            >
              <Input autoFocus maxLength={20} />
            </Form.Item>
            <Form.Item
              label="SPOC Name"
              name="spocName"
              rules={[
                {
                  required: true,
                  message: "Please enter your SPOC name",
                },
              ]}
            >
              <Input autoFocus maxLength={20} />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter your contact number",
                },
              ]}
            >
              <InputNumber
                controls={false}
                style={{ width: "100%" }}
                autoFocus
                stringMode={false}
                maxLength={20}
              />
            </Form.Item>
            <Form.Item
              label="Mail Id"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your mail id",
                },
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input autoFocus />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue={true}>
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

export default withForm(SupplierForm);
