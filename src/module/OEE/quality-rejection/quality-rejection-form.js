import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import moment from "moment";
import QualityReasonService from "../../../services/oee/quality-reason-service";
import QualityRejectionService from "../../../services/oee/quality-rejection-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import ShowModelDetails from "./quality-rejection-history-form";
const { Option } = Select;

class QualityRejectionForm extends PageForm {
  constructor(props) {
    super(props);
    this.state = {
      editRow: null,
      recordsId: null,
      data2: [],
      showModelDetailsVisible: false,
      selectedRecord: null,
    };
  }
  qualityRejectionService = new QualityRejectionService();
  deleteQualityRejection = (id, modelId) => {
    this.qualityRejectionService
      .deleteRejectionHistoryReason(id)
      .then((response) => {
        if (response) {
          message.success("Record Deleted Successfully");
          this.getHistory(modelId);
        } else {
          message.error("Failed to delete the record");
        }
      });
  };
  getHistory = (modelId, record) => {
    this.qualityRejectionService
      .getRejectionHistory(modelId)
      .then((response) => {
        const currentDate = moment().format("YYYY-MM-DD"); // Current date in YYYY-MM-DD format
        this.setState((state) => ({
          ...state,
          data2: response.data.filter((record) => {
            return (
              moment(record.updatedTime).format("YYYY-MM-DD") === currentDate
            );
          }),
          records: response.data[0],
        }));
      })
      .catch((error) => {});
  };

  showModelDetails = (record) => {
    this.setState({
      popupOpen: true,
    });
  };

