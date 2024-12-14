import {
  Button,
  Card,
  Divider,
  message,
  Modal,
  Popconfirm,
  Result,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import InventoryResolutionForm from "./inventory-resolution-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import SpareRequestSubList from "./spare-request-sub-list.js";
import dayjs from "dayjs";
import DispatchSpareService from "../../../services/inventory-services/dispatch-spare-service.js";
import { response } from "msw";
import { dateFormat } from "../../../helpers/url.js";
import DispatchList from "./dispatch-list.js";
import { Title } from "chart.js";
import { DeleteOutline } from "@material-ui/icons";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;
class InventoryResolution extends PageList {
  inventoryRequestService = new InventoryRequestService();
  dispatchService = new DispatchSpareService();
  title = "Spare Request";
  columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      fixed: "left",
      align: "left",
    },
    {
      dataIndex: "spareRequestNumber",
      key: "spareRequestNumber",
      title: <Tooltip title="Spare Request Number">SR No</Tooltip>,
      align: "left",
      fixed: "left",
    },
    {
      dataIndex: "spareRequestSubList",
      key: "spareRequestSubList",
      title: "No.of Req items",
      align: "left",
      render: (record) => {
        return record ? record.length : null;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (value) => {
        return value.replace(/([a-z])([A-Z])/g, "$1 $2");
      },
    },
    {
      title: "Date",
      dataIndex: "createdOn",
      key: "createdOn",
      align: "left",
      render: (value) => {
        return dayjs(value).format("DD-MM-YYYY");
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (value, record) => {
        console.log("record 1", value);
        return (
          <Space>
            <ViewButton
              onClick={() => this.spareRequestSubListModalopen(record)}
            />

            <EditButton
              disabled={value !== "Requested"}
              onClick={() => this.EditSparePop(record.spareRequestId)}
            />

            <Button
              type="text"
              disabled={value !== "Requested"}
              icon={<DeleteOutlined />}
              onClick={() => this.showDeleteConfirm(record.spareRequestId)}
            />
          </Space>
        );
      },
    },
  ];
  dispatchColumn = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      fixed: "left",
      width: 30,
      align: "left",
    },
    {
      title: <Tooltip title="Spare request number">SR.No</Tooltip>,
      dataIndex: "spareRequest",
      key: "spareRequest",
      align: "left",
      width: 150,
      render: (value, record) => {
        console.log("recc", record);
        return value?.spareRequestNumber;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      fixed: "left",
      align: "left",
      render: (value) => {
        return dateFormat(value);
      },
    },
    {
      title: "Status",
      dataIndex: "dispatchStatus",
      key: "dispatchStatus",
    },
    {
      title: "Action",
      key: "dispatchId",
      dataIndex: "dispatchId",
      render: (value, record) => {
        return (
          <Button type="primary" onClick={() => this.acknowledgepopup(record)}>
            Open
          </Button>
        );
      },
    },
  ];
  spareRequestSubListModalopen = (record) => {
    const data = this.state.spareRequestData.find(
      (e) => e?.spareRequestId == record?.spareRequestId
    );
    const mainData = data?.spareRequestSubList?.map((e, i) => ({
      sno: i + 1,
      ...e,
    }));

    this.setState((state) => ({
      ...state,
      openSpareRequestSubListModal: true,
      spareRequestSubListData: mainData,
    }));
  };
  spareRequestSubListModalcolose = () => {
    this.setState((state) => ({
      ...state,
      openSpareRequestSubListModal: false,
    }));
  };
  acknowledgepopup = (record) => {
    console.log("record", [record]);
    this.setState((state) => ({
      ...state,
      openDispatchModel: true,
      dispatchModelData: this.handleData([record]),
    }));
  };
  acknowledgepopupClose = () => {
    this.setState((state) => ({
      ...state,
      openDispatchModel: false,
    }));
    this.loadSpareRequest();
    this.loadDispatchedList();
  };

  openSparePop = () => {
    this.setState((state) => ({
      ...state,
      sparePopup: {
        open: true,
        mode: "Add",
        title: `${this.title}`,
      },
    }));
  };
  EditSparePop = (id) => {
    this.setState((state) => ({
      ...state,
      sparePopup: {
        open: true,
        mode: "Update",
        title: `Update ${this.title}`,
        id: id,
      },
    }));
  };
  confirm = (data) => {
    this.inventoryRequestService
      .update(
        {
          sparePartId: data.sparePartId,
          quantity: data.quantity,
          // condition: data.condition,
          resolutionWorkOrderId: data.resolutionWorkOrderId,
          status: "Received",
        },
        data.spareRequestId
      )
      .then((response) => {})
      .finally(() => {
        this.loadSpareRequest();
        this.props.loadSpareRequest();
      });
  };

  loadSpareRequest = () => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.inventoryRequestService
      .list({ resolutionWorkOrderId: this.props.id })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          spareRequestData: this.handleData(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  };
  onSpareClose = () => {
    this.setState((state) => ({
      ...state,
      sparePopup: {
        open: false,
      },
    }));
    this.loadSpareRequest();
    this.props.loadSpareRequest();
  };
  loadDispatchedList = () => {
    this.dispatchService
      .list({ resolutionWorkOrderId: this.props.id })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          dispatchedData: this.handleData(data),
        }));
      });
  };
  componentDidMount() {
    this.loadSpareRequest();
    this.loadDispatchedList();
  }
  delete(id) {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.inventoryRequestService
      .delete(id)
      .then(({ data }) => {
        if (data?.success) {
          message.success(data.message);
          this.loadSpareRequest();
        } else {
          message.error(data?.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure to delete this entry?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.delete(id);
      },

      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  render() {
    const { checks, checktypes, isLoading } = this.props;
    const { res } = this.state;
    console.log("state", this.state);

    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={<AddButton type="primary" onClick={this.openSparePop} />}
        >
          <Spin spinning={this.state.isLoading}>
            <Table
              rowKey="spareRequestId"
              // loading={this.state.isLoading}
              dataSource={this.state.spareRequestData}
              columns={this.columns}
              size="middle"
              // scroll={{ x: 980 }}
              pagination={{
                showSizeChanger: true,

                //showQuickJumper: true,

                size: "default",
              }}
            />

            <InventoryResolutionForm
              {...this.state.sparePopup}
              resolutionWorkOrderId={this.props.id}
              spareClose={this.onSpareClose}
              assetFamilyId={this.props.assetFamilyId}
            />
            <SpareRequestSubList
              open={this.state.openSpareRequestSubListModal}
              close={this.spareRequestSubListModalcolose}
              data={this.state.spareRequestSubListData}
            />
          </Spin>

          <Typography.Title level={5}>Dispatched Spares</Typography.Title>
          <Divider />
          <Table
            rowKey="sno"
            loading={this.state.isLoading}
            dataSource={this.state.dispatchedData}
            columns={this.dispatchColumn}
            size="middle"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
          />
          <DispatchList
            open={this.state.openDispatchModel}
            close={this.acknowledgepopupClose}
            data={this.state.dispatchModelData}
          />
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(InventoryResolution));
