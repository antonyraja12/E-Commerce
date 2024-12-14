import { Button, Col, Form, Row, Select, Table, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import AssetService from "../../../services/asset-service";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { formatCurrency } from "../../../helpers/currency-format";
class SpareReport extends PageList {
  service = new InventoryRequestService();
  assetService = new AssetService();
  title = "Spare Report";
  componentDidMount() {
    this.list({ status: "Approved" });
    this.assetService.list({ status: true }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        assetList: data,
      }));
    });
  }
  onAssetChange = (id) => {
    this.list({ assetId: id, status: "Approved" });
  };
  render() {
    // console.log("this.state.res", this.state.res);
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        align: "left",
        width: 50,
      },
      {
        dataIndex: "resolutionWorkOrder",
        key: "resolutionWorkOrder",
        title: <Tooltip title="Resolution Work Order No">RW.No</Tooltip>,
        align: "left",
        width: 75,
        render: (record, value) => {
          return value?.pmResolutionWorkOrder?.rwoNumber;
        },
      },
      {
        dataIndex: "resolutionWorkOrder",
        key: "resolutionWorkOrder",
        title: "Asset",
        align: "left",
        width: 150,
        render: (record, value) => {
          return value?.pmResolutionWorkOrder?.asset?.assetName;
        },
      },
      {
        dataIndex: "sparePart",
        key: "sparePart",
        title: "Item Name",
        align: "left",
        width: 160,
        render: (value) => {
          return value?.sparePartName;
        },
      },
      {
        dataIndex: "sparePart",
        key: "sparePart",
        title: "Cost",
        align: "left",
        width: 160,
        render: (value) => {
          return value?.newPrice
            ? formatCurrency(value?.newPrice)
            : formatCurrency(value?.refPrice);
        },
      },
      {
        dataIndex: "createdOn",
        key: "createdOn",
        title: "Date",
        align: "left",
        width: 160,
        render: (value) => {
          return value ? moment(value).format("DD-MM-YYYY") : "-";
        },
        // defaultSortOrder: 'desc',
        sorter: (a, b) =>
          moment(a.createdOn).unix() - moment(b.createdOn).unix(),
      },
      {
        dataIndex: "sparePart",
        key: "sparePart",
        title: "Category",
        align: "left",
        width: 100,
        render: (value) => {
          return value?.sparePartType?.sparePartTypeName;
        },
      },
      {
        dataIndex: "quantity",
        key: "quantity",
        title: "Quantity",
        align: "left",
        width: 100,
      },
    ];

    return (
      <Page title={this.title}>
        <Form layout="horizontal" form={this.props.form}>
          <Row gutter={[10, 10]}>
            <Col sm={6}>
              <Form.Item name="spare" style={{ minWidth: "250px" }}>
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Asset"
                  optionFilterProp="label"
                  options={this.state.assetList?.map((e) => ({
                    label: e.assetName,
                    value: e.assetId,
                  }))}
                  onChange={this.onAssetChange}
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
      </Page>
    );
  }
}

export default SpareReport;
