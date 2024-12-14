import { Card, Col, Empty, Form, Row, Space, Spin, TreeSelect } from "antd";
import React, { useEffect, useMemo, useState } from "react";
// import BarChart from "../../component/BarChart";
import { useSearchParams } from "react-router-dom";
import OeeCalculationService from "../../../services/oee-calculation-service";
import { withRouter } from "../../../utils/with-router";
import AvailabilityCard from "./availability-card";
import DowntimeCard from "./downtime-card";
import LossCard from "./loss-card";
import ModelwisePartCount from "./modelwise-part-count";
import OeeCard from "./oee-card";
import { OeeDashboardContext } from "./oee-dashboard-context";
import ProductionSummaryCard from "./production-summary-card";
import Trends from "./trends";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import Page from "../../../utils/page/page";
import { active } from "d3";

function MachineDetailDashboard(props) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [reloadDowntime, setReloadDowntime] = useState(0);
  // const assetId = Number(searchParams.get("assetId"));
  const ahIdParam = Number(searchParams.get("ahId"));
  const assetIdParam = Number(searchParams.get("assetId"));
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [isMachineParentLoading, setIsMachineParentLoading] = useState(false);
  const [parentTreeList, setParentTreeList] = useState([]);
  const [machineParentTreeList, setMachineParentTreeList] = useState([]);
  const [assetId, setAssetId] = useState(null);
  const [ahId, setAhId] = useState(null);
  const { hideFilter } = props;
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prevIsLive) => !prevIsLive);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const fetch = ({ assetId }) => {
    console.log("assetId", assetId);
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
  useEffect(() => {
    setAssetId(assetIdParam);
  }, [assetIdParam]);
  useEffect(() => {
    getAppHierarchyList();
  }, []);
  useEffect(() => {
    if (ahId) {
      getMachine();
    }
  }, [ahId]);

  useMemo(() => {
    if (assetId) fetch({ assetId });
  }, [assetId]);
  const apphierarchyService = new AppHierarchyService();
  const assetService = new AssetService();

  const getAppHierarchyList = () => {
    setIsParentLoading(true);

    apphierarchyService
      .list()
      .then(({ data }) => {
        const parentTreeList = apphierarchyService.convertToSelectTree(data);
        setParentTreeList(parentTreeList);

        let defaultOrganization;
        // Set the default value if needed
        if (ahIdParam) {
          defaultOrganization = ahIdParam;
        } else {
          defaultOrganization = parentTreeList[0]?.value;
        }
        props.form?.setFieldValue("aHId", defaultOrganization);
        setHierarchyName(defaultOrganization);
        // Resolve the promise when the state is updated
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

        // Set the default value if needed
        // const defaultAsset = machineParentTreeList[0]?.value;
        let defaultAsset;
        // Set the default value if needed
        if (assetIdParam && ahIdParam === ahId) {
          defaultAsset = assetIdParam;
        } else {
          defaultAsset = machineParentTreeList[0]?.value;
        }
        props.form?.setFieldValue("assetId", defaultAsset);
        setAssetId(defaultAsset);
        // Resolve the promise when the state is updated
        return Promise.resolve();
      })
      .finally(() => {
        setIsMachineParentLoading(false);
      });
  };

  const setHierarchyName = (value) => {
    setAhId(value);
  };
  // console.log(props, "props");
  // console.log(props.hideFilter, "filter");

  return (
    <OeeDashboardContext.Provider value={{ reloadDowntime, setReloadDowntime }}>
      <Page title={!hideFilter && "Machine Details Dashboard"}>
        <Spin spinning={loading}>
          <Row justify="space-between">
            {!hideFilter && (
              <>
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

                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: isLive ? "green" : "green",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span>{isLive ? "Live" : "Live"}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#263238",
                    }}
                  >
                    Current Model:{" "}
                    {data && data.currentModel ? data.currentModel : "-"}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#263238",
                    }}
                  >
                    CycleTime: {data && data.cycleTime ? data.cycleTime : "-"}
                  </span>
                </Col>
              </>
            )}
          </Row>
          <Row gutter={[10, 10]}>
            {assetId ? (
              <>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <OeeCard {...data} />
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <ProductionSummaryCard
                    {...data}
                    assetId={assetId}
                    refreshService={fetch}
                  />
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <AvailabilityCard {...data} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <DowntimeCard {...data?.shiftAllocation} mode={2} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <LossCard {...data?.shiftAllocation} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <ModelwisePartCount {...data?.shiftAllocation} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={24}>
                  <Trends {...data?.shiftAllocation} />
                </Col>
              </>
            ) : (
              <Col xs={24} sm={24} md={24}>
                <Card>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </Card>
              </Col>
            )}
          </Row>
        </Spin>
      </Page>
    </OeeDashboardContext.Provider>
  );
}

export default withRouter(withForm(MachineDetailDashboard));
