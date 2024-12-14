import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Spin, Table } from "antd";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import ShiftForm from "./shift-master";

class Shift extends PageList {
  state = {
    tooltipVisible: true,
  };

  hideTooltip = () => {
    setTimeout(() => {
      this.setState({ tooltipVisible: false });
    }, 5000);
  };
  service = new ShiftMasterService();
  title = "Shift Type";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
      align: "left",
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      align: "left",
      // width: 800,
      sorter: (a, b) => a.shiftName.localeCompare(b.shiftName),
    },
    {
      dataIndex: "shiftDuration",
      key: "shiftDuration",
      title: "Shift Duration(mins)",
      align: "left",
      sorter: (a, b) => {
        return a.shiftDuration - b.shiftDuration;
      },
    },
    {
      dataIndex: "breakDuration",
      key: "breakDuration",
      title: "Break Duration(mins)",
      align: "left",
      render: (text, record) => {
        const breakDurations = record.shiftBreakMasters.map(
          (breakData) => breakData.breakDuration
        );

        return breakDurations.join(" ,");
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Break Details",
      align: "left",
      render: (text, record) => {
        const description = record.shiftBreakMasters.map(
          (description) => description.description
        );

        return description.join(", ");
      },
    },

    {
      dataIndex: "shiftMasterId",
      key: "shiftMasterId",
      title: "Action",
      width: 160,
      align: "left",
      render: (value, record, index) => {
        return (
          <>
            {this.props.access[0]?.includes("view") && (
              <ViewButton onClick={() => this.view(value)} />
            )}
            {this.props.access[0]?.includes("edit") && (
              <EditButton onClick={() => this.edit(value)} />
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.rows.filter((e) => {
      return (
        e.shiftName?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s)
      );
    });
    this.setState((state) => ({ ...state, res: res }));
  };
  render() {
    this.hideTooltip();

    const { access, isLoading } = this.props;

    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          // title={this.title}
          action={
            <>
              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </>
          }
        >
          <Row justify="space-between">
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search..."
              />
            </Col>
          </Row>
          <br />
          <Table
            rowKey="shiftMasterId"
            pagination={{
              showSizeChanger: true,
              size: "default",
            }}
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="small"
            bordered
          />
          {/* <br /> */}
          {/* <Link
            to=".."
            // state={this.props.location?.state}
          >
            <Button>Back</Button>
          </Link> */}
          <ShiftForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(Shift));
