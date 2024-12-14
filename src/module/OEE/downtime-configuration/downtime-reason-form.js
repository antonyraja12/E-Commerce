import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";

import moment from "moment";
import DownTimeMachineStatusService from "../../../services/oee/downtime-machine-status-service";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import DownTimeService from "../../../services/oee/downtime-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import { withForm } from "../../../utils/with-form";
const { Option } = Select;
class DowntimeReasonForm extends PageForm {
  constructor(props) {
    super(props);
    this.state = {
      originalData: [],
      isDataUpdated: false,
      editRow: null,
      editedRecordIds: [],
      downTimeData: [],
      selectedPrimaryReason: null,
      filteredSecondaryReasons: [],
      downTimeData: [], // Your downtime data
      editRow: null,
      reasons: [], // Your reasons data
      secondaryReasons: [],
    };
  }

  ReasonService = new DowntimeReasonService();
  downtimeService = new DownTimeService();
  machinestatusService = new MachineStatusService();
  downstatusService = new DownTimeMachineStatusService();

  componentDidMount() {
    this.machinestatusService
      .list({
        startDate: this.props.startTime,
        endDate: this.props.endTime,
        assetId: this.props.assetId,
      })
      .then(({ data }) => {
        // console.log("data", data);
        data.sort(
          (a, b) =>
            moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        );

        this.setState((state) => ({
          ...state,
          downTimeData: data,
          originalData: data,
        }));
      });

    this.ReasonService.list().then((response) => {
      const reasonsWithData = response.data.map((reason) => ({
        ...reason,
        downtimeReason: reason.downtimeReason,
      }));

      const secondaryReasons = response.data.filter(
        (reason) => reason.parentId !== null
      );

      this.setState({
        reasons: reasonsWithData,
        secondaryReasons: secondaryReasons,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedPrimaryReason !== this.state.selectedPrimaryReason) {
      const filteredSecondaryReasons = this.state.reasons?.filter(
        (e) => e.parentId === this.state.selectedPrimaryReason
      );

      this.setState({ filteredSecondaryReasons });
    }
  }

  handlePrimaryReasonChange = (value, recordId) => {
    const { downTimeData, reasons } = this.state;
    const selectedRecordIndex = downTimeData.findIndex(
      (record) => record.dtStreamId === recordId
    );

    const filteredSecondaryReasons = reasons.filter(
      (reason) => reason.parentId === value && reason.parentId !== null // Add this condition
    );

    const updatedDownTimeData = [...downTimeData];
    updatedDownTimeData[selectedRecordIndex].primaryReason = value;
    updatedDownTimeData[selectedRecordIndex].secondaryReason = null;

    this.setState(
      {
        downTimeData: updatedDownTimeData,
        selectedPrimaryReason: value,
        secondaryReasons: filteredSecondaryReasons,
      },
      () => {}
    );
  };

  onClose = () => {
    this.props.form.resetFields();
    this.setState({ ...this.state, editRow: null });
    this.props.close();
  };

  handleEditClick1 = (record) => {
    const selectedPrimaryReason = record.primaryReasonId;

    this.props.form.setFieldsValue({
      dtStreamId: record.dtStreamId,
      downtimeReasonId: record.downtimeReasonId,
      secondaryReason: record.secondaryReason,
      //  remarks: record.remarks,
      // breakDown: record.breakDown,
    });

    this.setState({
      editRow: record.dtStreamId,
      selectedPrimaryReason,
    });
  };

  onFinish = async (dtStreamId, record) => {
    const updatedData = this.props.form.getFieldsValue();

    try {
      const response = await this.downtimeService.updateDataById(
        dtStreamId,
        updatedData,
        // record,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Updated successfully!");
        this.refreshData();
        const primaryReason = this.state.reasons.find(
          (reason) => reason.downtimeReasonId === updatedData.primaryReason
        );

        const secondaryReason = this.state.reasons.find(
          (reason) => reason.downtimeReasonId === updatedData.secondaryReason
        );

        const updatedDownTimeData = this.state.downTimeData.map((item) => {
          if (item.dtStreamId === dtStreamId) {
            return {
              ...item,
              primaryReason: primaryReason ? primaryReason.downtimeReason : "", // Display the name
              secondaryReason: secondaryReason
                ? secondaryReason.downtimeReason
                : "",
              remarks: updatedData.remarks,
              breakDown: updatedData.breakDown,
            };
          }
          return item;
        });

        this.setState({
          downTimeData: updatedDownTimeData,
          editRow: null,
        });
      } else {
        message.error("Update failed. Check the API response for details.");
      }
    } catch (error) {
      message.error("Error while saving data. Check the console for details.");
    }
  };

  refreshData() {
    this.machinestatusService
      .list({
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        assetId: this.props.assetId,
      })
      .then(({ data }) => {
        data.sort(
          (a, b) =>
            moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        );

        this.setState({
          downTimeData: data,
        });
      });
  }

  render() {
    const currentDayData = this.state.downTimeData.filter((record) =>
      moment(record.startTime).isSame(moment(), "day")
    );

    const {
      downTimeData,
      editRow,
      reasons,
      selectedPrimaryReason,
      secondaryReasons,
    } = this.state;
    const columns = [
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
        width: 200,
        render: (text, record) => (
          <Form.Item
            name={["startTime", record.dtStreamId]}
            initialValue={moment(record.startTime)}
            rules={[
              {
                required: true,
                message: "Please select a Start Time",
              },
            ]}
          >
            <Input
              readOnly
              value={dayjs(record.startTime).format("DD-MM-YYYY HH:mm")}
            />
          </Form.Item>
        ),
      },

      // {
      //   title: "Start Time",
      //   dataIndex: "startTime",
      //   key: "startTime",
      //   width: 200,
      //   render: (text, record) => {
      //     return dayjs(record.startTime).format("DD-MM-YYYY HH:mm");
      //   },
      // },
      // {
      //   title: "End Time",
      //   dataIndex: "endTime",
      //   key: "endTime",
      //   width: 200,
      //   render: (text, record) => {
      //     return moment(record.endTime).format("DD-MM-YYYY HH:mm");
      //   },
      // },
      {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
        width: 200,
        render: (text, record) => {
          if (editRow === record.dtStreamId) {
            return (
              <Form.Item
                name="endTime"
                initialValue={moment(record.endTime)}
                rules={[
                  {
                    required: true,
                    message: "Please select an End Time",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm"
                  // disabledDate={() => true} // Disable date selection
                  onChange={(value) =>
                    this.handleEndTimeChange(value, record.dtStreamId)
                  }
                />
              </Form.Item>
            );
          } else {
            return dayjs(record.endTime).format("DD-MM-YYYY HH:mm");
          }
        },
      },

      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        width: 100,
        render: (text, record) => {
          const durationInSeconds = record.duration / 1000;
          return moment.utc(durationInSeconds * 1000).format("HH:mm:ss");
        },
      },
      {
        title: "Primary Reason",
        dataIndex: "downtimeReasonId",
        key: "downtimeReasonId",
        width: 200,
        render: (text, record) => {
          if (editRow === record.dtStreamId) {
            return (
              <Form.Item
                name="downtimeReasonId"
                initialValue={record.primaryReason}
                rules={[
                  {
                    required: true,
                    message: "Please select a Primary Reason",
                  },
                ]}
              >
                <Select
                  onChange={(value) =>
                    this.handlePrimaryReasonChange(value, record.dtStreamId)
                  }
                >
                  {reasons
                    .filter((reason) => reason.parentId === null)
                    .map((primary) => (
                      <Option
                        key={primary.downtimeReasonId}
                        value={primary.downtimeReasonId}
                      >
                        {primary.downtimeReason}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            );
          } else {
            return record?.downtimeReason?.downtimeReason;
          }
        },
      },
      {
        title: "Secondary Reason",
        dataIndex: "secondaryReason",
        key: "secondaryReason",
        width: 200,
        render: (text, record) => {
          if (editRow === record.dtStreamId) {
            return (
              <Form.Item
                name="secondaryReason"
                initialValue={record.secondaryReason}
                rules={[
                  {
                    required: true,
                    message: "Please select a Secondary Reason",
                  },
                ]}
              >
                <Select
                  onChange={(value) =>
                    this.setState({ secondaryReason: value })
                  }
                >
                  {secondaryReasons.map((secondary) => (
                    <Option
                      key={secondary.downtimeReasonId}
                      value={secondary.downtimeReason}
                    >
                      {secondary.downtimeReason}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
        width: 200,
        render: (text, record) => {
          if (editRow === record.dtStreamId) {
            return (
              <Form.Item
                name="remarks"
                initialValue={record.remarks} // Assuming initial value is already present
                rules={[
                  {
                    required: true,
                    message: "Please enter a remark",
                  },
                ]}
              >
                <Input
                  onChange={(e) => this.setState({ remarks: e.target.value })}
                />
              </Form.Item>
            );
          } else {
            return text;
          }
        },
      },

      {
        dataIndex: "dtStreamId",
        key: "dtStreamId",
        title: "Actions",
        width: 100,
        render: (_, record) => (
          <>
            {this.state.editRow === record.dtStreamId ? (
              <Button
                type="default"
                icon={<SaveOutlined />}
                onClick={() => this.onFinish(record.dtStreamId, record)}
              >
                {/* Save */}
              </Button>
            ) : (
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => this.handleEditClick1(record)}
              >
                {/* Edit */}
              </Button>
            )}
          </>
        ),
      },
      {
        title: "Machine Status ID",
        dataIndex: "machineStatusId",
        key: "machineStatusId",
        width: 0,
        render: (text, record) => (
          <Form.Item
            name={["machineStatusId", record.dtStreamId]}
            initialValue={record.machineStatusId}
            style={{ display: "none" }} // Hide the form item
          >
            <Input type="hidden" />
          </Form.Item>
        ),
      },
    ];

    return (
      <Popups
        footer={[
          <Row justify="space-between">
            <Col>
              <Button
                key="close"
                onClick={this.onClose}
                style={{ right: "-1120%" }}
              >
                Cancel
              </Button>
            </Col>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.onClose}
        width="70vw"
      >
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            layout="inline"
            form={this.props.form}
            onFinish={this.onFinish}
            // wrappedComponentRef={(form) => (this.formRef = form)}
          >
            <Table
              columns={columns}
              dataSource={currentDayData}
              rowKey="dtStreamId"
              pagination={false}
            />
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(DowntimeReasonForm);
