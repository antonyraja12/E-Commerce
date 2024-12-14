import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Spin,
  TreeSelect,
  Upload,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { Link } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import MaintenanceTypeService from "../../../services/inspection-management-services/maintenance-type-service";
import PriorityService from "../../../services/inspection-management-services/priority-service";
import WorkOrderResolutionService from "../../../services/inspection-management-services/workorder-resolution-service";
import Page from "../../../utils/page/page";
import PageForm from "../../../utils/page/page-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

class NewResolutionWorkOrderForm extends PageForm {
  priorityservice = new PriorityService();
  Maintenanceservice = new MaintenanceTypeService();
  assetService = new AssetService();
  service = new WorkOrderResolutionService();

  state = {
    fileList: [],
    file: null,
    isLoading: false,
  };

  componentDidMount() {
    this.assetService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, Assets: response.data }));
    });

    super.componentDidMount();
    this.loadParent();
  }
  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.Maintenanceservice.list({ status: true })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.Maintenanceservice.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };

  saveFun(data, file) {
    let formData = new FormData();
    for (let x in data) {
      if (x === "file" && file && file[0] && file[0].originFileObj) {
        formData.append(x, file?.[0].originFileObj);
      } else formData.append(x, data[x]);
    }
    return this.service.add(formData);
  }

  onChange = (info) => {
    this.setState({ ...this.state, fileList: info.fileList });
  };

  imageUpload = (file) => {
    this.setState({ ...this.state, isLoading: true });
    this.service
      .image(file)
      .then(({ data }) => {
        if (data.success) {
          message.success(data.message);
          this.getImage();
        } else {
          message.error(data.message);
        }
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
      });
  };

  onSubmit1 = (data) => {
    const { fileList } = this.state;
    this.setState((state) => ({ ...state, isLoading: true }));
    this.saveFun(data, fileList)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          this.props.navigate("..");
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
      });
  };

  handleMaintenanceTypeChange(maintenanceTypeId) {
    this.setState((state) => ({
      ...state,
      prioritySetLoading: true,
      prioritySetList: [],
    }));
    this.Maintenanceservice.retrieve(maintenanceTypeId)
      .then((response) => {
        this.setState((state, props) => ({
          ...state,
          prioritySetList: response.data.priority?.priorityMappingList,
        }));
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          prioritySetLoading: false,
        }));
      });
  }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page title={this.title}>
          <Card
            title="Create New Issue"
            style={{ width: "100%", margin: "0 auto" }}
            extra={
              <>
                <Link to="issue-type">
                  <Button type="primary">Add Issue Type</Button>
                </Link>
              </>
            }
          >
            <Form
              size="small"
              form={this.props.form}
              colon={false}
              labelCol={{ sm: 10, xs: 16 }}
              wrapperCol={{ sm: 10, xs: 10 }}
              labelAlign="left"
              layout="horizontal"
              onFinish={this.onSubmit1}
            >
              <Row gutter={[12, 32]}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Issue Type"
                    name="maintenanceTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Please Select the Issue Type",
                      },
                    ]}
                  >
                    <TreeSelect
                      onSelect={(v) => this.handleMaintenanceTypeChange(v)}
                      treeNodeFilterProp="title"
                      showSearch
                      treeDefaultExpandAll
                      style={{ width: "100%" }}
                      allowClear
                      treeData={this.state.parentTreeList}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Asset Name"
                    name="assetId"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Asset",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                    >
                      {this.state.Assets?.map((option) => (
                        <Option key={option.assetId} value={option.assetId}>
                          {option.assetName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col sm={12} xs={24}>
                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Priority ",
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: "100%",
                      }}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      loading={this.state.prioritySetLoading}
                    >
                      {this.state.prioritySetList?.map((option) => (
                        <Option
                          key={option.priorityMappingId}
                          value={option.value}
                        >
                          {option.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Machine Status"
                    name="machineStatus"
                    rules={[
                      {
                        required: true,
                        message: "Select The Machine Status",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }}>
                      <Option value={true}>Operational</Option>
                      <Option value={false}>Non-Operational</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Enter Description",
                      },
                    ]}
                  >
                    <TextArea rows={3} maxLength={200} />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="  Comment"
                    name="comments"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <TextArea rows={3} maxLength={200} />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item label="Image" name="file">
                    <ImgCrop rotate aspect={18 / 9}>
                      <Upload.Dragger
                        maxCount={1}
                        action={null}
                        listType="picture"
                        onChange={this.onChange}
                        fileList={this.state?.fileList}
                      >
                        <InboxOutlined />
                        <p className="ant-upload-text">Upload Image</p>
                      </Upload.Dragger>
                    </ImgCrop>
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={"end"}>
                <Col style={{ marginRight: "1%" }}>
                  <Link to="../">
                    <Button>Back</Button>
                  </Link>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Page>
      </Spin>
    );
  }
}
export default withForm(
  withRouter(withAuthorization(NewResolutionWorkOrderForm))
);