  columns = [
    {
      title: "Model Name",
      dataIndex: "modelName",
      width: 100,
      render: (text, record) => (
        <Tooltip title="Quality Rejection History Form">
          <a
            onClick={() => {
              this.showModelDetails(record);
              this.getHistory(record.modelConfigurationId);
              this.setState((state) => ({
                ...state,
                modelId: record.modelConfigurationId,
              }));
            }}
          >
            {text}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Part Model",
      dataIndex: "modelNumber",
      width: 100,
      // render: (modelMaster) => modelMaster.modelNumber,
    },

    {
      title: (
        <Tooltip title="Total Part Count">
          <div style={{ textAlign: "center" }}>TPC</div>
        </Tooltip>
      ),
      dataIndex: "totalPartProduced",
      width: 70,
      align: "right",
    },
    {
      title: (
        <Tooltip title="Accepted Part Count">
          <div style={{ textAlign: "center" }}>APC</div>
        </Tooltip>
      ),
      dataIndex: "acceptedPartCount",
      width: 70,
      align: "right",
    },
    {
      title: (
        <Tooltip title="Rejected Part Count">
          <div style={{ textAlign: "center" }}>RPC</div>
        </Tooltip>
      ),
      dataIndex: "rejectedPart",
      width: 70,
      align: "right",
    },
  ];
  ReasonService = new QualityReasonService();

  componentDidMount() {
    this.state = {
      data: null,
    };

    this.props.form.setFieldValue(
      "shiftAllocationId",
      this.props.shiftAllocationId
    );
    const { shiftAllocationId, modelId } = this.props;
    this.getQualityRejectionDetails();
    this.ReasonService.list({ assetId: this.props.assetId }).then(
      (response) => {
        console.log("response1", response.data);
        this.setState((state) => ({
          ...state,
          reasons: response.data,
          normalReasons: response.data,
        }));
      }
    );
  }

  getQualityRejectionDetails = () => {
    this.qualityRejectionService
      .getbyshiftAllocationId(this.props.shiftAllocationId)
      .then((response) => {
        this.setState((state) => ({
          ...state,
          data: response.data,
          searchQuery: "",
        }));
      });
  };
  onClose = () => {
    this.props.form.resetFields();
    this.props.close();
  };
  onClose2 = () => {
    this.setState({
      popupOpen: false,
    });
    this.getQualityRejectionDetails();
  };
  handleModelNameClick(record) {
    this.qualityRejectionService.getRejectionHistory(562).then((response) => {
      this.setState({
        data: response.data,
      });
    });
  }

  onFinish = (values) => {
    this.qualityRejectionService
      .putByModelId(
        values.modelConfigurationId,
        values.rejectedPart,
        values.rejectionReason,
        values.RejectionComment,
        values.shiftAllocationId
      )
      .then((response) => {
        message.success("Rejected successfully");
        this.qualityRejectionService
          .getbyshiftAllocationId(this.props.shiftAllocationId)
          .then((response) => {
            this.setState((state) => ({
              ...state,
              data: response.data,
              searchQuery: "",
            }));
          });
      });

    this.props.form.resetFields();
    this.props.form.setFieldValue(
      "shiftAllocationId",
      this.props.shiftAllocationId
    );
    this.setState((state) => ({ ...state, selectedRowKeys: [] }));
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.form.setFieldsValue({
      modelConfigurationId: selectedRows[0].modelConfigurationId,
      modelName: selectedRows[0].modelName,
    });
    this.setState((state) => ({ ...state, selectedRowKeys: selectedRowKeys }));
  };
  handleSearchInputChange = (e) => {
    this.setState({ ...this.state, searchQuery: e.target.value });
  };
  setShiftAllocationId = (v) => {};

  render() {
    const { selectedRowKeys } = this.state;
    console.log("this.props", this.props.assetId);
    const filteredData = this.state.searchQuery
      ? this.state.data.filter((record) => {
          return record.modelName
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase());
        })
      : this.state.data;

    return (
      <Popups
        width={1000}
        footer={null}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.onClose}
      >
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            labelAlign="left"
            colon={false}
            layout="vertical"
            form={this.props.form}
            onFinish={this.onFinish}
            requiredMark={false}
          >
            <Row gutter={12}>
              <Col span={16}>
                <Input
                  placeholder="Search..."
                  value={this.state.searchQuery}
                  onChange={this.handleSearchInputChange}
                  style={{ marginBottom: "1vh", width: "30%" }}
                />
                <div style={{ overflow: "auto", maxHeight: "300px" }}>
                  <Table
                    columns={this.columns}
                    dataSource={filteredData}
                    pagination={false}
                    size="small"
                    bordered
                    rowSelection={{
                      type: "radio",
                      selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    rowKey="modelConfigurationId"
                    scroll={{
                      y: 300,
                      x: false,
                    }}
                    sticky
                  />
                </div>
                <Divider style={{ margin: "64px 0" }} />
                {/* <Button type="default" onClick={this.onClose}>
                  Cancel
                </Button> */}
              </Col>
              <Col span={8}>
                <div style={{ display: "none" }}>
                  <Form.Item
                    label="Model Id"
                    name="modelConfigurationId"
                    hidden
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item name="shiftAllocationId" hidden></Form.Item>
                </div>
                <Form.Item
                  label="Model Name"
                  name="modelName"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Model in Table",
                    },
                  ]}
                >
                  <Input
                    readOnly
                    onSelect={(v) => this.setShiftAllocationId(v)}
                  />
                </Form.Item>
                <Form.Item
                  label="Rejected Reason"
                  name="rejectionReason"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Your Rejected Reason",
                    },
                  ]}
                >
                  <Select>
                    {this.state.reasons?.map(
                      (e) =>
                        e.assetId.includes(this.props.assetId) && (
                          <Option
                            key={e.qualityRejectionReasonId}
                            value={e.qualityRejectionReason}
                          >
                            {e.qualityRejectionReason}
                          </Option>
                        )
                    )}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Rejected Quantity"
                  name="rejectedPart"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Your Rejected Quantity",
                    },
                  ]}
                >
                  <InputNumber min="1" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Add Comment"
                  name="RejectionComment"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Your Rejected Comment",
                    },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{
                      minRows: 3,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24, offset: 20 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ margin: "60px 0" }}
                    // onClick={this.onClose}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
        <ShowModelDetails
          open={this.state.popupOpen}
          onCancel={this.onClose2}
          data2={this.state.data2}
          deleteQualityRejection={this.deleteQualityRejection}
          handleEditClick={this.state.handleEditClick}
          modelId={this.state.modelId}
          getHistory={this.getHistory}
        />
      </Popups>
    );
  }
}

export default withForm(QualityRejectionForm);
