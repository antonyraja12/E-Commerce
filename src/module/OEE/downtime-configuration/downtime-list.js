import { PlusOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import moment from "moment";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";

import MachineStatusService from "../../../services/oee/machine-status-service";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import PageList from "../../../utils/page/page-list";
import DowntimeReasonsAddFrom from "./downtime-reasons-add-from";
class DownTimeAddList extends PageList {
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  service = new MachineStatusService();
  ReasonService = new DowntimeReasonService();

  title = "Downtime Reason";
  columns = [
    {
      title: "S.No",
      dataIndex: "serialNumber",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Start Time",
      dataIndex: "downTime",
      key: "startTime",
      width: 200,
      render: (text, record) => {
        return record.startTime
          ? moment(record.startTime).format("DD-MM-YYYY HH:mm")
          : "-";
      },
    },
    {
      title: "End Time",
      dataIndex: "downTime",
      key: "endTime",
      width: 200,
      render: (text, record) => {
        return record.endTime
          ? moment(record.endTime).format("DD-MM-YYYY HH:mm")
          : "-";
      },
    },
    {
      title: "Duration",
      dataIndex: "downTime",
      key: "duration",
      width: 100,
      render: (text, record) => {
        // console.log("record", record.duration);
        return record.duration ? moment(record.duration).format(" HH:mm") : "-";
      },
    },

    {
      title: "Primary Reason",
      dataIndex: "downTime",
      key: "primaryReason",
      render: (text, record) => {
        return (
          record.downTime.length > 0 &&
          record.downTime
            .map((dt) =>
              dt.downtimeReason ? dt.downtimeReason.downtimeReason : "-"
            )
            .join(", ")
        );
      },
    },
    {
      title: "Secondary Reason",
      dataIndex: "downTime",
      key: "secondaryReason",
      render: (text, record) => {
        return (
          record.downTime.length > 0 &&
          record.downTime
            .map((dt) => (dt.secondaryReason ? dt.secondaryReason : "-"))
            .join(", ")
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "downTime",
      key: "remark",
      render: (text, record) => {
        return (
          record.downTime.length > 0 &&
          record.downTime
            .map((dt) => (dt.remarks ? dt.remarks : "-"))
            .join(", ")
        );
      },
    },

    {
      dataIndex: "machineStatusId",
      key: "action",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton onClick={() => this.edit(value)} />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.service
      .statusList({
        startDate: this.props.startTime,
        endDate: this.props.endTime,
        assetId: this.props.assetId,
      })
      .then(({ data }) => {
        // console.log("data1245", data);
        data.sort(
          (a, b) =>
            moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        );

        this.setState({
          downTimeData: data,
          originalData: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching downtime data:", error);
        this.setState({
          isLoading: false,
        });
      });

    super.componentDidMount();
  }
  render() {
    // console.log(
    //   this.state.downTimeData?.downTime,
    //   this.state.downTimeData,
    //   "time"
    // );
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" onClick={() => this.add()}>
            <PlusOutlined />
          </Button>
        </div>
        <div>
          <Table
            rowKey="machineStatusId"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            loading={this.state.isLoading}
            dataSource={this.state.downTimeData}
            columns={this.columns}
            size="middle"
            bordered
          />
          <DowntimeReasonsAddFrom
            {...this.state.popup}
            startTime={this.props?.startTime}
            endTime={this.props?.endTime}
            assetId={this.props?.assetId}
            shiftAllocationId={this.props?.shiftAllocationId}
            close={this.onClose}
          />
        </div>
      </div>
    );
  }
}

export default DownTimeAddList;
