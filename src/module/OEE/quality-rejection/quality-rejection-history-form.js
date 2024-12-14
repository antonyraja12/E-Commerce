import React from "react";
import { Modal, Table, Input, Button, Space, message, Tooltip } from "antd";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import QualityRejectionService from "../../../services/oee/quality-rejection-service";

class ShowModelDetails extends PageForm {
  qualityRejectionService = new QualityRejectionService();
  constructor(props) {
    super(props);
    this.state = {
      viewbox: false,
      editRow: null,
      rowdata: [],
      open: false,
      presentDayData: [],
      rowdata: [],
      editedRPC: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      this.setState({ rowdata: this.props.data2 });
    }
    super.componentDidUpdate(prevProps, prevState);
  }
  filterPresentDayData = () => {
    const currentDate = moment().format("YYYY-MM-DD"); // Current date in YYYY-MM-DD format
    return this.props.data2.filter((record) => {
      return moment(record.updatedTime).format("YYYY-MM-DD") === currentDate;
    });
  };

  onFinish2 = (values) => {
    values.rejectedPart = this.state.editedRPC;

    this.qualityRejectionService
      .getRejectionHistoryReason(values.recordsId, values.rejectedPart)
      .then((response) => {
        message.success("Updated successfully");
      });

    this.props.form.resetFields();
    this.setState((state) => ({ ...state, selectedRowKeys: [] }));
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleEditClick = (record) => {
    this.qualityRejectionService
      .getRejectionHistoryReason(record.recordsId, record.rejectedPart)
      .then((recordsId) => {
        this.setState(
          {
            record: record.recordsId,
            viewbox: true,
            editedRPC: record.rejectedPart,
          },
          () => {}
        );

        this.props.form.setFieldsValue({
          id: record.recordsId,
          rejectedPart: record.rejectedPart,
        });
        this.setState({ editRow: record.recordsId });
      });
  };
  handleKeyDown = (e) => {
    const key = e.key;

    if (!/[0-9]|Backspace|ArrowLeft|ArrowRight/.test(key)) {
      e.preventDefault();
    }
  };
  handleInputChange = (recordsId, editedValue) => {
    if (/^[0-9]*$/.test(editedValue)) {
      this.setState({
        editedRPC: editedValue,
      });
    }
  };
  handleDeleteClick = (record) => {
    const { recordsId } = record;
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this record?",
      onOk: () => {
        this.props.deleteQualityRejection(recordsId, this.props.modelId);
      },
      onCancel: () => {
        message.info("Delete operation canceled");
      },
    });
    this.filterPresentDayData();
  };

  handleSaveClick = (record) => {
    this.onFinish2(record);

    this.props.form.resetFields();
    this.setState({ editRow: null });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const presentDayData = this.filterPresentDayData();
    const tableTitle = "Quality Rejection History Form";

    const columns = [
      {
        title: "S.No",
        dataIndex: "serialNumber",
        width: 80,
        render: (_, __, index) => index + 1,
      },
      {
        title: "Timestamp",
        dataIndex: "updatedTime",
        width: 100,
        render: (text, record) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {moment(record.updatedTime).format("DD-MM-YYYY HH:mm")}
          </div>
        ),
      },
      {
        title: "Rejected Reason",
        dataIndex: "rejectedReason",
        width: 200,
        render: (record) => {
          return record;
        },
      },
      {
        title: "Remarks",
        dataIndex: "remark",
        width: 200,
        render: (record) => {
          return record;
        },
      },
      {
        title: (
          <Tooltip title="Rejected Part Count">
            <div style={{ textAlign: "center" }}>RPC</div>
          </Tooltip>
        ),
        dataIndex: "rejectedPart",
        key: "rejectedPart",
        width: 100,
        render: (text, record) => {
          if (this.state.viewbox && this.state.editRow === record.recordsId) {
            return (
              <Input
                value={this.state.editedRPC}
                onChange={(e) =>
                  this.handleInputChange(record.recordsId, e.target.value)
                }
                onKeyDown={(e) => this.handleKeyDown(e)} // Add this event handler
              />
            );
          } else {
            return text;
          }
        },
      },

      {
        title: "Actions",
        dataIndex: "recordsId",
        key: "recordsId",
        width: 150,
        render: (_, record) => (
          <Space wrap>
            {!this.state.editRow || this.state.editRow !== record.recordsId ? (
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => this.handleEditClick(record)}
              ></Button>
            ) : (
              <Button
                type="default"
                icon={<SaveOutlined />}
                onClick={() => this.handleSaveClick(record)}
              ></Button>
            )}
            <Button
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => this.handleDeleteClick(record)}
            ></Button>
          </Space>
        ),
      },
    ];

    return (
      <Modal
        open={this.props.open}
        onCancel={this.handleCancel}
        width={800}
        footer={null}
        title={tableTitle}
      >
        <Table
          dataSource={this.props.data2}
          columns={columns}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default withForm(ShowModelDetails);
