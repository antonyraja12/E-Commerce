import PageList from "../../../utils/page/page-list";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { Table, Space, Row, Col, Input, Result, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import QualityReasonService from "../../../services/oee/quality-reason-service";
import QualityReasonConfigurationForm from "../quality-rejection/quality-reason-configuration-form";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import AssetService from "../../../services/asset-service";
import TagsCell from "../../../component/TagCell";
class QualityReasonList extends PageList {
  state = {
    reasons: [],
    asset: [],
  };
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  service = new QualityReasonService();
  assetservice = new AssetService();
  title = "Quality Rejection";
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
      dataIndex: "qualityRejectionReason",
      key: "qualityRejectionReason",
      title: "Reasons",
      sorter: (a, b) =>
        a.qualityRejectionReason.localeCompare(b.qualityRejectionReason),
    },
    {
      dataIndex: "qualityRejectionReasonId",
      key: "qualityRejectionReasonId",
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
      return e.qualityRejectionReason?.toLowerCase().includes(s);
      //  ||
      // e.colourCode?.toLowerCase().includes(s)
    });
    this.setState((state) => ({ ...state, res: res }));
  };
  handleData(data) {
    return this.service.convertToTree(data);
  }
  componentDidMount() {
    this.list();
    this.assetservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });
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
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search..."
              />
            </Col>
          </Row>
          <br />
          <Table
            rowKey="qualityRejectionReasonId"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
            bordered
          />
          <QualityReasonConfigurationForm
            {...this.state.popup}
            close={this.onClose}
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(QualityReasonList));
