import { Button, Form, Input, Spin, Flex, Radio } from "antd";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { checkTypePageId } from "../../../helpers/page-ids";
import { validateName } from "../../../helpers/validation";
import FeatureService from "../../../services/feature-service";

class AddNewFeature extends PageForm {
  pageId = checkTypePageId;
  service = new FeatureService();
  handleCancel = this.props.handleCancel;
  featureEditModeCancel = this.props.featureEditModeCancel;
  cancelEdit = () => {
    this.props.featureEditModeCancel();
  };
  onSuccess(data) {
    super.onSuccess(data);
    if (this.props.form) {
      this.props.form.resetFields(["featureName"]);
    }
    this.props.featureEditModeCancel();
  }
  patchForm(data) {
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        checkTypeName: data.checkTypeName,
      });
    }
  }
  onFinish1 = (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.saveFn(data)
      .then(({ data, statuscode }) => {
        if (data) {
          this.onSuccess(data);
        } else {
          this.onSuccess({ success: true, message: "Added Successfully" });
        }
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
        this.handleCancel();
      });
  };
  render() {
    return (
      <>
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            className="form-horizontal"
            layout="horizontal"
            form={this.props.form}
            labelAlign="left"
            colon={false}
            disabled={this.props.disabled}
            onFinish={this.onFinish1}
          >
            <Form.Item name="checkTypeId" hidden>
              <Input />
            </Form.Item>

            <Flex>
              <Form.Item
                label={this.props.mode === "Update" ? "Feature Name" : ""}
                name="featureName"
                style={
                  this.props.mode === "Update"
                    ? { padding: "0px", width: "100%" }
                    : { padding: "0px", margin: "5px 0px", width: "100%" }
                }
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter the Feature!",
                  },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input
                  placeholder="Feature Name"
                  style={
                    this.props.mode === "Update"
                      ? null
                      : {
                          padding: "2px 10px",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                        }
                  }
                />
              </Form.Item>
              {this.props.mode === "Add" && (
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  style={{
                    margin: "5px 0px",
                    height: "28px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                >
                  {this.props.mode === "Add" ? "Save" : "Update"}
                </Button>
              )}
            </Flex>
            {this.props.mode === "Update" && (
              <Form.Item
                label="Status"
                name="status"
                labelCol={{ span: 8 }}
                style={{
                  padding: "0px",
                  width: "100%",
                }}
              >
                <Radio.Group defaultValue={true}>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Form.Item>
            )}
            {this.props.mode === "Update" && (
              <Flex justify="space-between">
                <Button key="close" onClick={this.cancelEdit}>
                  Cancel
                </Button>
                <Button key="submit" type="primary" htmlType="submit">
                  {this.props.mode === "Add" ? "Save" : "Update"}
                </Button>
              </Flex>
            )}
          </Form>
        </Spin>
      </>
    );
  }
}

export default withForm(AddNewFeature);
