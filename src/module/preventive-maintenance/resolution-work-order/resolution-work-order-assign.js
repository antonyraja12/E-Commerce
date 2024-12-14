import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Row,
  Select,
  Spin,
  Card,
  Image,
  Tooltip,
  Modal,
} from "antd";
import { default as Moment, default as moment } from "moment";
import dayjs from "dayjs";
import React from "react";
import UserService from "../../../services/user-service";
import WorkOrderAssignService from "../../../services/preventive-maintenance-services/workorder-assign-service";
import WorkOrderResolutionService from "../../../services/preventive-maintenance-services/workorder-resolution-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import { publicUrl } from "../../../helpers/url";
import Paragraph from "antd/es/typography/Paragraph";
import Slider from "react-slick";

const { Option } = Select;

class ResolutionWorkOrderAssign extends PageForm {
  state = {
    modalVisible: false,
  };
  service = new WorkOrderResolutionService();
  assignservice = new WorkOrderAssignService();
  userService = new UserService();

  saveFn(data) {
    return this.assignservice.add({
      ...data,
      resolutionWorkOrderId: this.props.id,
    });
  }
  onSuccess(data) {
    super.onSuccess(data);
    this.props.next();
  }
  handleViewClick = () => {
    this.setState({ modalVisible: true });
  };
  render() {
    const settings = {
      dots: true,
      // dotsClass: "slick-dots custom-indicator",
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <Spin spinning={this.state.isLoading}>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 4 }}
              //bordered
              // layout="vertical"
              size="default"
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item key="l1" label="Description">
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true }}
                  style={{ width: "100%" }}
                >
                  {this.state.initialValues?.description}
                </Paragraph>
              </Descriptions.Item>
              <Descriptions.Item key="l2" label="Asset Name">
                {this.state.initialValues?.asset?.assetName}
              </Descriptions.Item>
              <Descriptions.Item key="l3" label="Scheduled Date">
                {Moment(this.state.initialValues?.startDate).format(
                  "DD-MM-YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item key="l4" label="Status">
                {this.service.status(this.state.initialValues?.status)}
              </Descriptions.Item>

              <Descriptions.Item key="l5" label="Reference Image" span={2}>
                <Tooltip
                  title={
                    this.state.initialValues?.imageUrl ? null : "No Preview"
                  }
                >
                  <Button
                    onClick={this.handleViewClick}
                    disabled={this.state.initialValues?.imageUrl ? false : true}
                  >
                    View
                  </Button>
                </Tooltip>
                <Modal
                  visible={this.state.modalVisible}
                  title="Preview"
                  onCancel={() => this.setState({ modalVisible: false })}
                  footer={null}
                  width={300}
                  height={300}
                  className="image-preview"
                >
                  <Slider {...settings}>
                    {this.state.initialValues?.imageUrl
                      ?.split(",")
                      ?.map((image, index) => (
                        <div key={index}>
                          <Image
                            // width={350}
                            //   height={300}
                            style={{ width: 300, height: 250 }}
                            src={`${publicUrl}${image}`}
                            fallback="data:image/png;base64,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"
                          />{" "}
                        </div>
                      ))}
                  </Slider>
                </Modal>
              </Descriptions.Item>
              {this.state.initialValues?.remarks && (
                <Descriptions.Item key="l6" label="Issue" span={6}>
                  {this.state.initialValues?.remarks}
                </Descriptions.Item>
              )}
              {this.state.initialValues?.comments && (
                <Descriptions.Item key="l6" label="Comment" span={6}>
                  {this.state.initialValues?.comments}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>

          <Col span={24}>
            <div className="details">
              <Form
                disabled={this.props.disabled}
                size="small"
                labelAlign="left"
                colon={false}
                layout="vertical"
                form={this.props.form}
                onFinish={this.onFinish}
              >
                <Row gutter={[10, 10]}>
                  <Col sm={8}>
                    <Form.Item
                      name="assignedToId"
                      label="Assigned to"
                      rules={[
                        {
                          required: true,
                          message: "Please select the above field!",
                        },
                      ]}
                    >
                      <Select showSearch optionFilterProp="children">
                        {this.state.user?.map((e) => (
                          <Option key={`User${e.userId}`} value={e.userId}>
                            {e.userName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={8}>
                    <Form.Item
                      name="priority"
                      label="Priority"
                      rules={[
                        {
                          required: true,
                          message: "Please select the Priority!",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="HIGH">High</Option>
                        <Option value="MEDIUM">Medium</Option>
                        <Option value="LOW">Low</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={8}>
                    <Form.Item
                      name="dueDate"
                      label="Due date"
                      rules={[
                        {
                          required: true,
                          message: "Please select Due Date!",
                        },
                      ]}
                    >
                      <DatePicker
                        defaultValue={moment()}
                        style={{ width: "100%" }}
                        format={"DD-MM-YYYY"}
                        disabledDate={(current) => {
                          return current && current < moment().add(-1, "days");
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col>{/* <Button htmlType="submit">CANCEL</Button> */}</Col>
                  <Col>
                    <Button type="primary" htmlType="submit">
                      Next
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Spin>
    );
  }
  patchForm(data) {
    this.props.form.setFieldsValue({
      priority: data.priority,
      assignedToId: data.assignedToId,
      dueDate: data.dueDate ? dayjs(data.dueDate) : null,
    });
  }

  componentDidMount() {
    this.userService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, user: response.data }));
    });

    super.componentDidMount();
  }
}

export default withForm(withRouter(ResolutionWorkOrderAssign));
