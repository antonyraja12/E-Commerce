import { Button, Card, DatePicker, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import React from "react";
import AssetService from "../../../services/shift-configuration/asset-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import PageForm from "../../../utils/page/page-form";

const { Option } = Select;
const column1 = [
  {
    title: "Shift Name  ",
    dataIndex: "shiftName",
    render: (text, record, index) => {
      return record.shiftName?.shiftName;
    },
  },
  {
    title: "Day Start",
    dataIndex: "startDate",
    render: (value, record, index) => {
      return dayjs(value).format("DD-MM-YYYY HH:mm:ss");
    },
  },
  {
    title: "Start Time",
    dataIndex: "starttime",
  },
  {
    title: "Day End",
    dataIndex: "endDate",
  },
  {
    title: "End Time",
    dataIndex: "endtime",
  },
  {
    title: "Break Start",
    dataIndex: "breakStart",
  },
  {
    title: "Break End",
    dataIndex: "break end",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Title",
    dataIndex: "title",
  },
];

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};
const dateFormatList = ["DD-MM-YYYY"];
console.log("04-01-2023:00:00:00 - 10-01-2023:24:00:00");

class ShiftAllocation extends PageForm {
  shiftAllocationService = new ShiftAllocationService();
  assetService = new AssetService();
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.shiftAllocationService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, shiftAllocation: response.data }));
    });
    this.assetService.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
    super.componentDidMount();
  }

  render() {
    const columns = [
      {
        title: "Sessions",
        dataIndex: "sessions",
        align: "center",
      },
      {
        title: "Sunday",
        dataIndex: "sunday",
        align: "center",
      },
      {
        title: "Monday",
        dataIndex: "monday",
      },
      {
        title: "Tuesday",
        dataIndex: "tuesday",
      },
      {
        title: "Wednesday",
        dataIndex: "wednesday",
      },
      {
        title: "Thursday",
        dataIndex: "thursday",
      },
      {
        title: "Friday",
        dataIndex: "friday",
      },
      {
        title: "Saturday",
        dataIndex: "saturday",
      },
    ];
    return (
      <div>
        <Card
          title="Shift Allocation"
          bordered={false}
          style={{
            width: 1000,
            height: 800,
          }}
        >
          <Space>
            <Select
              style={{
                width: "130px",
              }}
              showSearch
              placeholder="Asset"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
            >
              {this.state.asset?.map((e) => (
                <Option key={`asset${e.assetId}`} value={e.assetId}>
                  {e.assetName}
                </Option>
              ))}
            </Select>

            <DatePicker
              defaultValue={dayjs("01-01-2015", dateFormatList[0])}
              format={dateFormatList}
            />

            <Button type="primary">Go</Button>
          </Space>

          <div>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  marginLeft: 8,
                }}
              ></span>
            </div>
            <Table columns={columns}></Table>
          </div>

          <div>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  marginLeft: 8,
                }}
              ></span>
            </div>
            <Table columns={column1} />
          </div>
        </Card>
      </div>
    );
  }
}
export default ShiftAllocation;
