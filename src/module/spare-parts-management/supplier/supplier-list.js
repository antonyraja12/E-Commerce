import { Col, Form, Input, Result, Row, Table, Spin } from "antd";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { withAuthorization } from "../../../utils/with-authorization";
import SupplierForm from "./supplier-form";
import SupplierService from "../../../services/inventory-services/supplier-service";
import { withRouter } from "../../../utils/with-router";
class SupplierList extends PageList {
  service = new SupplierService();
  title = "Supplier";
  columns = [
    {
      dataIndex: "Sno",
      key: "sno",
      title: "S.No",
      width: 25,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "supplierName",
      key: "supplierName",
      title: "Supplier",
      width: 120,
      align: "left",
    },
    {
      dataIndex: "spocName",
      key: "spocName",
      title: "SPOC Name",
      width: 120,
      align: "left",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Mail Id",
      width: 150,
      align: "left",
    },
    {
      dataIndex: "contactNumber",
      key: "contactNumber",
      title: "Contact Number",
      width: 120,
      align: "left",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 100,
      align: "left",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "supplierId",
      key: "supplierId",
      title: "Action",
      width: 100,
      align: "left",
      render: (value) => {
        return (
          <>
            {this.props.access[0]?.includes("view") && (
              <ViewButton onClick={() => this.view(value)} />
            )}
            {this.props.access[0]?.includes("edit") && (
              <EditButton onClick={() => this.edit(value)} />
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  render() {
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
        <Page
          title={this.title}
          action={
            <>
              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </>
          }
        >
          <Form.Item>
            <Row>
              <Col md={6}>
                <Input
                  onChange={(v) => this.search(v, "supplierName")}
                  placeholder="Search Supplier"
                />
              </Col>
            </Row>
          </Form.Item>

          <Table
            rowKey="supplierId"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="small"
            bordered
          />
          <SupplierForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(SupplierList));
