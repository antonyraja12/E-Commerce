import PageList from "../../../utils/page/page-list";
import {
  BackButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { AddButton } from "../../../utils/action-button/action-button";
import {
  Button,
  Col,
  Form,
  Input,
  Result,
  Row,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import { Link } from "react-router-dom";
import AssetLibraryServiceBasicDetails from "../../../services/asset-library-service";
import Page from "../../../utils/page/page";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";

class AssetLibrary extends PageList {
  service = new AssetLibraryServiceBasicDetails();

  componentDidMount() {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    Promise.all([this.service.list()])
      .then((response) => {
        let changes = this.handleData(response[0].data);
        this.setState((state) => ({
          ...state,
          rows: changes,
          res: changes,
        }));
      })

      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
    // super.componentDidMount();
  }

  getName = (id) => {
    let e = this.state.organisation?.find((e) => e.ahId == id);
    return e ? e.a : "";
  };

  title = "Asset Library";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "assetLibraryName",
      key: "assetLibraryName",
      title: "Asset Library Name",
      sorter: (a, b) => a.assetLibraryName.localeCompare(b.assetLibraryName),
    },
    {
      dataIndex: "assetCategory",
      title: "Asset Category",
      render: (value) => {
        return value === 1 ? "Other Assets" : "Energy Assets";
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      sorter: (a, b) => {
        const descriptionA = a.description || "";
        const descriptionB = b.description || "";
        return descriptionA.localeCompare(descriptionB);
      },
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "assetLibraryId",
      key: "assetLibraryId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Link to={`view/${value}`}>
              {this.props.access[0]?.includes("view") && <ViewButton />}
            </Link>
            <Link to={`update/${value}`}>
              {this.props.access[0]?.includes("edit") && <EditButton />}
            </Link>
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();

    let rows = this.state.res.filter((e) => {
      return e.assetLibraryName?.toLowerCase().includes(s);
    });
    this.setState((state) => ({ ...state, rows: rows }));
  };

  render() {
    return (
      <Page
        title={this.title}
        action={
          <>
            <Space>
              {this.props.access[0]?.includes("add") && (
                <Link to="uploadLibrary">
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Link>
              )}
              {this.props.access[0]?.includes("add") && (
                <Link to="add">
                  <AddButton />
                </Link>
              )}
            </Space>
          </>
        }
      >
        <Row justify="space-between">
          <Col span={24}>
            <Form>
              <Form.Item>
                <Input
                  prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                  onInput={this.filter}
                  value={this.state.searchValue}
                  placeholder="Search..."
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <br />
        <Table
          bordered
          size="small"
          scroll={{ x: 980 }}
          rowKey="assetLibraryId"
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          // size="middle"
          pagination={{
            showSizeChanger: true,

            // //showQuickJumper: true,

            size: "default",
          }}
        />
      </Page>
    );
  }
}

export default withRouter(withAuthorization(AssetLibrary));
