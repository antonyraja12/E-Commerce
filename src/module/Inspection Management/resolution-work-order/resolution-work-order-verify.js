import {
  Button,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
import { dateFormat, publicUrl } from "../../../helpers/url";
import WorkorderResolutionService from "../../../services/inspection-management-services/workorder-resolution-service";
import WorkOrderVerifyService from "../../../services/inspection-management-services/workorder-verify-service";
import CurrentUserService from "../../../services/user-list-current-user-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
const { Panel } = Collapse;
const { Title } = Typography;
const { Column } = Table;

class ResolutionWorkOrderVerify extends PageForm {
  service = new WorkorderResolutionService();
  verifyservice = new WorkOrderVerifyService();
  currentuserService = new CurrentUserService();
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      reason: "",
    };
  }
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  saveFn(data) {
    return this.verifyservice.add(data);
  }
  onRetrieve(id) {
    this.setState({ ...this.state, isLoading: true });

    Promise.all([this.service.retrieve(id)]).then((response) => {
      this.setState({
        ...this.state,
        data: response[0].data,
        isLoading: false,
      });
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.onRetrieve(this.props.id);
    this.getCurrentUserList();
  }
  getCurrentUserList() {
    this.setState((state) => ({
      ...state,
      isCurrentListLoading: true,
      currentUser: null,
    }));
    this.currentuserService
      .getUser({ active: true, published: true })
      .then(({ data }) => {
        console.log(data, "data");
        this.setState((state) => ({
          ...state,
          currentUser: data.userId,
        }));
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isCurrentListLoading: false,
        }));
      });
  }

  approve = () => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .approve({ resolutionWorkOrderId: this.props.id })
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          this.props.next();
        } else message.error(response.data.message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  handleReasonInputChange = (e) => {
    this.setState({ reason: e.target.value });
  };
  handleCancel = () => {
    this.setState((state) => ({ ...state, isModalVisible: false, reason: "" }));
    this.props.form.resetFields();
  };
  reject = (value) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .reject(this.props.id, value.comments)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          this.props.next();
        } else message.error(response.data.message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };

  closeWorkOrder = () => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .closed({ resolutionWorkOrderId: this.props.id })
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
        } else message.error(response.data.message);
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };

  display() {
    return (
      <Spin spinning={this.state.isLoading}>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Typography.Title level={5}>Ticket Details</Typography.Title>
            <table className="display-table">
              <tr>
                <td>R.No</td>
                <td>{this.state.data?.rwoNumber}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td style={{ width: 200 }}>
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true }}
                    style={{ width: "100%" }}
                  >
                    {this.state.data?.description}
                  </Paragraph>
                </td>
              </tr>

              <tr>
                <td>Asset Name</td>
                <td>{this.state.data?.asset?.assetName}</td>
              </tr>
              <tr>
                <td>Start Date</td>
                <td>{dateFormat(this.state.data?.startDate)}</td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>{dateFormat(this.state.data?.dueDate)}</td>
              </tr>
              <tr>
                <td>Initiated By</td>
                <td>{this.state.data?.initiatedBy?.userName}</td>
              </tr>
              <tr>
                <td>Assigned To</td>
                <td>{this.state.data?.assignedTo?.userName}</td>
              </tr>
              <tr>
                <td>Priority</td>
                <td>{this.state.data?.priority}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{this.service.status(this.state.data?.status)}</td>
              </tr>
              {this.state.data?.remarks && (
                <tr>
                  <td>Issue</td>
                  <td>{this.state.data?.remarks}</td>
                </tr>
              )}
              {this.state.data?.comments && (
                <tr>
                  <td>Comment</td>
                  <td>{this.state.data?.comments}</td>
                </tr>
              )}
              {this.state.data?.rejectedReason && (
                <tr>
                  <td>Rejected Reason</td>
                  <td>{this.state.data?.rejectedReason}</td>
                </tr>
              )}
            </table>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>Solution Details</Typography.Title>
            <table className="display-table">
              <tr>
                <td>RCA</td>
                <td>{this.state.data?.rca}</td>
              </tr>
              <tr>
                <td>CA</td>
                <td>{this.state.data?.ca}</td>
              </tr>
              <tr>
                <td>PA</td>
                <td>{this.state.data?.pa}</td>
              </tr>
              <tr>
                <td>Before Resolved Image</td>
                <td>
                  {" "}
                  <Image
                    width={100}
                    src={`${publicUrl}${this.state.data?.beforeResolveImage}`}
                    fallback="data:image/png;base64,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"
                  />
                </td>
              </tr>
              <tr>
                <td>After Resolved Image</td>
                <td>
                  {" "}
                  <Image
                    width={100}
                    src={`${publicUrl}${this.state.data?.afterResolveImage}`}
                    fallback="data:image/png;base64,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"
                  />
                </td>
              </tr>
            </table>
          </Col>

          <Col span={24}>
            <Row justify="space-between">
              <Col>
                {this.props.c < 3 ? (
                  <Button onClick={this.props.prev}>Back</Button>
                ) : (
                  <></>
                )}
              </Col>

              <Col>
                {this.props.c == 2 ? (
                  <>
                    {!this.props.disabled &&
                    this.state.data?.initiatedBy?.userId ===
                      this.state.currentUser ? (
                      <Space>
                        <Button
                          danger
                          type="default"
                          onClick={() =>
                            this.setState((state) => ({ isModalVisible: true }))
                          }
                        >
                          Reject
                        </Button>
                        <Button type="primary" onClick={this.approve}>
                          Approve
                        </Button>
                      </Space>
                    ) : (
                      <Space>
                        <Link to="../">
                          <Button type="primary">Go To List</Button>
                        </Link>
                      </Space>
                    )}
                  </>
                ) : (
                  <Link to="../">
                    <Button type="primary">Go To List</Button>
                  </Link>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          title="Reason"
          visible={this.state.isModalVisible}
          onOk={this.props.form.submit}
          onCancel={this.handleCancel}
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.props.form.submit}
            >
              Submit
            </Button>,
          ]}
        >
          <Form form={this.props.form} onFinish={this.reject}>
            <Form.Item
              name="comments"
              rules={[
                {
                  required: true,
                  message: "Please enter comments",
                },
              ]}
            >
              <Input.TextArea
                style={{ width: "100%", height: "120px", fontSize: "14px" }}
                placeholder="Enter the reason."
                onChange={this.handleReasonInputChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    );
  }
  render() {
    return this.props.mode === "View" ? (
      <Popups
        footer={[
          <Row justify="space-between">
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
        {this.display()}
      </Popups>
    ) : (
      this.display()
    );
  }
}

export default withForm(ResolutionWorkOrderVerify);
