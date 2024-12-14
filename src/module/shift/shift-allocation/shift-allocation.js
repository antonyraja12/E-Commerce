import { CalendarOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";
import Page from "../../../utils/page/page";
import PageForm from "../../../utils/page/page-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
const { Option } = Select;
const handleChange = (value) => {
  //   console.log(`selected ${value}`);
};
const options = [];
const columns = [
  {
    title: "S.No",
    dataIndex: "serialNumber",
    width: 80,
    render: (_, __, index) => index + 1,
  },
  {
    title: "Shift Name  ",
    dataIndex: "shiftName",
    render: (value, record, index) => {
      return value;
    },
  },
  {
    title: "Day Start",
    dataIndex: "startDate",
    sorter: (a, b) => {
      return dayjs(a.startDate) - dayjs(b.startDate);
    },
    // sorter: (a, b) => dayjs(a.startDate) - dayjs(b.startDate),

    render: (value, record, index) => {
      return dayjs(value).format("DD-MM-YYYY");
    },
  },
  {
    title: "Start Time",
    dataIndex: "startDate",
    render: (value, record, index) => {
      return dayjs(value).format("HH:mm:ss");
    },
  },
  {
    title: "Day End",
    dataIndex: "endDate",
    sorter: (a, b) => {
      return dayjs(a.endDate) - dayjs(b.endDate);
    },
    // sorter: (a, b) => dayjs(a.startDate) - dayjs(b.startDate),

    render: (value, record, index) => {
      return dayjs(value).format("DD-MM-YYYY");
    },
  },
  {
    title: "End Time",
    dataIndex: "endDate",
    render: (value, record, index) => {
      return dayjs(value).format("HH:mm:ss");
    },
  },
  {
    title: "Breaks Count",
    dataIndex: "shiftBreakDetails",
    render: (value) => {
      return value.length;
    },
  },
];
const columnStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#f2f2f2",
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};
class ShiftAllocation extends PageForm {
  constructor(props) {
    super(props);
    this.state = {
      selectedSetName: null,
      isModalOpen: false,
      reason: "",
      selectedDate: moment(),
      weekDates: [],
      name: [], // initialize name state
      selectedValue: null,
    };
    this.handleNameSelect = this.handleNameSelect.bind(this);
  }

  ShiftMasterAssetWiseService = new ShiftMasterAssetWiseService();
  assetService = new AssetService();
  service = new ShiftAllocationService();

