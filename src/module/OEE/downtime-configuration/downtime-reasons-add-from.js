import { Button, Col, Form, Input, Row, Select, Spin, TimePicker } from "antd";
import dayjs from "dayjs";
import React from "react";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
const { Option } = Select;
class DownTimeMachineStatus extends PageForm {
  // service = new DownTimeService();
  service = new MachineStatusService();
  ReasonService = new DowntimeReasonService();
  // machinestatusService = new MachineStatusService();

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
      reasons: [],
      secondaryReasons: [],
      // Initialize state variables for form fields
      // startTime: "",
      // endTime: "",
      downtimeReasonId: "",
      secondaryReason: "",
      remark: "",
      startTime: null,
      endTime: null,
      // duration: null,
    };
  }

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  componentDidMount() {
    this.ReasonService.list().then((response) => {
      // console.log("Machine Status Data:", response);
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
  handleDowntimeReasonChange = (value) => {
    const selectedDowntimeReason = this.state.reasons.find(
      (reason) => reason.downtimeReasonId === value
    );
    if (selectedDowntimeReason) {
      const filteredSecondaryReasons = this.state.secondaryReasons.filter(
        (reason) => reason.parentId === selectedDowntimeReason.downtimeReasonId
      );
      this.setState({
        filteredSecondaryReasons,
      });
    }
  };
  handleStartTimeChange = (time, timeString) => {
    this.setState({ startTime: time });
    this.calculateDuration(time, this.state.endTime);
  };

  handleEndTimeChange = (time, timeString) => {
    this.setState({ endTime: time });
    this.calculateDuration(this.state.startTime, time);
  };

  calculateDuration = (startTime, endTime) => {
    // console.log("st,end", startTime, endTime);
    if (startTime && endTime) {
      const duration = dayjs(endTime).diff(startTime, "second");
      this.setState({ duration: duration });
    }
  };
  onFinish1 = (values) => {
    this.service.getmachinestatus(values);
  };

  render() {
    return (
      <Popups
        footer={[
          <Row justify="space-between">
            <Col>
              {(this.props.mode === "Add" || this.props.mode === "Update") && (
                <Button key="close" onClick={this.closePopup}>
                  Cancel
                </Button>
              )}
            </Col>
            <Col>
              {(this.props.mode === "Add" || this.props.mode === "Update") && (
                <Button
                  key="submit"
                  type="primary"
                  onClick={this.props.form.submit}
                  htmlType="submit"
                >
                  {this.props.mode === "Add" ? "Save" : "Update"}
                </Button>
              )}
            </Col>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}
      >
        {/* {console.log(this.props, this.state.startTime, "this.props-form")} */}
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            labelAlign="left"
            className="form-horizontal"
            colon={false}
            layout="horizontal"
            form={this.props.form}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 16, xs: 24 }}
            onFinish={this.onFinish1}
            disabled={this.props.disabled}
          >
            <Form.Item label="machineStatusId" hidden name="machineStatusId">
              <Input value={this.state.machineStatusId} />
            </Form.Item>

            <Form.Item label="Start Time" name="startTime">
              <TimePicker
                showTime
                disabled
                format=" HH:mm:ss"
                value={
                  this.state.startTime ? dayjs(this.state.startTime) : null
                }
                onChange={this.handleStartTimeChange}
              />
            </Form.Item>
            <Form.Item label="End Time" name="endTime">
              <TimePicker
                // showTime
                format="HH:mm:ss"
                value={this.state.endTime}
                onChange={this.handleEndTimeChange}
              />
            </Form.Item>
            <Form.Item label="Duration" name="duration">
              <TimePicker
                value={this.state.duration / 60000}
                disabled
                format="HH:mm:ss"
              />
            </Form.Item>

            <Form.Item label="Primary Reason" name="downtimeReasonId">
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                placeholder="Select Primary Reason"
                onChange={this.handleDowntimeReasonChange}
              >
                {this.state.reasons
                  .filter(
                    (reason) =>
                      reason.parentId === null &&
                      reason.assetId.includes(this.props.id)
                  )
                  .map((reason) => (
                    <Option
                      key={`reason${reason.downtimeReasonId}`}
                      value={reason.downtimeReasonId}
                    >
                      {reason.downtimeReason}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Secondary Reason" name="secondaryReason">
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                allowClear
                placeholder="Select Secondary Reason"
              >
                {this.state.reasons
                  .filter((reason) => reason.parentId !== null)
                  .map((reason) => (
                    <Option
                      key={`secondaryReason${reason.downtimeReason}`}
                      value={reason.downtimeReason}
                    >
                      {reason.downtimeReason}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Remark" name="remark">
              <Input autoFocus maxLength={20} />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}
export default withForm(DownTimeMachineStatus);
