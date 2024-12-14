import {
  Badge,
  Card,
  Col,
  Form,
  Row,
  Space,
  Spin,
  Statistic,
  Switch,
  TreeSelect,
} from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccess } from "../../../hooks/useAccess";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import OeeCalculationService from "../../../services/oee-calculation-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import { OeeDashboardContext } from "../../OEE/oee-dashboard/oee-dashboard-context";
import HotPackDowntimeCard from "./hotpack-downtime-card";
import HotPackProductionSummaryCard from "./hotpack-production-summary-card";

function HotPackMachineDetailDashboard(props) {
  const [access] = useAccess();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [manualStatus, setManualStatus] = useState(null);
  const [reloadDowntime, setReloadDowntime] = useState(0);
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [isMachineParentLoading, setIsMachineParentLoading] = useState(false);
  const [parentTreeList, setParentTreeList] = useState([]);
  const [machineParentTreeList, setMachineParentTreeList] = useState([]);
  const [assetId, setAssetId] = useState(null);
  const [ahId, setAhId] = useState(null);
  const apphierarchyService = new AppHierarchyService();
  const assetService = new AssetService();
  const fetch = ({ assetId }) => {
    setLoading(true);
    const service = new OeeCalculationService();
    service
      .getByAssetId(assetId)
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchManualStatus = ({ assetId }) => {
    setLoading(true);
    const service = new OeeCalculationService();
    service
      .getManualEntry(assetId)
      .then(({ data }) => {
        setManualStatus(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleMachineStatus = () => {
    setLoading(true);
    const statusService = new MachineStatusService();
    statusService
      .machineStatus(assetId)
      .then(({ data }) => {
        if (assetId) fetch({ assetId });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useMemo(() => {
    if (assetId) {
      fetch({ assetId });
      fetchManualStatus({ assetId });
    }
  }, [assetId]);

  useEffect(() => {
    getAppHierarchyList();
  }, []);
  useEffect(() => {
    getMachine();
  }, [ahId]);

  const getAppHierarchyList = () => {
    setIsParentLoading(true);

    apphierarchyService
      .list()
      .then(({ data }) => {
        const parentTreeList = apphierarchyService.convertToSelectTree(data);
        setParentTreeList(parentTreeList);
        const defaultOrganization = parentTreeList[0]?.value;
        props.form?.setFieldValue("aHId", defaultOrganization);
        setHierarchyName(defaultOrganization);
        return Promise.resolve();
      })
      .finally(() => {
        setIsParentLoading(false);
      });
  };
  const getMachine = () => {
    setIsMachineParentLoading(true);

    assetService
      .list({ aHId: ahId, assetCategory: 1, active: true })
      .then(({ data }) => {
        const machineParentTreeList = data.map((item) => ({
          label: item.assetName,
          value: item.assetId,
        }));
        setMachineParentTreeList(machineParentTreeList);
        const defaultAsset = machineParentTreeList[0]?.value;
        props.form?.setFieldValue("assetId", defaultAsset);
        setAssetId(defaultAsset);
        return Promise.resolve();
      })
      .finally(() => {
        setIsMachineParentLoading(false);
      });
  };

  const setHierarchyName = (value) => {
    setAhId(value);
  };

  return (
    <OeeDashboardContext.Provider value={{ reloadDowntime, setReloadDowntime }}>
      <Page title="HMI">
        <Spin spinning={loading}>
          <Row gutter={[10, 10]} justify="space-between">
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Form form={props.form}>
                <Space>
                  <Form.Item name="aHId">
                    <TreeSelect
                      showSearch
                      loading={isParentLoading}
                      style={{ width: "180px" }}
                      placeholder="Organization"
                      treeDefaultExpandAll={false}
                      treeData={parentTreeList}
                      onChange={setHierarchyName}
                    />
                  </Form.Item>
                  <Form.Item name="assetId">
                    <TreeSelect
                      showSearch
                      loading={isMachineParentLoading}
                      style={{ width: "180px" }}
                      placeholder="Machine"
                      treeDefaultExpandAll={false}
                      treeData={machineParentTreeList}
                      onChange={(value) => setAssetId(value)}
                    />
                  </Form.Item>
                </Space>
              </Form>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <div
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  float: "right",
                }}
              >
                {data?.color === "#33D04C" ? (
                  <Badge color="#33D04C" status="processing" text="Running" />
                ) : data?.color === "#FF5353" ? (
                  <Badge
                    color="#FF5353"
                    status="processing"
                    text="Not Running"
                  />
                ) : data?.color === "yellow" ? (
                  <Badge status="processing" text="No Shift" />
                ) : (
                  <Badge status="default" text="Connection Lost" />
                )}
                {manualStatus && manualStatus?.availability && (
                  <Switch
                    checked={data?.color === "#33D04C"}
                    onChange={handleMachineStatus}
                    style={{ marginLeft: "10px" }}
                    size="small"
                    className="hotpackToggle"
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <HotPackProductionSummaryCard
                {...data}
                assetId={assetId}
                refreshService={fetch}
                manualStatus={manualStatus}
                runningStatus={data?.color}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card bordered={false}>
                    <Statistic
                      title="Shift Name"
                      value={
                        data?.shiftAllocation?.shiftName
                          ? data?.shiftAllocation?.shiftName
                          : "-"
                      }
                      valueStyle={{
                        color: "#3f8600",
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Card bordered={false}>
                    <Statistic
                      title="Start Time"
                      value={
                        data?.shiftAllocation?.endDate
                          ? moment(data?.shiftAllocation?.startDate).format(
                              "hh:mma"
                            )
                          : "-"
                      }
                      valueStyle={{
                        color: "#3f8600",
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Card bordered={false}>
                    <Statistic
                      title="End Time"
                      value={
                        data?.shiftAllocation?.endDate
                          ? moment(data?.shiftAllocation?.endDate).format(
                              "hh:mma"
                            )
                          : "-"
                      }
                      valueStyle={{
                        color: "#3f8600",
                      }}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <HotPackDowntimeCard
                {...data?.shiftAllocation}
                mode={2}
                assetId={assetId}
              />
            </Col>
          </Row>
        </Spin>
      </Page>
    </OeeDashboardContext.Provider>
  );
}

export default withRouter(withForm(HotPackMachineDetailDashboard));
