import {
  Button,
  Col,
  Form,
  Result,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import React from "react";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import InventoryRequestForm from "./dispatch-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import DispatchSpareService from "../../../services/inventory-services/dispatch-spare-service";
import dayjs from "dayjs";
import { withForm } from "../../../utils/with-form";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import DispatchForm from "./dispatch-form";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import { dateFormat } from "../../../helpers/url";
class DispatchList extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  service = new DispatchSpareService();
  stockJournalService = new StockJournalService();
  inventoryRequestService = new InventoryRequestService();
  title = "Dispatch List";
  componentDidMount() {
    this.list();
    this.stockJournalService.getReport().then(({ data }) => {
      this.setState((state) => ({ ...state, stockJournalData: data }));
    });
  }
  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: {
        open: false,
      },
    }));
    this.list();
  };
  render() {
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S No",
        align: "left",
        width: 50,
      },
      {
        dataIndex: "spareRequest",
        key: "spareRequest",
        title: <Tooltip title="Resolution Work Order No">RW No</Tooltip>,
        align: "left",
        width: 100,
        render: (record, value) => {
          return record?.pmResolutionWorkOrder?.rwoNumber
            ? record?.pmResolutionWorkOrder?.rwoNumber
            : "-";
        },
      },
      {
        dataIndex: "dispatchItems",
        key: "dispatchItems",
        title: <Tooltip title="Number Of Dispatched Items">No.of DI</Tooltip>,
        align: "center",
        width: 100,
        render: (value, rec) => {
          return value ? value.length : null;
        },
      },
      // {
      //   dataIndex: "createdOn",
      //   key: "createdOn",
      //   title: "Date",
      //   align: "left",
      //   width: 120,
      //   render: (value) => {
      //     return value ? dayjs(value).format("DD-MM-YYYY") : "-";
      //   },
      //   sorter: (a, b) =>
      //     moment(a.createdOn).unix() - moment(b.createdOn).unix(),
      // },
      {
        dataIndex: "createdOn",
        key: "createdOn",
        title: "Date",
        align: "left",
        width: 120,
        render: (value) => {
          return value ? dateFormat(value) : "-";
        },
        // defaultSortOrder: 'desc',
        // sorter: (a, b) =>
        //   moment(a.createdOn).unix() - moment(b.createdOn).unix(),
      },
      // sorter: (a, b) => a.priorityGroupName?.localeCompare(b.priorityGroupName),

      // {
      //   dataIndex: "condition",
      //   key: "condition",
      //   title: "Condition",
      //   align: "left",
      //   width: 100,
      // },

      {
        dataIndex: "dispatchStatus",
        key: "dispatchStatus",
        title: "Status",
        align: "left",
        width: 150,
        // render: (value) => {
        //   console.log("value", value);
        //   return value ? "Acknowledged" : "Dispatched";
        // },
      },
      {
        dataIndex: "dispatchId",
        key: "dispatchId",
        title: "Action",
        width: 160,
        align: "left",
        render: (value, record) => (
          <>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton
              disabled={record.dispatchStatus == "Acknowledged"}
              onClick={() => this.edit(value)}
            />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        ),
      },
    ];

    return (
      // <Spin spinning={this.state.isLoading}>
      <Page title={this.title}>
        <Form layout="horizontal" form={this.props.form}>
          <Row gutter={[10, 10]}>
            <Col sm={6}>
              <Form.Item name="spare" style={{ minWidth: "250px" }}>
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Category"
                  optionFilterProp="label"
                  options={this.state.spareCategoryList?.map((e) => ({
                    label: e.sparePartTypeName,
                    value: e.sparePartTypeId,
                  }))}
                  onChange={this.handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table
          bordered
          rowKey="spareRequestId"
          loading={this.state.isLoading}
          dataSource={this.state.res}
          columns={columns}
          scroll={{ x: 980 }}
          size="small"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
        />
        <DispatchForm
          {...this.state.popup}
          stockJournalData={this.state.stockJournalData}
          closeOrderPopup={this.onClose}
        />
        {/* <PurchaseRequestForm
            {...this.state.purchasePopup}
            close={this.closeOrderPopup}
          /> */}
      </Page>
    );
  }
}

export default withRouter(withForm(withAuthorization(DispatchList)));
