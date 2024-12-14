import {
  Button,
  Col,
  Descriptions,
  Input,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { Component } from "react";
import { dateFormat } from "../../../helpers/url";
import CheckService from "../../../services/preventive-maintenance-services/check-service";
import CheckTypeService from "../../../services/preventive-maintenance-services/check-type-service";
import CheckListExecutionService from "../../../services/preventive-maintenance-services/checklist-execution-service";
import { withRouter } from "../../../utils/with-router";
const { TextArea } = Input;
const { Text } = Typography;
class CheckListExecutionStart extends Component {
  service = new CheckListExecutionService();
  checkTypeService = new CheckTypeService();
  checkservice = new CheckService();
  state = {};

  title = "Checklist";
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
      render: (value, record) => {
        return value ? (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        ) : (
          "-"
        );
      },
      width: 200,
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
  }
  start = () => {
    this.setState({ ...this.state, isLoading: true });
    this.service
      .update({ status: "InProgress" }, this.props.params.id)
      .then((response) => {
        if (response.data) {
          message.success(response.data.message);
          this.props.next();
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
      });
  };

  render() {
    return (
      <Spin spinning={this.state.isLoading}>
        <Row gutter={[10, 10]}>
          <Col sm={24}>
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              // bordered
              // layout="vertical"

              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item key="l1" label="Checklist Description">
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true }}
                  style={{ width: "100%" }}
                >
                  {this.state.data?.description}
                </Paragraph>
                {/* {this.state.data?.description} */}
              </Descriptions.Item>
              <Descriptions.Item key="l2" label="Asset Name">
                {this.state.data?.asset?.assetName}
              </Descriptions.Item>
              <Descriptions.Item key="l3" label="Scheduled Date">
                {/* {Moment(this.state.data?.startDate).format("DD-MM-YYYY")} */}
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
                <tr>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data?.checks?.map((e) => (
                  <tr key={`clechId${e.checkListExecutionChecksId}`}>
                    <td style={{ width: 200 }}>
                      <Paragraph
                        ellipsis={{ rows: 2, expandable: true }}
                        style={{ width: "100%" }}
                      >
                        {e.checkDescription}
                      </Paragraph>
                      <br />
                      {e.checkListExecutionCheckType?.map((e) => (
                        <Tag color="blue">
                          {this.state.checkType[e.checkTypeId]}
                        </Tag>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
          {!this.props.disabled && (
            <Col span={24}>
              <Row justify="end">
                <Col>
                  <Button type="primary" onClick={this.start}>
                    Start
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
export default withRouter(CheckListExecutionStart);
