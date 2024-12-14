import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  TreeSelect,
} from "antd";
import { Link } from "react-router-dom";
import DigitalWorkflowChecklistService from "../../../../services/inspection-management-services/checklist-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import { withAuthorization } from "../../../../utils/with-authorization";
import FilterFunctions from "../../../remote-monitoring/common/filter-functions";
import Paragraph from "antd/es/typography/Paragraph";
import TagsCell from "../../../../component/TagCell";
import AssetService from "../../../../services/asset-service";
import { withRouter } from "../../../../utils/with-router";
const style = {
  formItem: {
    minWidth: "120px",
  },
};

class Checklist extends FilterFunctions {
  service = new DigitalWorkflowChecklistService();
  assetService = new AssetService();
  componentDidMount() {
    Promise.all([this.assetService.list()]).then((response) => {
      this.setState((state) => ({ ...state, AssetService: response[0].data }));
    });

    this.getAppHierarchyList();
    this.getAssetList();
    super.componentDidMount();
  }

  title = "Checklist";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 80,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "checkListName",
      key: "checkListName",
      title: "Checklist Name",
    },

    {
      dataIndex: "assets",
      key: "assets",
      title: "Asset",
      render: (value) => {
        return (
          <div>
            {
              <TagsCell
                tags={value}
                keyName="asset.assetName"
                valueName="asset.assetName"
              />
            }
          </div>
        );
      },
    },

    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
      width: 200,
    },

    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "checkListId",
      key: "checkListId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value) => {
        return (
          <>
            {this.props.access[0]?.includes("view") && (
              <Link to={`view/${value}`}>
                <ViewButton onClick={() => this.view(value)} />
              </Link>
            )}
            {this.props.access[0]?.includes("edit") && (
              <Link to={`update/${value}`}>
                <EditButton onClick={() => this.edit(value)} />
              </Link>
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  submitForm = (value) => {
    this.list(value);
  };
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.rows.filter((e) => {
      return e.checkListName?.toLowerCase().includes(s);
    });
    this.setState((state) => ({ ...state, res: res }));
  };
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
            <>
              <Col>
                <Row gutter={[10, 10]} justify="end">
                  <Col>
                    {this.props.checktypes || (
                      <Tooltip title="CheckTypes">
                        <Link to="check-type" state={this.props.location.state}>
                          <Button>Check Types</Button>
                        </Link>
                      </Tooltip>
                    )}
                  </Col>
                  <Col>
                    <Tooltip title="Checks">
                      {this.props.checks || (
                        <Link to="checks" state={this.props.location.state}>
                          <Button>Checks</Button>
                        </Link>
                      )}
                    </Tooltip>
                  </Col>
                  <Col>
                    {this.props.access[0]?.includes("add") && (
                      <Tooltip title="Checklist Upload in Excel">
                        <Link to="uploadChecklist">
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Link>
                      </Tooltip>
                    )}
                  </Col>

                  {this.props.access[0]?.includes("add") && (
                    <Col>
                      <Link to="add">
                        <AddButton />
                      </Link>
                    </Col>
                  )}
                </Row>
              </Col>
            </>
          }
        >
          <Row justify="space-between">
            <Col>
              <Form size="small" layout="inline" onFinish={this.submitForm}>
                <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                  <TreeSelect
                    onChange={(v) => this.getAssetList(v)}
                    showSearch
                    loading={this.state.isparentTreeListLoading}
                    placeholder="Entity"
                    allowClear
                    treeData={this.state.parentTreeList}
                    treeNodeFilterProp="title"
                  ></TreeSelect>
                </Form.Item>

                <Form.Item name="assetId" style={style.formItem}>
                  <Select
                    optionFilterProp="label"
                    onChange={this.getData}
                    showSearch
                    loading={this.state.isAssetListLoading}
                    placeholder="Asset"
                    allowClear
                    options={this.state.assetList}
                  ></Select>
                </Form.Item>

                <Button type="primary" htmlType="submit">
                  <SearchOutlined /> Go
                </Button>
              </Form>
            </Col>
          </Row>
          <br></br>
          <Row justify="space-between">
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search..."
                bordered={true}
              />
            </Col>
          </Row>
          <br />
          <Table
            pagination={{
              showSizeChanger: true,
              size: "default",
            }}
            scroll={{ x: 980 }}
            rowKey="checkListId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(Checklist));
