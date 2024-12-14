import { Button, Col, Form, Input, Row, Select, Spin, message } from "antd";
import React from "react";
import DownTimeMachineStatusService from "../../../services/oee/downtime-machine-status-service";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const { Option } = Select;
class DowntimeReasonsForm extends PageForm {
  service = new MachineStatusService();
  ReasonService = new DowntimeReasonService();
  downtimeService = new DownTimeMachineStatusService();
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

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
      downtimeReasonId: "",
      secondaryReason: "",
      remark: "",
      startTime: null,
      endTime: null,
      // duration: null,
    };
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
  onFinish1 = (values) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.downtimeService.getmachinestatus(values).then((response) => {
      if (response.data.success) {
        this.setState((state) => ({ ...state, isLoading: false }));
        message.success(response.data.message);
        this.closePopup();
      }
    });
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
                  {this.props.mode === "Add" ? "Save" : "Save"}
                </Button>
              )}
            </Col>
          </Row>,
        ]}
        title="Add Reason"
        open={this.state?.open}
        onCancel={this.closePopup}
      >
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
              <Input />
            </Form.Item>
            <Form.Item label="End Time" name="endTime">
              <Input />
            </Form.Item>
            <Form.Item label="Duration" name="duration">
              <Input />
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
                  .filter((reason) => reason.parentId === null)
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
                {this.state.filteredSecondaryReasons.map((reason) => (
                  <Option
                    key={`secondaryReason${reason.downtimeReasonId}`}
                    value={reason.downtimeReasonId}
                  >
                    {reason.downtimeReason}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Remark" name="remark">
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(DowntimeReasonsForm);
