import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import MachineStatusService from "../../../services/oee/machine-status-service";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import DowntimeReasonsForm from "./downtime-reasons-form";
import Downtimesplit from "./dowtime-reasons-split-from";

class DowntimeReason extends PageList {
  constructor(props) {
    super(props);

    this.state = {
      downTimeData: [],
      filteredData: [],
      isLoading: true,
      popup: { open: false },
    };

    this.columns = [
      {
        title: "S.No",
        dataIndex: "serialNumber",
        width: 80,
        render: (_, __, index) => index + 1,
      },
      {
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
        render: (text) =>
          text ? moment(text).format("DD-MM-YYYY HH:mm a") : "-",
      },
      {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
        render: (text) =>
          text ? moment(text).format("DD-MM-YYYY HH:mm a") : "-",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        render: (value) =>
          value ? moment.duration(value).asMinutes().toFixed(2) + " mins" : "-",
      },
      {
        title: "Primary Reason",
        dataIndex: "downtimeReason",
        key: "downtimeReason",
        render: (value) => (value ? value : "-"),
      },
      {
        title: "Secondary Reason",
        dataIndex: "secondaryReason",
        key: "secondaryReason",
        render: (value) => (value ? value : "-"),
      },
      {
        title: "Remark",
        dataIndex: "remarks",
        key: "remarks",
        render: (value) => (value ? value : "-"),
      },
      {
        dataIndex: "machineStatusId",
        key: "machineStatusId",
        title: "Action",
        width: 160,
        align: "center",
        render: (value) => {
          return (
            <>
              <Tooltip title="Add Reason">
                <Button
                  type="text"
                  className="material-icons"
                  icon={<EditOutlined />}
                  onClick={() => this.edit(value)}
                />
              </Tooltip>
              <Tooltip title="Split Loss">
                <Button
                  type="text"
                  className="material-icons"
                  icon={<PlusOutlined />}
                  onClick={() => this.opensplitloss(value)}
                />
              </Tooltip>
            </>
          );
        },
      },
    ];
  }
  opensplitloss = (value) => {
    // console.log("values", value);
    this.setState((state) => ({
      ...state,
      splitlosspopup: true,
      splitdata: value,
    }));
  };

  onClosesplitloss = (data) => {
    this.setState(
      (state) => ({ ...state, splitlosspopup: false }),
      () => {
        this.list();
      }
    );
  };
  list = () => {
    this.setState({ isLoading: true });

    const service = new MachineStatusService();
    service
      .retrieve(this.props.id)
      .then(({ data }) => {
        const downtimeEvent = {
          machineStatusId: data.machineStatusId,
          startTime: data.startTime,
          endTime: data.endTime,
          duration: data.duration,
          downtimeReason: "",
          secondaryReason: "",
          remarks: "",
        };

        if (downtimeEvent) {
          const formattedDownTime = [downtimeEvent];

          this.setState({
            downTimeData: formattedDownTime,
            filteredData: formattedDownTime,
            isLoading: false,
          });
        } else {
          console.error("Invalid or missing downtime data:", downtimeEvent);
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.error("Error fetching downtime data:", error);
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    this.list();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.list();
    }
  }

  render() {
    const { filteredData, isLoading } = this.state;

    return (
      <Page style={{ margin: "20px" }}>
        <Table
          dataSource={filteredData}
          columns={this.columns}
          loading={isLoading}
          pagination={false}
        />
        <DowntimeReasonsForm {...this.state.popup} close={this.onClose} />
        <Downtimesplit
          id={this.props.id}
          open={this.state.splitlosspopup}
          close={this.onClosesplitloss}
          data={filteredData}
        />
      </Page>
    );
  }
}

export default DowntimeReason;
