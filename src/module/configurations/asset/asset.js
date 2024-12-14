import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { AddButton } from "../../../utils/action-button/action-button";
import {
  Table,
  Badge,
  Button,
  Modal,
  message,
  Avatar,
  Row,
  Col,
  Input,
  Space,
  Result,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import OrganisationService from "../../../services/organisation-service";
import Page from "../../../utils/page/page";
import PlantService from "../../../services/plant-service";
import { QrcodeOutlined, UploadOutlined } from "@ant-design/icons";
import QRCodeForm from "../qr-code-form/qr-code-form";
import React from "react";
import { withAuthorization } from "../../../utils/with-authorization";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { remoteAsset } from "../../../helpers/url";
import { SearchOutlined } from "@ant-design/icons";
import EnergyDetailDashboardService from "../../../services/energy-services/energy-detail-dashboard-service";
import { withRouter } from "../../../utils/with-router";
let text = "";
class Asset extends PageList {
  state = {
    htmlContent: "",
  };
  service = new AssetService();
  organisationServicervice = new OrganisationService();
  customerService = new PlantService();
  appHierarchyService = new AppHierarchyService();
  energyService = new EnergyDetailDashboardService();
  componentDidMount() {
    Promise.all([this.appHierarchyService.list({ active: true })]).then(
      (response) => {
        this.setState((state) => ({
          ...state,
          appHeirarchyData: response[0].data,
        }));
      }
    );

    super.componentDidMount();
  }

  constructor(props) {
    super(props);
    this.qrRef = React.createRef();
  }
  deleteEnergyAsset = (assetId) => {
    this.service.retrieve(assetId).then(({ data }) => {
      if (data.assetCategory == 2) {
        this.energyService.deleteEnergyAsset(assetId);
      }
    });
  };

  title = "Asset";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 0,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "imagePath",
      key: "imagePath",
      title: "Image",
      width: "100px",
      align: "center",
      render: (value) => {
        return <Avatar src={remoteAsset(value)} shape="square" />;
        // return <Avatar   src={`${publicUrl}/assetImages/${this.state?.imageUrl}`} shape="square" />;
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
      colSpan: 1,
    },
    {
      dataIndex: "assetCategory",
      title: "Asset Category",
      render: (value) => {
        return value === 1 ? "Other Assets" : "Energy Assets";
      },
    },

    {
      dataIndex: "ahid",
      key: "ahid",
      title: "Entity",
      render: (value) => {
        const appheir = this.state.appHeirarchyData?.find(
          (e) => e.ahid === value
        );
        return appheir ? appheir.ahname : null;
      },
    },

    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
      colSpan: 1,
    },

    {
      dataIndex: "assetId",
      key: "assetId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {/* {this.props.qrcode && ( */}
            <Button
              onClick={() => this.generateQR(value)}
              icon={<QrcodeOutlined />}
              type="text"
            ></Button>
            {/* )} */}
            {this.props.access[0]?.includes("view") && (
              <Link to={`view/${value}`}>
                <ViewButton />
              </Link>
            )}
            {this.props.access[0]?.includes("edit") && (
              <Link to={`update/${value}`}>
                <EditButton />
              </Link>
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton
                onClick={() => {
                  this.delete(value);
                  this.deleteEnergyAsset(value);
                }}
              />
            )}
          </>
        );
      },
    },
  ];
  generateQR = (id) => {
    let link = `${window.location.protocol}//${window.location.host}/product-verification/${id}`;
    this.setState((state) => ({ ...state, openQr: true, qrLink: link }));
  };
  closeQR = () => {
    this.setState((state) => ({ ...state, openQr: false, qrLink: null }));
  };
  downloadQR = () => {
    this.qrRef.current.downloadQRCode();
    // console.log(this.qrRef.current.downloadQRCode());
    // this.qrRef.downloadQRCode()
  };

  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();

    let rows = this.state.res.filter((e) => {
      return e.assetName?.toLowerCase().includes(s);

      // || e.appheir.ahname?.toLowerCase().includes(s)
    });
    this.setState((state) => ({ ...state, rows: rows }));
  };

  render() {
    return (
      <Page
        title={this.title}
        action={
          <Space>
            {this.props.access[0]?.includes("add") && (
              <Link to="uploadasset">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Link>
            )}

            <Link to="add">
              {this.props.access[0]?.includes("add") && <AddButton />}
            </Link>
          </Space>
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
          scroll={{ x: 980 }}
          rowKey="assetId"
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="small"
          bordered
          pagination={{
            showSizeChanger: true,
            // //showQuickJumper: true,
            size: "default",
          }}
        />

        <Modal
          title="QR Code"
          open={this.state?.openQr ?? false}
          onCancel={this.closeQR}
          onOk={this.downloadQR}
          destroyOnClose
          okText="Download"
        >
          <QRCodeForm ref={this.qrRef} link={this.state.qrLink} />
        </Modal>
      </Page>
    );
  }
}

export default withRouter(withAuthorization(Asset));
