import { ExceptionOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Row,
  Spin,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { dateFormat, publicUrl } from "../../../helpers/url";
import CheckTypeService from "../../../services/preventive-maintenance-services/check-type-service";
import CheckListExecutionService from "../../../services/preventive-maintenance-services/checklist-execution-service";
import { withRouter } from "../../../utils/with-router";

const { TextArea } = Input;

class CheckListExecutionPreview extends Component {
  service = new CheckListExecutionService();
  checkTypeService = new CheckTypeService();
  state = {
    modalVisible: false,
    modalVisible1: false,
    imagesPreview: [],
    imageUrl: null,
  };

  images = () => {
    return (
      (this.state.tickets || this.state.noTickets)?.map((e, i) => {
        return e.imageUrl?.split(",")?.map((v, index) => v);
      }) || []
    );
  };

  title = "CheckList";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 20,
      align: "Left",
    },

    {
      dataIndex: "description",
      key: "description",
      title: "Check Description",
      width: 200,
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
    },
    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
    },
    {
      dataIndex: "remark",
      key: "remark",
      title: "Remarks",
    },
  ];
  onRetrieve(id) {
    this.setState({ ...this.state, isLoading: true });

    Promise.all([this.checkTypeService.list(), this.service.retrieve(id)]).then(
      (response) => {
        this.setState({
          ...this.state,
          checkType: response[0].data?.reduce((c, e) => {
            c[e.checkTypeId] = e.checkTypeName;
            return c;
          }, {}),
          data: response[1].data,
          tickets: response[1].data.checks?.filter((e) => e.status == "NO"),
          noTickets: response[1].data.checks?.filter((e) => e.status != "NO"),
          isLoading: false,
        });
      }
    );
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setState((state) => ({
        ...state,
        checkListExecutionId: this.props.params.id,
      }));
      this.onRetrieve(this.props.params.id);
    }

    // Calculate imagesPreview after the component mounts
    const imagesPreview = this.images();
    this.setState({ imagesPreview });
  }

  hasNoStatus = () => {
    return this.state.data?.checks.some((check) => check.status === "NO");
  };

  finish = () => {
    this.setState({ ...this.state, isLoading: true });
    this.service
      .update({ status: "Closed" }, this.props.params.id)
      .then((response) => {
        if (response.data) {
          message.success(response.data.message);
          this.props.navigate("..");
        } else message.error(response.data.message);
      })
      .catch((error) => {})
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
      });
  };
  renderStatus = (v) => {
    let color, value;
    switch (v) {
      case 0:
        color = "blue";
        value = "Opened";
        break;
      case 2:
        value = "Resolved";
        color = "cyan";
        break;
      case 5:
        value = "Completed";
        color = "green";
        break;
      case 3:
        value = "Verified";
        color = "purple";
        break;
      case 1:
        value = "Assigned";
        color = "magenta";
        break;
      case 4:
        value = "Rejected";
        color = "red";
        break;
      default:
        color = "gold";
        break;
    }

    return value ? <Tag color={color}>{value}</Tag> : "-";
  };
  statusDisp = (status) => {
    switch (status) {
      case "YES":
        return (
          <span style={{ fontWeight: 600, color: "green" }}>{status}</span>
        );
        break;
      case "NO":
        return <span style={{ fontWeight: 600, color: "red" }}>{status}</span>;
        break;
      default:
        return <span style={{ fontWeight: 600, color: "blue" }}>{status}</span>;
        break;
    }
  };
  handleViewClick = (imageUrl) => {
    this.setState({ modalVisible: true, imageUrl });
  };

  render() {
    const buttonLabel = this.hasNoStatus() ? "Raise Ticket(s)" : "Submit";
    const image = this.images();
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
          <Col sm={24}>
            <div style={{ float: "right" }}>
              <Tooltip placement="top" title="Knowledge Base">
                <Link
                  to={`https://maxbyte-poc.document360.io/docs/operators-manual`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography.Text>
                    <ExceptionOutlined style={{ fontSize: "20px" }} />
                  </Typography.Text>
                </Link>
              </Tooltip>
            </div>
          </Col>
          <Col sm={24}>
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              // bordered
              // layout="vertical"

              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item key="l1" label="Checklist Description">
                {this.state.data?.description}
              </Descriptions.Item>
              <Descriptions.Item key="l2" label="Asset Name">
                {this.state.data?.asset?.assetName}
              </Descriptions.Item>
              <Descriptions.Item key="l3" label="Scheduled Date">
                {dateFormat(this.state.data?.startDate)}
              </Descriptions.Item>
              <Descriptions.Item key="l4" label="Status">
                {this.state.data?.status}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col sm={24}>
            <br />
            <br />
            <table className="table table-stripped">
              <thead>
                {this.state.tickets?.length > 0 && (
                  <tr>
                    <th width="5%">S.No</th>
                    <th width="30%">Description</th>
                    <th width="10%">Status</th>
                    <th width="20%">Remark</th>
                    <th width="10%">WO Number</th>
                    <th width="10%">Status</th>
                    <th width="15%">Image</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {this.state.tickets?.map((e, i) => (
                  <tr key={`clechId${e.checkListExecutionChecksId}`}>
                    <td>{i + 1}</td>
                    <td>
                      {e.checkDescription}

                      <br />
                      {e.checkListExecutionCheckType?.map((e) => (
                        <Tag color="magenta">
                          {this.state.checkType[e.checkTypeId]}
                        </Tag>
                      ))}
                    </td>
                    <td align="center">{this.statusDisp(e.status)}</td>
                    <td>{e.remark}</td>
                    <td align="center">
                      <Link
                        to={`/pm/resolution-work-order/update/${e.woNumberId}`}
                      >
                        {e.workOrder?.rwoNumber}
                      </Link>
                    </td>
                    <td align="center">
                      {this.renderStatus(e.workOrder?.status)}
                    </td>
                    <td>
                      <Tooltip title={e.imageUrl ? "Preview" : "No Preview"}>
                        <Button
                          onClick={() => this.handleViewClick(e.imageUrl)}
                          disabled={e.imageUrl ? false : true}
                        >
                          View
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              visible={this.state.modalVisible}
              title="Preview"
              onCancel={() =>
                this.setState({ modalVisible: false, imageUrl: null })
              }
              footer={null}
              width={300}
              height={300}
              className="image-preview"
            >
              <Slider {...settings}>
                {this.state?.imageUrl?.split(",")?.map((image, index) => (
                  <div key={index}>
                    <Image
                      style={{ width: 300, height: 250 }}
                      //  height={300}
                      src={`${publicUrl}${image}`}
                      fallback="data:image/png;base64,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"
                    />{" "}
                  </div>
                ))}
              </Slider>
            </Modal>
            <table className="table table-stripped">
              <tbody>
                {this.state.tickets?.length > 0 && (
                  <tr
                    style={{
                      fontWeight: "700",
                      color: "red",
                      border: 0,
                      background: "#ffffff",
                    }}
                  >
                    <td
                      colspan="4"
                      align="right"
                      style={{
                        border: 0,
                      }}
                    >
                      <i>
                        Note : Tickets will be generated for the above checks.
                      </i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <table className="table table-stripped">
              <thead>
                {this.state.noTickets?.length > 0 && (
                  <tr>
                    <th width="5%">S.No</th>
                    <th width="30%">Description</th>
                    <th width="10%">Status</th>
                    <th width="20%">Remark</th>
                    <th width="15%">Image</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {this.state.noTickets?.map((e, i) => (
                  <tr key={`clechId${e.checkListExecutionChecksId}`}>
                    <td>{i + 1}</td>
                    <td>
                      {e.checkDescription} <br />
                      {e.checkListExecutionCheckType?.map((e) => (
                        <Tag color="blue">
                          {this.state.checkType[e.checkTypeId]}
                        </Tag>
                      ))}
                    </td>
                    <td align="center">{this.statusDisp(e.status)}</td>
                    <td>{e.remark}</td>

                    <td>
                      <Tooltip title={e.imageUrl ? "Preview" : "No Preview"}>
                        <Button
                          onClick={() => this.handleViewClick(e.imageUrl)}
                          disabled={e.imageUrl ? false : true}
                        >
                          View
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
          {this.state.data?.status != "Closed" && (
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={this.props.prev}>Back</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={this.finish}>
                    {buttonLabel}
                  </Button>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Spin>
    );
  }
}
export default withRouter(CheckListExecutionPreview);
