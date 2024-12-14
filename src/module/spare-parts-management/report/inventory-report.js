import { Col, Form, Result, Row, Select, Spin, Table } from "antd";
import React from "react";
import { formatCurrency } from "../../../helpers/currency-format";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
const { Option } = Select;
class InventoryReport extends PageList {
  service = new StockJournalService();
  inventoryCategoryService = new InventoryCategoryService();
  title = "Stock Report";

  componentDidMount() {
    this.service.getReport().then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reportData: this.handleData(data),
      }));
    });
    this.inventoryCategoryService.list({ status: true }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        spareCategoryList: data,
      }));
    });
  }
  loadSpare = (id) => {
    this.service.getReport({ sparePartTypeId: id }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reportData: this.handleData(data),
      }));
    });
  };
  handleChange = (value) => {
    this.setState((state) => ({ ...state, selectedSpare: value }));
    this.loadSpare(value);
  };
  render() {
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        align: "left",
        width: 50,
      },
      {
        dataIndex: "sparePartName",
        key: "sparePartName",
        title: "Item Name",
        align: "left",
        width: 100,
      },
      {
        title: "Quantity",
        align: "cent",
        width: 100,
        children: [
          {
            dataIndex: "quantity",
            key: "quantity",
            title: "Total",
            align: "center",
            width: 100,
            render: (value) => {
              return value ? value : 0;
            },
          },
          {
            dataIndex: "pendingQuantity",
            key: "pendingQuantity",
            title: "Pending",
            align: "center",
            width: 100,
            render: (value) => {
              return value ? value : 0;
            },
          },
          {
            dataIndex: "purchaseQuantity",
            key: "purchaseQuantity",
            title: "Purchase",
            align: "center",
            width: 100,
            render: (value) => {
              return value ? value : 0;
            },
          },
        ],
      },
      // {
      //   dataIndex: "quantity",
      //   key: "quantity",
      //   title: "Quantity",
      //   align: "left",
      //   width: 100,
      // },
      // {
      //   dataIndex: "storageLocation",
      //   key: "storageLocation",
      //   title: "Storage Location",
      //   align: "center",
      //   render:(value)=>{
      //     return value?value:"-"
      //   }
      // },

      {
        dataIndex: "price",
        key: "price",
        title: "Price",
        align: "left",
        width: 100,
        render: (value) => {
          return value ? formatCurrency(value) : "-";
        },
      },
      {
        dataIndex: "totalPrice",
        key: "totalPrice",
        title: "Total",
        align: "left",
        width: 100,
        render: (value) => {
          return value ? formatCurrency(value) : "-";
        },
      },
    ];

    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    // if (!access[0] || access[0].length === 0) {
    //   return (
    //     <Result
    //       status={"403"}
    //       title="403"
    //       subTitle="Sorry You are not authorized to access this page"
    //     />
    //   );
    // }

    return (
      <Spin spinning={isLoading}>
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
            dataSource={this.state.reportData}
            columns={columns}
            size="small"
            scroll={{ x: 980 }}
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(InventoryReport));
