import { Col, Form, Input, Result, Row, Spin, Table } from "antd";
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
import InventoryCategoryForm from "./inventory-category-form";
import { withRouter } from "../../../utils/with-router";
class InventoryCategory extends PageList {
  service = new InventoryCategoryService();
  title = "Category";
  componentDidMount() {
    this.list();
  }
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "sparePartTypeName",
      key: "sparePartTypeName",
      title: "Category",
      width: 100,
      align: "left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 100,
      align: "left",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 100,
      align: "left",
      render: (value) => {
        return !!value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "sparePartTypeId",
      key: "sparePartTypeId",
      title: "Action",
      width: 160,
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
                  onChange={(v) => this.search(v, "sparePartTypeName")}
                  placeholder="Search Category"
                />
              </Col>
            </Row>
          </Form.Item>
          <Table
            rowKey="sparePartTypeId"
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
          <InventoryCategoryForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(InventoryCategory));
