import {
  DisconnectOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  TreeSelect,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import OeeCalculationService from "../../../services/oee-calculation-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import QualityRejectionForm from "../quality-rejection/quality-rejection-form";

const { Option } = Select;

class OEEDashboard extends PageForm {
  constructor(props) {
    super(props);

    this.state = {
      selectedOrganization: null,
      assets: [],
      refreshInterval: 2000,
      totalPartCount: 0,
      acceptedPartCount: 0,
      rejectedPartCount: 0,
      isRunning: false,
      liveOEEPercentage: 0,
      isLoading: false,
    };
  }
  state = { assets: [] };
  service = new AppHierarchyService();
  oeeservice = new OeeCalculationService();
  assetService = new AssetService();
  MachineStatusService = new MachineStatusService();
  state = { selectedOrganization: null, assets: [] };

  handleAutoRefresh = () => {
    const ahId = this.state.selectedOrganization;
    // const ahId = this.props.form?.getFieldValue("ahName");
    this.oeeservice.getbyahId(ahId).then(({ data }) => {
      // console.log("data", data);
      this.setState((state) => ({ ...state, assets: data, ahId: ahId }));
    });
  };

  getAppHierarchyList() {
    return new Promise((resolve, reject) => {
      this.setState((state) => ({ ...state, isParentLoading: true }));

      this.service
        .list()
        .then(({ data }) => {
          const parentTreeList = this.service.convertToSelectTree(data);
          this.setState(
            (state) => ({ ...state, parentTreeList }),
            () => {
              // Set the default value if needed
              const defaultOrganization = parentTreeList[0]?.value;
              this.props.form?.setFieldValue("ahName", defaultOrganization);
              resolve(); // Resolve the promise when the state is updated
            }
          );
        })
        .finally(() => {
          this.setState((state) => ({ ...state, isParentLoading: false }));
        });
    });
  }
  setHierarchyName = (value) => {
    this.setState({ selectedOrganization: value, ahId: value });
  };

  handleGoButtonClick = () => {
    let ahId = this.state.selectedOrganization;
    if (!ahId) {
      return;
    }
    ahId = parseInt(ahId, 10);
    if (isNaN(ahId)) {
      return;
    }

    this.setState({ isLoading: true });

    this.oeeservice
      .getbyahId(ahId)
      .then(({ data }) => {
        this.setState({ assets: data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { completed, qualityPopup, shiftAllocationId } = this.props;
    const { isLoading } = this.state;
    const onClick = (id) => {
      assetId({ id: id });
    };

    const assetId = this.oeeservice.assetId;
    const routeToNavigate = `/MachineDetailDashboard`;
    const customStyles = {
      buttonMargin: {
        marginLeft: "-18%",
      },

      cardContent: {
        position: "absolute",
        top: "5px",
        left: "5px",
        height: "95px",
      },
    };

    const assetCards = this.state.assets.map((asset) => {
      const oeePercentage = asset.oee;
      let progressBarColor = "#63af31";
      if (oeePercentage >= 0 && oeePercentage <= 50) {
        progressBarColor = "#fa0707";
      } else if (oeePercentage > 50 && oeePercentage <= 80) {
        progressBarColor = "#f7f307e1";
      }

      const isRedColor = asset.color === "red";
      const circleColorClass = this.state.isRunning
        ? "green-circle"
        : isRedColor
        ? "red-circle blinking"
        : "red-circle";

      const progressBarStyles = {
        height: "10px",
        width: `${oeePercentage}%`,
        maxWidth: "100%",
        backgroundColor: progressBarColor,
        borderRadius: "50px",
        textAlign: "right",
        transition: "width 1s ease-in-out",
      };

      return (
        <Col xs={24} sm={12} md={8} lg={6} key={`asset${asset.assetId}`}>
          <Link
            to={`/oee/machine-detail-dashboard?&oeeCalculationId=${asset.oeeCalculationId}?&shiftAllocationId=${asset.shiftAllocationId}&assetId=${asset?.assetName}&ahId=${asset?.ahId}`}
          >
            <Card
              hoverable
              bordered={true}
              style={{
                width: "120%",
                // width: "200px",
                maxWidth: "500px",
                marginBottom: "20px",
                boxShadow: `5px 0px 10px ${
                  asset.color === "rgb(255, 0, 0)"
                    ? "red"
                    : asset.color === "rgb(0, 128, 0)"
                    ? "green"
                    : asset.color
                }`,
                transition: "box-shadow 0.3s ease-in-out",
                margin: "10px",
              }}
              bodyStyle={{ padding: "10px" }}
            >
              <div className="asset-container">
                <div
                  className={circleColorClass}
                  style={{ backgroundColor: asset.color }}
                ></div>
                <h1 style={{ fontSize: "larger" }}>{asset.assetName}</h1>
              </div>
              {qualityPopup && qualityPopup.open && (
                <QualityRejectionForm
                  {...qualityPopup}
                  close={this.qualityOnClose}
                  shiftAllocationId={shiftAllocationId}
                  rejectedPart={this.state.rejectedPartCount}
                  acceptedPart={this.state.acceptedPartCount}
                  updateProductionSummary={this.updateProductionSummary}
                />
              )}
              <div>
                <Table
                  dataSource={[asset]}
                  pagination={false}
                  style={{ height: "auto" }}
                >
                  <Table.Column
                    title={
                      <div style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                        Part Counts
                      </div>
                    }
                    dataIndex="totalPartCount"
                    key="totalPartCount"
                    className="center-text-column"
                    width="35%"
                    render={(text, record) => (
                      <Tooltip title={`Total Part Count Produced`}>
                        <span style={{ color: "blue" }}>
                          <strong>{text}</strong>
                        </span>
                      </Tooltip>
                    )}
                  />
                  <Table.Column
                    title={
                      <div style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                        Runtime / Downtime (mins)
                      </div>
                    }
                    key="runtimeDownTime"
                    className="center-text-column"
                    render={(text, record) => (
                      <Tooltip title={`Runtime & Downtime`}>
                        <div>
                          <span style={{ color: "green" }}>
                            <strong>{asset.runTime}</strong>
                          </span>{" "}
                          <strong>/</strong>{" "}
                          <span style={{ color: "red" }}>
                            <strong>{asset.downTime}</strong>
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  />
                </Table>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>
                  <strong>OEE</strong>
                </p>
                <span>{asset.oee}%</span>
              </div>
              <Tooltip title={`OEE Percentage`}>
                <div style={progressBarStyles}></div>
              </Tooltip>
            </Card>
          </Link>
        </Col>
      );
    });

    return (
      <Spin spinning={isLoading}>
        <Card>
          <Form form={this.props.form}>
            <Row gutter={8} align="middle">
              <Col sm={8}>
                <Form.Item name="ahName">
                  <TreeSelect
                    showSearch
                    style={{ width: "45%" }}
                    placeholder="Organization"
                    treeDefaultExpandAll={false}
                    treeData={this.state.parentTreeList}
                    onChange={this.setHierarchyName}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                style={customStyles.buttonMargin}
              >
                <Form.Item>
                  <Button type="primary" onClick={this.handleGoButtonClick}>
                    Go
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: "-30px" }}>
              <Col xs={24}>
                <div className="status">
                  <div className="status-item">
                    <div className="status-indicator running"></div>
                    <a href="" className="black-link">
                      Running
                    </a>
                  </div>

                  <div className="status-item">
                    <div className="status-indicator empty"></div>
                    <a href="" className="black-link">
                      Unplanned Downtime
                    </a>
                  </div>

                  <div className="status-item">
                    <div className="status-icon">
                      <DisconnectOutlined /> Connection Lost
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="status">
                  <div className="status-item">
                    <div className="status-icon">
                      <ExclamationCircleOutlined /> Connection Error
                    </div>
                  </div>

                  <div className="status-item">
                    <div className="status-indicator Downtime"></div>
                    Planned Downtime
                  </div>
                </div>
              </Col>
            </Row>

            {/* <div className="container">
              <div className="center-heading">
                <h1 className="top-center" style={{fontSize:"larger"}}>Machine Status Legend</h1>
              </div>
            </div> */}

            <div
              style={{
                position: "absolute",
                top: "25px",
                right: "-20px",
                width: "300px",
              }}
            >
              {/* <div className="right-heading">
                <h1 style={{ fontSize: "16px" }}>OEE Legend</h1>
              </div> */}

              <div className="progress-bars">
                <div className="progress-bar progress-bar-1">
                  <span className="progress-label">(0-50)%</span>
                </div>
                <div className="progress-bar progress-bar-2">
                  <span className="progress-label">(51-80)%</span>
                </div>
                <div className="progress-bar progress-bar-3">
                  <span className="progress-label">(81-100)%</span>
                </div>
              </div>
            </div>
          </Form>
        </Card>

        {/* <div>
          <Row gutter={[20, 20]} style={{ display: "flex", gap: "56px" }}>
            {assetCards}
          </Row>
        </div> */}
      </Spin>
    );
  }
}

export default withRouter(withForm(OEEDashboard));
