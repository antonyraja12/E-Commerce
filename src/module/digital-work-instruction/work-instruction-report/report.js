import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Result,
  Select,
  Space,
  Spin,
  Table,
  TreeSelect,
  Typography,
  message,
} from "antd";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import WorkInstructionExeccutoinService from "../../../services/digital-work-instruction-service/work-instruction-execution-service";
import { response } from "msw";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import Page from "../../../utils/page/page";
import { Link } from "react-router-dom";
import { dateFormat } from "../../../helpers/url";
import { withAuthorization } from "../../../utils/with-authorization";

const { Text } = Typography;
const setData = {};

const style = {
  formItem: {
    minWidth: "120px",
  },
};

class WorkInstructionReport extends FilterFunctions {
  constructor(props) {
    super(props);

    this.state = {};
  }
  filterfunctionsservice = new FilterFunctions();
  title = "Digital Work Instruction Report";

  service = new WorkInstructionExeccutoinService();

  componentDidMount() {
    this.list();
  }

  search = (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .getResolutionWorkOrder(data)
      .then((response) => {
        this.setState((state) => ({ ...state, data: response.data }));
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };

  columns = [
    {
      title: "S.No",
      key: "workInstructionId",
      dataIndex: "sno",
      // width: "100px",
      fixed: "left", // Make the column fixed
    },
    {
      dataIndex: "workInstructionNumber",
      key: "workInstructionNumber",
      title: "Exec No",
      // width: "100px",
      align: "left",
      fixed: "left",
      render: (value, record) => {
        if (record.status === "Completed") {
          return <span>{value}</span>;
        } else {
          return (
            <Link
              to={`../execution/update/${record.workInstructionExecutionId}`}
            >
              <span>{value}</span>
            </Link>
          );
        }
      },
    },

    {
      title: "Start Date",
      key: "createdOn ",
      dataIndex: "createdOn",
      // width: "100px",
      fixed: "left", // Make the column fixed
      render: (value) => {
        return dateFormat(value);
      },
    },

    {
      dataIndex: "workInstruction",
      key: "workInstructionId",
      title: "Work Instruction",
      align: "left",
      // width: "250px",
      render: (value) => {
        return <> {value?.title}</>;
      },
    },
    {
      dataIndex: "duration",
      title: "Executed Time (Min)",
      align: "left",
      width: "150px",
      render: (value) => {
        return <>{Math.round(value / 60)}</>;
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "left",
      width: "150px",
    },

    {
      dataIndex: "initiatedBy",
      key: "initiatedBy",
      title: "Done By",
      align: "left",
      fixed: "right",
      width: "150px",
    },
  ];

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page title={this.title}>
          <Table
            tableLayout="auto"
            scroll={{ x: 1000 }}
            rowKey="workInstructionId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            bordered
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(WorkInstructionReport));
