import PageList from "../../../utils/page/page-list";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
// import Page from "../../../utils/page/page";
import Page from "../../../utils/page/page";

import {
  Table,
  Space,
  Form,
  Select,
  Input,
  Button,
  Col,
  Row,
  Result,
  Spin,
} from "antd";
import ModelConfigurationService from "../../../services/oee/model-configuration-service";
import ModelConfigurationForm from "./model-configuration-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import { Component } from "react";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
const { Option } = Select;
const onSearch = (value) => {
  console.log(`selected ${value}`);
};
const { TextArea } = Input;
class ModelConfigurationList extends PageList {
  service = new ModelConfigurationService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  state = {
    selectedAssetId: null,
    selectedAssetDetails: null,
  };

  title = "Model Configuration";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset",
      // render: (asset) => {
      //   return asset?.assetName;
      // },
    },
    {
      dataIndex: "aHName",
      key: "aHName",
      title: "Hierarchy",
      // render: (asset) => {
      //   return asset?.ahname;
      // },
    },
    {
      dataIndex: "modelName",
      key: "modelName",
      title: "Model Name",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      // render: (record) => {
      //   return record?.modelName;
      // },
    },

    {
      dataIndex: "productCode",
      key: "productCode",
      title: "Product Code",
    },
    {
      dataIndex: "programName",
      key: "programName",
      title: "Program Name",
    },
    {
      dataIndex: "cycleTime",
      key: "cycleTime",
      title: "Cycle Time (mins)",
      align: "right",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },

    {
      dataIndex: "modelConfigurationId",
      key: "modelConfigurationId",
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

  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
    this.service.list().then(({ data }) => {
      this.setState((state) => ({
        ...state,
        reasons: data.filter((e) => e.parentId === null),
      }));
    });
    this.setState((state) => ({ ...state, hidden: false }));
  };
  onSuccess = (selectedAssetDetails) => {
    this.setState({ selectedAssetDetails }, () => {
      this.updateSelectedAssetDetails();
    });
  };

  filterAsset = (values) => {
    // console.log("values", values.assetId);
    this.service
      .getassetIdlist(values.assetId)
      .then((response) => {
        this.setState({ res: response.data });
      })
      .catch((error) => {
        console.error("Filter error:", error);
      });
  };

  updateSelectedAssetDetails = () => {
    const { selectedAssetId, asset } = this.state;
    const selectedAsset = asset.find((e) => e.assetId === selectedAssetId);
    this.setState({ selectedAssetDetails: selectedAsset });
  };

  componentDidMount() {
    this.appHierarchyService.list({ active: true }).then((response) => {
      this.setState((state) => ({
        ...state,
        parentTreeList: this.appHierarchyService.convertToSelectTree(
          response.data
        ),
      }));
      this.setState((state) => ({ ...state, appHierarchy: response.data }));
    });
    this.assetService
      .list({ active: true, assetCategory: 1 })
      .then((response) => {
        this.setState((state) => ({ ...state, asset: response.data }));
        // console.log(response.data, "data");
      });

    super.componentDidMount();
  }

  render() {
    // console.log("res", this.state.res);
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
          <Form
            onFinish={this.filterAsset}
            form={this.props.form}
            layout="inline"
          >
            <Row gutter={10} align="middle">
              <Col>
                <Form.Item name="assetId">
                  <Select
                    style={{
                      width: "200px",
                    }}
                    showSearch
                    placeholder="Select Asset"
                    //onChange={this.filterAsset}
                  >
                    {this.state.asset?.map((e) => (
                      <Option key={`asset${e.assetId}`} value={e.assetId}>
                        {e.assetName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Go
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <br />
          <Table
            rowKey="modelConfigurationId"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            loading={this.state.isLoading}
            columns={this.columns}
            dataSource={this.state.res}
            size="middle"
            bordered
          />
          <ModelConfigurationForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(ModelConfigurationList));
