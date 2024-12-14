import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tooltip,
  TreeSelect,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import AreaChart from "../../../component/AreaChart";

import moment from "moment";
import { useLocation, useSearchParams } from "react-router-dom";

// import BarChart from "../../component/BarChart";
import ReactApexChart from "react-apexcharts";

import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";

import { useParams } from "react-router-dom";
import LiveChart from "../../../component/LiveChart";
import AssetService from "../../../services/asset-service";
import OeeCalculationService from "../../../services/oee-calculation-service";
import AvailabilityCalculationService from "../../../services/oee/availability-calculation-service";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import MachineStatusService from "../../../services/oee/machine-status-service";
import ModelWisePartCountService from "../../../services/oee/modelwise-partcount-service";
import QualityRejectionService from "../../../services/oee/quality-rejection-service";
import { withRouter } from "../../../utils/with-router";
import { ChartWidget } from "../../dynamic-dashboard/widgets/chart-widget";
import DownTimeAddList from "../downtime-configuration/downtime-list";
import QualityRejectionForm from "../quality-rejection/quality-rejection-form";
import OeeProgress from "./oee-progress";

function MachineDetailDashboard(props) {
  const params = useParams();
  const onSearch = (value) => {};
  const { Option } = Select;
  const [state, setState] = useState({
    title: props?.title,
    open: props?.open,
    isLoading: false,
    asset: [],
    modelName: [],
    selectedHierarchy: null,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedAsset = queryParams.get("selectedAsset");
  const selectedOrganization = queryParams.get("selectedOrganization");
  const oeeCalculationId = queryParams.get("oeeCalculationId");
  const [defaultSelectedOrganization, setDefaultSelectedOrganization] =
    useState(0);
  const [defaultSelectedAsset, setDefaultSelectedAsset] = useState("");
  const [appHierarchy, setAppHierarchy] = useState([]);
  const [shiftName, setShiftName] = useState("");
  const [currentModel, setCurrentModel] = useState("");
  const [shiftAllocationId, setShiftAllocationId] = useState("");
  const [parentTreeList, setParentTreeList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [searchParams] = useSearchParams();
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [totalPartCount, setTotalPartCount] = useState(0);
  const [acceptedPartCount, setAcceptedPartCount] = useState(0);
  const [rejectedPartCount, setRejectedPartCount] = useState(0);
  const [oee, setOee] = useState(0);
  const [availability, setAvailability] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [quality, setQuality] = useState(0);
  const [runTime, setRuntime] = useState(0);
  const [downtime, setDowntime] = useState(0);
  //const [selectedOrganization, setSelectedOrganization] = useState("");
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [defaultOEEData, setdefaultOEEData] = useState(0);
  const [defaultProductiontrend, setdefaultProductiontrend] = useState(0);
  const [counterValueData, setCounterValueData] = useState([]);
  const [assetId, setassetId] = useState(0);
  const [startDate, setstartDate] = useState("");
  const [runTimePercentage, setRuntimePercentage] = useState(0);
  const [downTimePercentage, setdowntimePercentage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Running");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const [machineStatus, setMachineStatus] = useState([]);
  const [isDownStatus, setIsDownStatus] = useState(false);
  const [data, setData] = useState([]);
  const [machineDetails, setMachineDetails] = useState([]);
  const [splitTimes, setSplitTimes] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [oeeId, setOeeId] = useState("");
  const [runTimepie, setRunTimepie] = useState("");
  const [downTimepie, setDownTimepie] = useState("");
  const [downtimeReason, setDowntimeReason] = useState("");
  const [colourCodes, setColourCodes] = useState("");
  const [asset, setAsset] = useState([]);
  const [assetData, setAssetData] = useState(null);
  const [Loading, setLoading] = useState(true);

  const [yourModelWiseProductionData, setYourModelWiseProductionData] =
    useState([]);
  const [endDate, setendDate] = useState("");

  const customStyles = {
    buttonMargin: {
      marginLeft: "-180px",
    },

    cardContent: {
      position: "absolute",
      top: "5px",
      left: "5px",
    },
  };

  const [qualityPopup, setQualityPopup] = useState({
    open: false,
    title: "Quality Rejection",
  });
  const [downtimePopup, setDowntimePopup] = useState({
    open: false,
    title: "Downtime Reason",
  });
  const qualityPop = () => {
    setQualityPopup({
      ...qualityPopup,
      open: true,
      shiftAllocationId: shiftAllocationId,
    });
  };
  const qualityOnClose = (rejectedQuantity) => {
    setLoading(true);
    setQualityPopup({
      ...qualityPopup,
      open: false,
    });

    const newAcceptedPartCount = acceptedPartCount - rejectedQuantity;
    const newRejectedPartCount = rejectedPartCount + rejectedQuantity;
    setAcceptedPartCount(newAcceptedPartCount);
    setRejectedPartCount(newRejectedPartCount);
    const newTotalPartCount = totalPartCount - rejectedQuantity;
    setTotalPartCount(newTotalPartCount);
    oeeCalculationService
      .retrieve(oeeCalculationId)
      .then((response) => {
        const assetData = response.data;

        setTotalPartCount(assetData.totalPartCount);
        setdefaultProductiontrend(assetData.totalPartCount);
        setAcceptedPartCount(assetData.acceptedPartCount);
        setRejectedPartCount(assetData.rejectedPartCount);
      })
      .finally(() => {
        setLoading(false);
      });
    // fetchProductionSummaryData();
  };
  const downtimePop = () => {
    setDowntimePopup({
      ...downtimePopup,
      open: true,
    });
  };

  useEffect(() => {
    if (data?.length) {
      for (const item of data) {
        if (!item.running) {
          setIsDownStatus(true);
          break;
        } else {
          setIsDownStatus(false);
        }
      }
    }
  }, [data]);

  const downtimeOnClose = () => {
    setDowntimePopup({
      ...downtimePopup,
      open: false,
    });
    fetchMachineStatus();
  };
  const onSubmit = (value) => {
    oeeCalculationService
      .getbyahIdassetId(value.ahName, value.assetId)
      .then(({ data }) => {
        setState((state) => ({ ...state, assets: data }));
        setOee(data[0].oee);
        setAvailability(data[0].availability);
        setPerformance(data[0].performance);
        setQuality(data[0].quality);
        setdefaultOEEData(data[0].defaultOEEData);
        setassetId(data[0].assetId);
        setstartDate(data[0].shiftAllocation.startDate);
        setendDate(data[0].shiftAllocation.endDate);
        setTotalPartCount(data[0].totalPartCount);
        setdefaultProductiontrend(data[0].totalPartCount);
        setAcceptedPartCount(data[0].acceptedPartCount);
        setRejectedPartCount(data[0].rejectedPartCount);
        setRuntime(data[0].runTime);
        setYourModelWiseProductionData(data[0].yourModelWiseProductionData);
        setShiftName(data[0].shiftAllocation.shiftName);
        setCurrentModel(data[0].currentModel);
      })
      .catch((e) => {
        setState((state) => ({ ...state, assets: [] }));
        setAvailability(0);
        setOee(0);
        setPerformance(0);
        setdefaultOEEData(0);
        setQuality(0);
        setassetId(0);
        setstartDate(0);
        setendDate(0);
        setTotalPartCount(0);
        setdefaultProductiontrend(0);
        setAcceptedPartCount(0);
        setRejectedPartCount(0);
        setRuntime(0);
        setYourModelWiseProductionData(0);
        setShiftName(0);
        setCurrentModel(0);
      });
  };

  const service = new AppHierarchyService();
  const qualityrejectionservice = new QualityRejectionService();
  const oeeCalculationService = new OeeCalculationService();
  const assetService = new AssetService();
  const availabilityCalculation = new AvailabilityCalculationService();
  const modelwisepartcountservice = new ModelWisePartCountService();
  const machinestatusservice = new MachineStatusService();
  const downtimeservice = new DowntimeReasonService();
  const downtimeReasondata = new DowntimeReasonService();

  const updateProgress = () => {
    const currentTime = new Date();
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    const formattedStartTime = moment(startTime).format("DD-MM-YYYY HH:mm");
    const TimeStart = moment(formattedStartTime).format("HH:mm");
    setFormattedStartTime(formattedStartTime);
    const formattedEndTime = moment(endTime).format("DD-MM-YYYY HH:mm");
    setFormattedEndTime(formattedEndTime);

    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;
    const calculatedProgress = ((elapsedTime / totalTime) * 100).toFixed(2);

    setStartTime(formattedStartTime);
    setEndTime(formattedEndTime);
    const interval = totalTime / 5;
    const splitTimesArray = [];
    for (let i = 0; i < 5; i++) {
      const splitTime = new Date(startTime.getTime() + interval * (i + 1));
      splitTimesArray.push(splitTime);
    }
    setSplitTimes(splitTimesArray);
  };

  useEffect(() => {
    updateProgress();
    const intervalId = setInterval(updateProgress, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [startDate, endDate]);

  useEffect(() => {
    downtimeReasondata
      .list({ active: true })
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          const dataNull = response.data.filter((e) => e.parentId === null);

          const colourCodes = dataNull.map((reason) => reason.colourCode);
          setColourCodes(colourCodes);

          const downtimeReason = dataNull.map(
            (reason) => reason.downtimeReason
          );
          setDowntimeReason(downtimeReason);

          setState((prevState) => ({
            ...prevState,
            downtimeReason: response.data,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching downtime reasons:", error);
      });
  }, []);

  useEffect(() => {
    const assetId = props?.searchParams?.get("assetId");
    const ahId = props?.searchParams?.get("ahId");

    if (assetId) {
      props?.form?.setFieldValue("assetId");
    }
    if (ahId) {
      props?.form?.setFieldValue("ahName");
    }
  }, [props]);

  useEffect(() => {
    setDefaultSelectedOrganization(selectedOrganization);
    setDefaultSelectedAsset("Machine One");
  }, [selectedAsset, selectedOrganization]);

  // This useEffect runs only once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await service.list();
        setState((prevState) => ({
          ...prevState,
          parentTreeList: service.convertToSelectTree(response.data),
        }));
      } catch (error) {
        console.error("Failed to fetch app hierarchy:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAssetList = async () => {
      try {
        const response = await assetService.list({ active: true });
        setState((prevState) => ({ ...prevState, asset: response.data }));
      } catch (error) {
        console.error("Failed to fetch asset list:", error);
      }
    };

    fetchAssetList();

    const shiftAllocationId = queryParams.get("shiftAllocationId");
    setShiftAllocationId(shiftAllocationId);

    const loadAsset = async () => {
      const ahId = props?.form.getFieldValue("ahid");
      try {
        const { data } = await assetService.list({ aHId: ahId });

        setState((prevState) => ({
          ...prevState,
          asset: data,
        }));

        if (data.length === 0) {
          props.form.setFieldValue("asset", data);
        }
        // console.log("ahid", data);
      } catch (error) {
        console.error("Failed to load asset:", error);
      }
    };

    loadAsset();
  }, []);

  const setColor = (status, color) => {
    if (color) {
      return color;
    } else {
      if (status == "Running") {
        return "#30fc03";
      } else {
        return "#fc2c03";
      }
    }
  };

  const fetchMachineStatus = async () => {
    setLoading(true);
    try {
      if (shiftAllocationId && startDate && endDate && assetId) {
        const response = await machinestatusservice.getMachineStatus(
          startDate,
          endDate,
          assetId
        );

        const { shiftStartDate, shiftEndDate, machineStatusList } =
          response.data;

        let shiftstart = new Date(shiftStartDate).getTime();
        let shiftend = new Date(shiftEndDate).getTime();
        let arr = [];
        let duration = 0;

        machineStatusList?.forEach((e) => {
          const endTime = e.endTime
            ? new Date(e.endTime).getTime()
            : new Date().getTime();

          duration = duration + (endTime - new Date(e.startTime).getTime());

          arr.push({
            duration: endTime - new Date(e.startTime).getTime(),
            start: e.startTime,
            end: e.endTime,
            status: e.status,
            running: e.running,
            percent: Number(
              ((endTime - new Date(e.startTime).getTime()) /
                (shiftend - shiftstart)) *
                100
            ).toFixed(1),
            fillColor: setColor(e.status, e.color),
          });
        });

        setProgress(arr[arr.length - 1].percent);
        setMachineStatus((prevMachineStatus) => [...arr]);
        setData(response.data);

        const statusData = response.data.machineStatusList.map((statusList) => (
          <div key={statusList.machineStatusId}>{statusList.status}</div>
        ));
        setMachineDetails(statusData);
      }
    } catch (error) {
      console.error("Error fetching machine status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductionSummaryData = () => {
    oeeCalculationService.retrieve(oeeCalculationId).then((response) => {
      const assetData = response.data;
      setOee(assetData.oee);
      setdefaultOEEData(assetData.oee);
      setAvailability(assetData.availability);
      setPerformance(assetData.performance);
      setQuality(assetData.quality);
      setShiftName(assetData.shiftAllocation.shiftName);
      setCurrentModel(assetData.currentModel);
      setTotalPartCount(assetData.totalPartCount);
      setdefaultProductiontrend(assetData.totalPartCount);
      setAcceptedPartCount(assetData.acceptedPartCount);
      setRejectedPartCount(assetData.rejectedPartCount);
      setOeeId(assetData.oeeCalculationId);
      setassetId(assetData.shiftAllocation.assetId);
      setstartDate(assetData.shiftAllocation.startDate);
      setendDate(assetData.shiftAllocation.endDate);
      // setTotalPartCount(assetData.totalPartCount);
      // setdefaultProductiontrend(assetData.totalPartCount);
      // setAcceptedPartCount(assetData.acceptedPartCount);
      // setRejectedPartCount(assetData.rejectedPartCount);
      setRunTimepie(assetData.runTime);
      setDownTimepie(assetData.downTime);
    });

    if (assetId != null && startDate != null && endDate != null) {
      modelwisepartcountservice
        .getModelWisePartCount(assetId, startDate, endDate)
        .then((response) => {
          const dynamicData = response.data;
          setFormattedData(
            dynamicData.map((item) => ({
              programName: item.programName,
              counterValue: item.totalPartProduced,
            }))
          );
          setYourModelWiseProductionData(formattedData);
        })

        .catch((error) => {});
    }
  };
  const fetchData = async () => {
    //await fetchAssetData();
    await fetchProductionSummaryData();
    await fetchMachineStatus();
  };

  useEffect(() => {
    fetchData();

    const refreshIntervalId = setInterval(fetchProductionSummaryData, 10000);

    return () => {
      clearInterval(refreshIntervalId);
    };
  }, [shiftAllocationId, startDate, endDate, assetId]);

  const getAppHierarchyList = () => {
    setIsParentLoading(true);

    service
      .list()
      .then(({ data }) => {
        setParentTreeList(service.convertToSelectTree(data));
        if (parentTreeList.length > 0) {
          props.form?.setFieldValue("ahName", parentTreeList[0]?.value);
        }
      })
      .finally(() => {
        setIsParentLoading(false);
      });
  };

  const setFields = () => {
    const orgName = state.selectedHierarchy;

    return orgName;
  };

  const setHierarchyName = (value) => {
    // setHierarchyName(selectedHierarchy);
    // setSelectedOrganization(value);
    assetService
      .list({
        aHId: value,
      })
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          asset: response.data,
        }));
      });
  };
  const handleAssetChange = (assetId) => {
    // handleAssetChange(selectedAsset);
    const selectedAsset = state.asset.find(
      (asset) => asset.assetId === assetId
    );

    if (selectedAsset && selectedAsset.appHierarchy) {
      const selectedHierarchy = selectedAsset.appHierarchy;
      setState({
        selectedHierarchy: {
          title: selectedHierarchy.ahname,
          value: selectedHierarchy.ahid,
          key: selectedHierarchy.ahid,
          selectable: false,
        },
      });
      props.form.setFieldsValue({
        ahid: selectedHierarchy.ahid,
      });
    } else {
      setState({
        selectedHierarchy: null,
      });
      props.form.setFieldsValue({
        ahid: undefined,
      });
    }
  };
  const handleGoButtonClick = () => {
    const ahId = state.selectedOrganization;
    const assetId = state.selectedAsset;

    oeeCalculationService
      .getbyahIdassetId(ahId, assetId)
      .then(({ data }) => {});
  };

  useEffect(() => {
    const percentage = (runTime / availability) * 100;
    setRuntimePercentage(availability);
    const dowtimepercent = 100 - availability;
    setdowntimePercentage(dowtimepercent);
    service.list({ active: true }).then((response) => {
      setAppHierarchy(response.data);
    });

    getAppHierarchyList();
    service
      .list({
        active: true,
      })
      .then((response) => {
        setAppHierarchy(response.data);
      });
    getAppHierarchyList();
  }, [availability, runTime]);

  return (
    <Spin spinning={Loading}>
      {qualityPopup.open && (
        <QualityRejectionForm
          {...qualityPopup}
          close={qualityOnClose}
          shiftAllocationId={shiftAllocationId}
        />
      )}
      {downtimePopup.open && (
        <Modal
          {...downtimePopup}
          onCancel={downtimeOnClose}
          width="800px"
          height="400px"
        >
          <DownTimeAddList
            // {...downtimePopup}
            startTime={startDate}
            endTime={endDate}
            assetId={assetId}
            // close={downtimeOnClose}
          />
        </Modal>
      )}
      <Form onFinish={onSubmit}>
        <div
          style={{
            display: "flex",

            flexDirection: "row",

            justifyContent: "left",
          }}
        >
          <Form.Item
            name="ahName"
            initialValue={props.searchParams.get("ahId")}
          >
            <TreeSelect
              style={{ width: "150px" }}
              placeholder="Organization"
              treeDefaultExpandAll={false}
              treeData={parentTreeList}
              onChange={(value) => {
                props.form.setFieldsValue({ ahName: value });
              }}
            ></TreeSelect>
          </Form.Item>

          <Form.Item
            name="assetId"
            initialValue={props.searchParams.get("assetId")}
            rules={[{ required: true, message: "Please select the asset!" }]}
          >
            <Select
              style={{
                width: "150px",
                marginLeft: "5px",
              }}
              placeholder="Asset"
              optionFilterProp="children"
              onChange={handleAssetChange}
              onSearch={onSearch}
            >
              {state.asset?.map((e) => (
                <Option key={`asset${e.assetId}`} value={e.assetName}>
                  {e.assetName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={handleGoButtonClick}
            style={{ marginLeft: "5px" }}
          >
            Go
          </Button>
          <div style={{ marginLeft: "32%", span: "5px" }}>
            <strong>Shift: </strong>
            {shiftName}
          </div>
          <div style={{ marginLeft: "40px", span: "5px" }}>
            {" "}
            <Space>
              <strong>Model: </strong>
              {currentModel}
            </Space>
          </div>
        </div>
      </Form>

      <Row gutter={[10, 10]}>
        <Col xs={24} sm={24} md={8} lg={10}>
          <Card size="default">
            <Typography.Title level={5}>
              Overall Equipment Efficiency
            </Typography.Title>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Space size={20} style={{ alignItems: "baseline" }}>
                <OeeProgress value={oee} title="OEE" />
                <strong>=</strong>
                <OeeProgress value={availability} title="A" />
                <strong>x</strong>
                <OeeProgress value={performance} title="P" />
                <strong>x</strong>
                <OeeProgress value={quality} title="Q" />
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8} lg={6}>
          <Card style={{ minHeight: "170px", position: "relative" }}>
            <Typography.Title level={5}>Production Summary</Typography.Title>
            <Tooltip title="Quality Rejection">
              <Button
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "14px",
                  height: "40px",
                }}
                onClick={qualityPop}
              >
                QR
              </Button>
            </Tooltip>
            <Space split={<Divider type="vertical" />}>
              <div
                style={{
                  gap: "10px",
                  position: "relative",
                  top: "10px",
                }}
              >
                <Statistic
                  title="Total"
                  valueStyle={{ textAlign: "center" }}
                  value={totalPartCount}
                />
              </div>
              <div
                style={{
                  gap: "10px",
                  position: "relative",
                  top: "10px",
                }}
              >
                <Statistic
                  title="Accepted"
                  valueStyle={{ textAlign: "center" }}
                  value={acceptedPartCount}
                />
              </div>
              <div
                style={{
                  gap: "10px",
                  position: "relative",
                  top: "10px",
                }}
              >
                <Statistic
                  title="Rejected"
                  valueStyle={{ textAlign: "center" }}
                  value={rejectedPartCount}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Card
            size="default"
            style={{ height: "170px", position: "relative" }}
          >
            <Typography.Title level={5} style={{ marginBottom: "15px" }}>
              Availability
            </Typography.Title>
            <div style={{ width: "75%", marginLeft: "5%" }}>
              <ChartWidget
                type="pie"
                properties={{
                  data: [
                    { label: "Runtime", value: runTimepie },
                    { label: "Downtime", value: downTimepie },
                  ],
                  colors: ["green", "red"],
                }}
                style={{ width: "100%" }}
              />
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ minHeight: "150px" }}>
            <Typography.Title level={5}>Machine Status</Typography.Title>
            <div
              style={{
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Space>
                <Space>
                  <span
                    style={{
                      color: "#13EF10",
                      fontSize: "24px",
                      marginBottom: "5px",
                    }}
                  >
                    ●
                  </span>

                  <span style={{ fontSize: "11px" }}>Running</span>
                  <span style={{ color: "#E42F0A", fontSize: "24px" }}>●</span>
                  <span style={{ fontSize: "11px" }}>Downtime</span>

                  {downtimeReason &&
                    downtimeReason?.map((item, index) => (
                      <>
                        <span
                          style={{
                            color: colourCodes[index],
                            fontSize: "24px",
                            marginBottom: "5px",
                          }}
                        >
                          ●
                        </span>
                        <span style={{ fontSize: "10px" }}>{item}</span>
                      </>
                    ))}
                </Space>
              </Space>
              <br />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>{startTime}</p>
                <p>{endTime}</p>
              </div>
              <div className="bar">
                {machineStatus?.map((e, i) => (
                  <Tooltip
                    title={`${Math.round(e.duration / 60000)} mins`}
                    key={i}
                  >
                    <div
                      className="progress"
                      style={{
                        width: e.percent + "%",
                        backgroundColor: e.fillColor,
                      }}
                      onClick={downtimePop}
                    ></div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            style={{
              height: "300px",
            }}
          >
            <Typography.Title level={5}>OEE</Typography.Title>
            <LiveChart
              height={200}
              data={defaultOEEData}
              Id={oeeId}
              started={formattedStartTime}
              ended={formattedEndTime}
              parameter={1}
              id={1}
            ></LiveChart>
            {/* <p>{formattedStartTime}</p> */}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <Typography.Title level={5}>Production Trends</Typography.Title>
            <AreaChart
              height={150}
              data={defaultProductiontrend}
              Id={oeeId}
              started={formattedStartTime}
              ended={formattedEndTime}
              parameter={2}
              id={2}
            ></AreaChart>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <Typography.Title level={5}>Modelwise Production</Typography.Title>
            <ReactApexChart
              options={{
                chart: {
                  type: "bar",
                  height: 350,
                },
                plotOptions: {
                  bar: {
                    colors: {
                      ranges: [
                        {
                          from: 0,
                          to: 10000,
                          color: "rgba(0, 227, 150, 0.85)",
                        },
                      ],
                    },
                  },
                },
                xaxis: {
                  categories: formattedData.map((data) => data.programName),
                  labels: {
                    rotate: -45,
                    trim: true,
                    maxHeight: 50,
                  },
                },
                yaxis: {
                  type: "numeric",
                  title: {
                    text: "Part Count",
                  },
                },
                tooltip: {
                  enabled: true,
                  y: {
                    formatter: function (val) {
                      return val + ""; // Format y-axis tooltip value if needed
                    },
                  },
                  x: {
                    formatter: function (val) {
                      const programName = formattedData.find(
                        (data) => data.programName === val
                      )?.programName;
                      return programName || val; // Show full program name as tooltip
                    },
                  },
                },
              }}
              series={[
                {
                  data: formattedData.map((data) => data.counterValue),
                },
              ]}
              type="bar"
              height={200}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}

export default withRouter(MachineDetailDashboard);
