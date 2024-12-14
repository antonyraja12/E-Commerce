import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import moment from "moment";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import {
  AddButton,
  EditButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import DowntimeReasonsSplitForm from "../downtime-reason/dowtime-reasons-split-from";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

const { Option } = Select;
const { TextArea } = Input;

class DowntimeReasonList extends PageList {
  service = new MachineStatusService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();

  constructor(props) {
    super(props);
    this.splitFormRef = React.createRef();
    this.state = {
      selectedAssetId: null,
      selectedAssetDetails: null,
      res: [],
      machineStatusIdForEdit: null,
      showEditModal: false,
    };
  }

  title = "Machine Downtime List";

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      render: (text) =>
        text ? moment(text).format("DD-MM-YYYY HH:mm a") : "-",
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
      render: (text) =>
        text ? moment(text).format("DD-MM-YYYY HH:mm a") : "-",
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset",
    },
    {
      dataIndex: "machineStatusId",
      key: "machineStatusId",
      title: "Update",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <Button
            type="primary"
            onClick={() => this.edit(record.machineStatusId, record.assetId)}
          >
            Update
          </Button>
        );
      },
    },
  ];

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
    this.service.list().then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId === null),
      }));
    });
    this.setState((state) => ({ ...state, hidden: false }));
  };

  onSuccess = (selectedAssetDetails) => {
    this.setState({ selectedAssetDetails }, () => {
      this.updateSelectedAssetDetails();
    });
  };

  edit = (machineStatusId, assetId) => {
    this.setState({
      machineStatusIdForEdit: machineStatusId,
      selectedAssetId: assetId,
      showEditModal: true,
    });
  };

  closeEditModal = () => {
    this.setState({
      showEditModal: false,
      machineStatusIdForEdit: null,
      selectedAssetId: null,
    });
  };

  filterAsset = (values) => {
    const { startDate, endDate, aHId, shiftName } = values;
    let assetId = values.assetId;

    if (assetId === null || assetId === undefined) {
      assetId = 0;
    } else if (typeof assetId === "object") {
      assetId = assetId.key;
    }

    console.log("values", assetId, startDate, endDate, aHId, shiftName);
    this.service
      .getassetId(assetId, startDate, endDate, aHId, shiftName)
      .then((response) => {
        this.setState({ res: response.data });
      })
      .catch((error) => {
        console.error("Filter error:", error);
      });
  };

  saveAndClose = () => {
    setTimeout(() => {
      this.saveEdit();
      this.closeEditModal();
    }, 1000);
    setTimeout(() => {
      this.props.form.submit();
    }, 1500);
  };

  componentDidMount() {
    const { assetId } = this.props;
    // console.log("assted",assetId)

    if (assetId !== null && assetId !== undefined) {
      this.assetService.list({ active: true }).then((response) => {
        this.setState((state) => ({ ...state, asset: response.data }));
      });
    }
    // this.onFinish();
    this.props.form.submit();
    super.componentDidMount();
  }

  updateSelectedAssetDetails = () => {
    const { selectedAssetId, asset } = this.state;
    const selectedAsset = asset.find((e) => e.assetId === selectedAssetId);
    this.setState({ selectedAssetDetails: selectedAsset });
  };

  saveEdit = () => {
    this.splitFormRef.current.submit();
  };

  render() {
    const { ahId, startDate, endDate, assetId, shiftName } = this.props;
    return (
      <Page title={this.title}>
        <Form
          onFinish={this.filterAsset}
          form={this.props.form}
          layout="inline"
        >
          <Row gutter={10} align="middle">
            <Col>
              <Form.Item name="shiftName" initialValue={shiftName} hidden>
                <Input placeholder="shiftName" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="aHId" initialValue={ahId} hidden>
                <Input placeholder="AHID" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="assetId" initialValue={assetId}>
                <Select
                  style={{ width: "200px" }}
                  showSearch
                  placeholder="Select Asset"
                  onChange={this.setHierarchyName}
                >
                  {assetId === 0 && (
                    <Option key="all" value={0}>
                      All Machines
                    </Option>
                  )}
                  {this.state.asset?.map((e) => (
                    <Option key={`asset${e.assetId}`} value={e.assetId}>
                      {e.assetName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="startDate" initialValue={startDate} hidden>
                <DatePicker
                  style={{ width: "200px" }}
                  placeholder="Start Date"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="endDate" initialValue={endDate} hidden>
                <DatePicker style={{ width: "200px" }} placeholder="End Date" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <br />
        <Table
          rowKey="machineStatusId"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
          loading={this.state.isLoading}
          columns={this.columns}
          dataSource={this.state.res}
          size="middle"
          bordered
        />
        <Modal
          title="Machine Status"
          visible={this.state.showEditModal}
          onCancel={this.closeEditModal}
          width={1200}
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={this.closeEditModal}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={this.saveAndClose}>
              Save
            </Button>,
          ]}
        >
          {this.state.showEditModal && (
            <DowntimeReasonsSplitForm
              machineStatusId={this.state.machineStatusIdForEdit}
              onClose={this.closeEditModal}
              ref={this.splitFormRef}
              assetId={this.state.selectedAssetId}
              aHId={this.state.aHId}
            />
          )}
        </Modal>
      </Page>
    );
  }
}

export default withRouter(withForm(DowntimeReasonList));
