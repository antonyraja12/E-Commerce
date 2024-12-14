import {
  Avatar,
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
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import InventoryConfigForm from "./inventory-config-form";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";

class InventoryConfiguration extends PageList {
  state = { isLoading: false };
  service = new InventoryConfigurationService();
  inventoryCategoryService = new InventoryCategoryService();
  componentDidMount() {
    this.list();
    this.inventoryCategoryService.list({ status: true }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        spareCategoryList: data,
      }));
    });
  }
  loadSpare = (id) => {
    this.list({ sparePartTypeId: id });
  };
  handleChange = (value) => {
    this.setState((state) => ({ ...state, selectedSpare: value }));
    this.loadSpare(value);
  };
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.state.selectedSpare
      ? this.loadSpare(this.state.selectedSpare)
      : this.list();
  };
  title = "Spare Parts";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      align: "left",
    },
    {
      dataIndex: "sparePartName",
      key: "sparePartName",
      title: "Item Name",
      width: 160,
      align: "left",
    },
    {
      dataIndex: "sparePartNumber",
      key: "sparePartNumber",
      title: "Item No",
      align: "left",
      width: 100,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
      width: 100,
    },
    {
      dataIndex: "sparePartType",
      key: "sparePartType",
      title: "Category",
      align: "left",
      width: 100,
      render: (value, index, record) => {
        return value?.sparePartTypeName;
      },
    },
    {
      dataIndex: "assetLibrary",
      key: "assetLibrary",
      title: "Asset Library",
      align: "left",
      width: 160,
      render: (value) => {
        return value?.assetLibraryName;
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "left",
      width: 100,
      render: (value) => {
        return !!value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "sparePartId",
      key: "sparePartId",
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

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            <Row gutter={[10, 10]}>
              {/* <Col>
                {this.props.access[0]?.includes("add") && (
                  <Tooltip title="Spare Parts Upload in Excel">
                    <Link to="uploadInventoryParts">
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Link>
                  </Tooltip>
                )}
              </Col> */}
              <Col>
                {this.props.access[0]?.includes("add") && (
                  <AddButton onClick={() => this.add()} />
                )}
              </Col>
            </Row>
          }
        >
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
            rowKey="sparePartId"
            pagination={true}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="middle"
          />
          <InventoryConfigForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(InventoryConfiguration));
