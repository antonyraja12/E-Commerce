import { Button, Col, Form, Input, Radio, Row, Spin, TreeSelect } from "antd";
import { appHierarchyPageId } from "../../../../helpers/page-ids";
import AppHierarchyService from "../../../../services/app-hierarchy/app-hierarchy-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";

class AppHierarchyForm extends PageForm {
  pageId = appHierarchyPageId;
  service = new AppHierarchyService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
    this.loadParent();
  }
  componentDidMount() {
    this.loadParent();
    super.componentDidMount();

    // this.list();
  }
  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.service
      .list({})
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.service.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };
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
                name="ahname"
                rules={[
                  {
                    required: true,
                    message: "Please enter name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Under" name="ahparentId" rules={[]}>
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll
                  style={{ width: "100%" }}
                  allowClear
                  treeData={this.state.parentTreeList}
                />
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

export default withForm(AppHierarchyForm);
