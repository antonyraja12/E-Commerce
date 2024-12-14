import {
  ApartmentOutlined,
  AppstoreOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  TreeSelect,
} from "antd";
import dayjs from "dayjs";
import EnergyDashboradDetailService from "../../../services/energy-services/energy-detail-dashboard-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import TreeView from "../energy-hierarchy-configuration/tree-view";
import CardView from "./card-view";
import ListView from "./list-view";
const { Option } = Select;
class EnergyList extends FilterFunctions {
  state = { layout: "Grid" };
  service = new EnergyDashboradDetailService();
  date = dayjs();
  componentDidMount() {
    this.setState((state) => ({ ...state, title: "Card View" }));
    this.service
      .getAllAssetEnergy({
        currentDate: new Date().toISOString(),
      })
      .then(({ data }) => {
        this.setState((state) => ({ ...state, rows: data }));
      });

    this.service
      .getTreeData({ currentDate: new Date().toISOString() })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          treeData: this.service.convertToTree(data),
        }));
      });
    this.loadAppHierarchy();
  }
  search = (data) => {
    console.log("searchhh");
    this.service
      .getAllAssetEnergy({
        currentDate: new Date().toISOString(),
        aHId: data.ahid,
      })
      .then(({ data }) => {
        this.setState((state) => ({ ...state, rows: data }));
      });

    this.service
      .getTreeData({ currentDate: new Date().toISOString(), aHId: data.ahid })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          treeData: this.service.convertToTree(data),
        }));
      });
  };
  loadAppHierarchy = () => {
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));
        this.props.form.setFieldValue(
          "ahid",
          this.appHierarchyService.convertToSelectTree(data)[0].value
        );
      })
      .finally(() => {
        this.props.form.submit();
      })
      .catch((error) => {
        console.error("Failed to load app hierarchy:", error);
      });
  };
  returnLayout = (layout) => {
    switch (layout) {
      case "Grid":
        // this.setState((state) => ({ ...state, title: "Card View" }));
        return <CardView {...this.state} />;
      case "List":
        // this.setState((state) => ({ ...state, title: "List View" }));
        return <ListView {...this.state} />;
      case "Tree":
        // this.setState((state) => ({ ...state, title: "Tree View" }));
        return <TreeView data={this.state.treeData} />;
      default:
        break;
    }
  };
  toggleView = (e) => {
    this.setState((state) => ({ ...state, layout: e.target.value }));
  };
  onSubmit = (value) => {
    this.list(value);
  };
  render() {
    // console.log("state", this.state.treeData);
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page title={"Energy Dashboard"}>
          <Row gutter={[10, 10]} justify="space-between">
            <Col>
              <Form form={this.props.form} onFinish={this.search}>
                <Space>
                  <Form.Item name="ahid" style={{ width: "200px" }}>
                    <TreeSelect
                      onChange={(v) => this.getAssetList(v)}
                      showSearch
                      loading={this.state.isparentTreeListLoading}
                      placeholder="Site"
                      treeData={this.state.parentTreeList}
                    ></TreeSelect>
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      Go
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            </Col>
            <Col>
              <Radio.Group
                value={this.state.layout}
                buttonStyle="solid"
                onChange={this.toggleView}
              >
                <Tooltip title={"Energy Device Tile"}>
                  <Radio.Button value="Grid">
                    <AppstoreOutlined />
                  </Radio.Button>
                </Tooltip>
                <Tooltip title={"Energy Device List Overview"}>
                  <Radio.Button value="List">
                    <MenuOutlined />
                  </Radio.Button>
                </Tooltip>
                <Tooltip title={"Energy Device Hierarchy"}>
                  <Radio.Button value="Tree">
                    <ApartmentOutlined />
                  </Radio.Button>
                </Tooltip>
              </Radio.Group>
            </Col>
            <Col xs={24}>{this.returnLayout(this.state.layout)}</Col>
          </Row>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(EnergyList)));