  calculateWeekDates = (selectedDate) => {
    const startOfWeek = selectedDate.clone().startOf("week").add(1, "day"); // Start from Monday
    const endOfWeek = selectedDate.clone().endOf("week").add(1, "day"); // End on Sunday

    const days = [];
    let day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.clone());
      day = day.clone().add(1, "day");
    }

    this.setState({ weekDates: days });
  };

  handleDatePickerChange = (date) => {
    // Check if date is valid (not null or undefined) before updating the state
    if (date) {
      this.setState({ selectedDate: date }, () => {
        this.calculateWeekDates(date);
      });
    }
  };

  // Function to render table columns with day names and dates
  renderTableColumns = () => {
    return this.state.weekDates.map((date) => (
      <th key={date.format("YYYY-MM-DD")} style={columnStyle}>
        {date.format("dddd")} {/* Display the day name */}
        <div>{`(${date.format("DD-MM-YYYY")})`}</div> {/* Display the date */}
      </th>
    ));
  };
  disabledDate = (current) => {
    const today = moment();
    const lastSelectableWeek = today.clone().startOf("week");
    return current && current < lastSelectableWeek;
  };

  handleCancel = () => {
    this.setState({ isModalOpen: false, loading: false, reason: "" });
  };
  title = "Shift Allocation";
  componentDidMount() {
    this.calculateWeekDates(this.state.selectedDate);
    this.setState((state) => ({ ...state, loading: false }));
    this.ShiftMasterAssetWiseService.list().then((response) => {
      this.setState((state) => ({ ...state, name: response.data }));
    });
  }
  getShiftAllocationData2 = (setName, assetId, time) => {
    this.setState((state) => ({ ...state, loading: true }));
    this.service
      .postShiftAllocation(setName, assetId, dayjs(time))
      .then(({ data }) => {
        // console.log("data", data);
        this.setState((state) => ({
          ...state,
          shiftAllocationData: data,
          shiftAllocationData2: data.filter(
            (e) => e.active === true,
            console.log(this.state.shiftAllocationData2)
          ),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });
  };
  onFinish = (values) => {
    // console.log("values", dayjs(values.time).format());
    this.setState((state) => ({ ...state, loading: true }));
    this.service
      .postShiftAllocation(values.name, values.assetId, dayjs(values.time))
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          shiftAllocationData: data,
          shiftAllocationData2: data.filter((e) => e.active === true),
          setName: values.name,
          assetId: values.assetId,
          time: values.time,
        }));
        // console.log(values.name, "values");
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });
  };

  onFinish2 = (active, id, startDate) => {
    this.setState({ loading: true });

    if (!active) {
      this.setState({
        isModalOpen: true,
        shiftAllocationId: id,
        startDate: startDate,
      });
    } else {
      this.service
        .updateShiftAllocation(this.state.setName, {
          active: active,
          assetId: this.state.assetId,
          time: startDate,
        })
        .then(({ data }) => {
          if (data.success) {
            const updatedShiftAllocationData =
              this.state.shiftAllocationData.map((e) =>
                e.shiftAllocationId === id ? { ...e, active: true } : e
              );
            const updatedShiftAllocationData2 =
              updatedShiftAllocationData.filter((e) => e.active === true);

            this.setState({
              shiftAllocationData: updatedShiftAllocationData,
              shiftAllocationData2: updatedShiftAllocationData2,
              loading: false,
            });
          } else {
            message.error(data.message);
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  };

  handleOk = () => {
    const { assetId, shiftAllocationId, reason, startDate, setName } =
      this.state;

    if (reason.trim() === "") {
      message.error("Please provide a reason.");
      return;
    }
    this.service
      .updateShiftAllocation(setName, {
        assetId: assetId,
        reason: reason,
        time: startDate,
        active: false,
      })
      .then(({ data }) => {
        // console.log("res", data);
        this.setState((state) => ({
          ...state,
          shiftAllocationData: data.data,
        }));
      })
      .finally(() => {
        this.setState({ isModalOpen: false, loading: false, reason: "" });
      })
      .catch((error) => {});
  };

  loadAsset = (setName) => {
    this.setState((state) => ({
      ...state,
      setName1: setName,
    }));
    this.ShiftMasterAssetWiseService.retrieve(setName).then(({ data }) => {
      //   console.log("data.shiftAssetMappingList", data.shiftAssetMappingList);
      const selectedAssets = data.shiftAssetMappingList.map(
        (asset) => asset.assetId
      );
      this.setState((state) => ({
        ...state,
        asset: data.shiftAssetMappingList,
        selectedAssets: selectedAssets,
      }));
      this.props.form.setFieldsValue({ assetId: selectedAssets });
    });
  };
  handleNameSelect = (value) => {
    if (value === "") {
      this.setState({ selectedValue: null });
    } else {
      this.loadAsset(value);
    }
  };
  render() {
    // console.log("shiftAllocationData", this.state.shiftAllocationData);
    const columns1 = this.renderTableColumns();
    const currentFormattedDate = this.state.selectedDate.format("DD-MM-YYYY");
    const customTitle = (
      <div>
        Shift Allocation
        {this.props.access[0]?.includes("add") && (
          <Link
            state={this.props.location.state}
            to="/settings/shift/shift-configuration"
          >
            <Button
              type="primary"
              style={{ marginLeft: "75%", verticalAlign: "middle" }}
            >
              Assign Shift
            </Button>
          </Link>
        )}
        <Link to="settings/shift/shift-allocation-calender">
          <Tooltip title="Calender View">
            <CalendarOutlined
              style={{
                marginLeft: "2%",
                fontSize: "28px",
                verticalAlign: "middle",
              }}
            />
          </Tooltip>
        </Link>
      </div>
    );

    const { isLoading } = this.props;
    // console.log("access", access[0].length);
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
                <Link to="shift-configuration">
                  <Button type="primary">Assign Shift</Button>
                </Link>
              )}
            </>
          }
        >
          <Spin spinning={this.state.loading}>
            <Form onFinish={this.onFinish} form={this.props.form}>
              <Row gutter={[10]}>
                <Col md={4}>
                  <Form.Item name="name">
                    <Select
                      showSearch
                      placeholder="Set Name"
                      onChange={this.handleNameSelect}
                      style={{ width: "100%" }}
                    >
                      {this.state.name?.map((e) => (
                        <Option
                          key={`name${e.shiftMasterAssetWiseId}`}
                          value={e.shiftMasterAssetWiseId}
                        >
                          {e.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <Form.Item name={"assetId"}>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Select Asset"
                      value={this.state.selectedAssets} // Use selectedAssets from state
                      onChange={this.handleAssetSelect}
                    >
                      {this.state.asset?.map((e) => (
                        <Option key={e.assetId} value={e.assetId}>
                          {e.assetName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <Form.Item name="time">
                    <DatePicker
                      format="DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabledDate={this.disabledDate}
                      onChange={this.handleDatePickerChange}
                      value={this.state.selectedDate}
                      // placeholder={currentFormattedDate}
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <Space>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Go
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Link to="/settings/shift/shift-allocation-calender">
                        <Tooltip title="Calender View">
                          <CalendarOutlined
                            style={{
                              // marginLeft: "2%",
                              fontSize: "32px",
                            }}
                          />
                        </Tooltip>
                      </Link>
                    </Form.Item>
                  </Space>
                </Col>
              </Row>
            </Form>
            <Space
              direction="vertical"
              style={{
                display: "flex",
              }}
            >
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>{columns1}</tr>
                </thead>
                {this.state.shiftAllocationData ? (
                  <tbody>
                    <tr>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData?.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Monday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Tuesday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Wednesday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Thursday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Friday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Saturday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                      <td style={cellStyle}>
                        {this.state.shiftAllocationData.map((e) =>
                          dayjs(e.shiftDate).format("dddd") == "Sunday" ? (
                            <div>
                              <Form.Item hidden name="shiftAllocationId">
                                <Input value={e.shiftAllocationId} />
                              </Form.Item>
                              <Form.Item name="active">
                                <Checkbox
                                  checked={e.active}
                                  defaultChecked={e.active}
                                  onChange={(x) =>
                                    this.onFinish2(
                                      x.target.checked,
                                      e.shiftAllocationId,
                                      e.startDate
                                    )
                                  }
                                >
                                  {e.shiftName}
                                </Checkbox>
                              </Form.Item>
                            </div>
                          ) : null
                        )}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={7} style={cellStyle}>
                        No data available
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              {/* </Form> */}

              <Table
                dataSource={this.state.shiftAllocationData2}
                columns={columns}
                bordered
                size="small"
              />
            </Space>
            <Modal
              title="Confirmation!"
              name="reason"
              open={this.state.isModalOpen}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <TextArea
                rows={4}
                placeholder="Enter the reason"
                maxLength={1000}
                value={this.state.reason}
                onChange={(e) => this.setState({ reason: e.target.value })}
              ></TextArea>
            </Modal>
          </Spin>
        </Page>
      </Spin>
    );
  }
}
export default withForm(withRouter(withAuthorization(ShiftAllocation)));
