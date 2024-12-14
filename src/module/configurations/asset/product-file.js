import ProductFileService from "../../../services/inventory-services/product-file-service";
import ProductService from "../../../services/inventory-services/product-service";
import PageList from "../../../utils/page/page-list";
import { remoteAsset } from "../../../helpers/url";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import { Table, Avatar, Button, Upload, message, Row, Col, Input } from "antd";
import { Link } from "react-router-dom";
import ProductFileForm from "./product-file-form";
import { SearchOutlined } from "@ant-design/icons";
class ProductFile extends PageList {
  service = new ProductFileService();
  productService = new ProductService();
  title = "Attachment";
  componentDidMount() {
    super.componentDidMount();
  }
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",

      align: "left",
    },

    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      align: "left",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },

    {
      dataIndex: "productFileId",
      key: "productFileId",
      title: "Action",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton onClick={() => this.edit(value)} />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];

  next = () => {
    this.props.next();
  };
  back = () => {
    this.props.prev();
  };
  list() {
    super.list({ assetId: this.props.assetId });
  }

  render() {
    return (
      <Page
        title={"Product File"}
        action={
          <Row justify="end">
            <AddButton onClick={() => this.add()} />
          </Row>
        }
      >
        <Row justify="space-between">
          <Col span={24}>
            <Input
              prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
              // onChange={this.search(null, null)}
              placeholder="Search..."
            />
          </Col>
        </Row>
        <br />
        <Table
          rowKey="productId"
          pagination={{
            showSizeChanger: true,

            // //showQuickJumper: true,

            size: "default",
          }}
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="middle"
          bordered
        />
        <ProductFileForm
          assetId={this.props.assetId}
          {...this.state.popup}
          close={this.onClose}
        />
      </Page>
    );
  }
}

export default ProductFile;
