import PageList from "../../../utils/page/page-list";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import ReasonConfigurationForm from "./reason-configuration-form";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import Page from "../../../utils/page/page";
import {
  Table,
  Space,
  Row,
  Col,
  Input,
  Result,
  Spin,
  Select,
  TreeSelect,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import AssetService from "../../../services/asset-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import { withForm } from "../../../utils/with-form";
const { Option } = Select;
class ReasonList extends PageList {
  state = {
    reasons: [],
    asset: [],
  };
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  service = new DowntimeReasonService();
  assetservice = new AssetService();
  appHierarchyService = new AppHierarchyService();
  title = "Downtime Reason";
  columns = [
    {
      title: "S.No",
      dataIndex: "serialNumber",
      width: 80,
      render: (_, __, index) => index + 1,
    },

    {
      dataIndex: "assetId",
      key: "assetId",
      title: "Asset",
      render: (value, record) => {
        if (!Array.isArray(value)) {
          return "";
        }

        const assetNames = value.map((id) => {
          const selectedAsset = this.state.asset.find((e) => e.assetId === id);
          return selectedAsset ? selectedAsset.assetName : "";
        });

        return assetNames.join(", ");
      },
      sorter: (a, b) => {
        const getFirstAssetId = (assetId) => {
          if (Array.isArray(assetId)) {
            return assetId[0] ? String(assetId[0]) : "";
          }
          return assetId ? String(assetId) : "";
        };

        const firstAssetIdA = getFirstAssetId(a.assetId);
        const firstAssetIdB = getFirstAssetId(b.assetId);

        return firstAssetIdA.localeCompare(firstAssetIdB);
      },
    },

    {
      dataIndex: "downtimeReason",
      key: "downtimeReason",
      title: "Reasons",
      sorter: (a, b) => a.downtimeReason.localeCompare(b.downtimeReason),
    },
    {
      dataIndex: "colourCode",
      key: "colourCode",
      title: "Colour",
      render: (text) => (
        <Space>
          <div
            style={{
              borderRadius: "5px",
              backgroundColor: text,
              width: "25px",
              height: "25px",
            }}
          ></div>
          {text}
        </Space>
      ),
    },
    {
      dataIndex: "downtimeReasonId",
      key: "downtimeReasonId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
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

  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.rows.filter((e) => {
      return (
        e.downtimeReason?.toLowerCase().includes(s) ||
        e.colourCode?.toLowerCase().includes(s)
      );
    });
    this.setState((state) => ({ ...state, res: res }));
  };

  handleData(data) {
    return this.service.convertToTree(data);
  }
  getAppHierarchyList() {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.list({
          ahId: this.appHierarchyService.convertToSelectTree(data)[0].value,
        });
        this.setState(
          (state) => ({
            ...state,
            parentTreeList: this.appHierarchyService.convertToSelectTree(data),
          }),
          () => {
            this.props.form?.setFieldValue(
              "ahId",

              this.state.parentTreeList[0]?.value
            );
          }
        );
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  }
  componentDidMount() {
    this.getAppHierarchyList();

    this.assetservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
    console.log("this.state.parentTreeList", this.state.parentTreeList);
    // this.list({ ahId: this.state.parentTreeList[0]?.value });
  }
  render() {
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

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
          <Row justify="space-between">
            <Col>
              <Form form={this.props.form} layout="inline">
                <Form.Item name="ahId">
                  <TreeSelect
                    style={{ width: "250px" }}
                    treeData={this.state.parentTreeList}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row style={{ marginTop: "16px" }}>
            <Col span={24}>
              <Form.Item>
                <Input
                  prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                  onInput={this.filter}
                  placeholder="Search Downtime Reason..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: "16px" }}>
            <Col span={24}>
              <Table
                rowKey="downtimeReasonId"
                pagination={{ showSizeChanger: true, size: "default" }}
                loading={this.state.isLoading}
                dataSource={this.state.res}
                columns={this.columns}
                size="middle"
                bordered
              />
            </Col>
          </Row>
          <ReasonConfigurationForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withForm(withRouter(withAuthorization(ReasonList)));
