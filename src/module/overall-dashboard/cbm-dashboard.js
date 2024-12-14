import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  FallOutlined,
  MinusCircleFilled,
  RiseOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Modal, Progress, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
// import AlertReportService from "../../../services/alert-report-cbm-services";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import LiveChartCBM from "../../component/LiveChart-cbm";
import AssetParametersValueService from "../../services/asset-parameter- value-service";
import AssetService from "../../services/asset-service";
import Page from "../../utils/page/page";
const CbmDashboard = () => {
  const reduxSelectedAhId = useSelector(
    (state) => state.mainDashboardReducer.selectedAhId
  );
  const reduxSelectedAssetId = useSelector(
    (state) => state.mainDashboardReducer.selectedAssetId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [intr, setIntr] = useState(null);
  const [parameterValue, setParameterValue] = useState({});
  const [parameters, setParameters] = useState({ loading: false, data: [] });
  const [filtered, setFiltered] = useState([]);
  const [assetName, setAssetName] = useState(null);
  const [assets, setAssets] = useState({ loading: false, options: [] });
  const [ahid, setAhid] = useState({
    loading: false,
    parentTreeData: [],
    selected: null,
  });
  const [finalCount, setFinalCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [SelectedParameterName, setSelectedParameterName] = useState(null);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [displayNameCounts, setDisplayNameCounts] = useState({});
  const [timeIntervalId, setTimeIntervalId] = useState(null);
  const fetchParameter = (id) => {
    const service = new AssetService();
    // const alertreportService = new AlertReportService();
    const displayNameCountMapping = {};
    setParameters((state) => ({ ...state, loading: true }));

    service
      .retrieve(id)
      .then(({ data }) => {
        let dataTypes = new Set(data.assetParameters.map((e) => e.dataType));
        let parameters = data.assetParameters.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );

        setAssetName(data.assetName);
        setParameters((state) => ({ ...state, data: parameters }));
        setFiltered(parameters);

        // return alertreportService.getAlertReport(id, "");
      })
      .then((response) => {
        const sourceProperties = response.data.rows.map(
          (alert) => alert.sourceProperty
        );

        const sourcePropertyCount = sourceProperties.reduce((acc, property) => {
          acc[property] = (acc[property] || 0) + 1;

          // Dynamically check and display count for matching displayName and property

          return acc;
        }, {});

        // console.log("Source Property Counts:", sourcePropertyCount);
        setDisplayNameCounts(sourcePropertyCount);

        const lastProperty = Object.keys(sourcePropertyCount).pop();
        const count = sourcePropertyCount[lastProperty] || 0;
        setFinalCount(count);
        // console.log(`Final count for ${lastProperty}: ${finalCount}`);
      })

      .catch((error) => {
        console.error("Error fetching parameters", error);
      })
      .finally(() => {
        setParameters((state) => ({ ...state, loading: false }));
      });
  };
  function getValueByKey(displayName) {
    let lowerCaseKeys = Object.keys(displayNameCounts).map((key) =>
      key.toLowerCase()
    );
    let lowerCaseDisplayName = displayName.toLowerCase();

    let index = lowerCaseKeys.indexOf(lowerCaseDisplayName);
    if (index !== -1) {
      // console.log(
      //   "fetchVal",
      //   displayNameCounts[Object.keys(displayNameCounts)[index]]
      // );
      return displayNameCounts[Object.keys(displayNameCounts)[index]];
    } else {
      return "0";
    }
  }
  const getDisplayName = (displayName) => {
    return displayName.toUpperCase(); // Replace with your logic
  };
  const handleCardClick = (cardData) => {
    setSelectedCardData(null);
    setSelectedCardData(
      getValue(cardData?.parameterName, cardData?.dataType)
        .replace("String{'", "")
        .replace("'}", "")
    );
    const parameterName = cardData?.parameterName || "";
    setSelectedParameterName(parameterName);
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const getValue = (name, type) => {
    let value = parameterValue[name] ? parameterValue[name].value : "";
    value = isNaN(value) ? 0 : value;
    return new String(value);
  };
  const fetchValue = () => {
    // if (assetName) {
    const service = new AssetParametersValueService();
    service.getParameterValue(reduxSelectedAssetId).then(({ data }) => {
      // let value = {};
      // for (let x of data) {
      //   value[x.name] = x;
      // }
      const parameterData = {};

      data.forEach((item) => {
        parameterData[item.parameterName] = {
          value: item.value,
          quality: item.quality,
          time: item.time,
        };
      });
      // console.log("value", data);

      // setParameterValue(parameterData);
      // handleLiveData(parameterData);
    });
    // }
  };

  const renderUIComponent = (
    dataType,
    parameterName,
    assetWidgets,
    chartType,
    displayName,
    unit,

    value,
    // sourcePropertyCount,
    assetDisplayValue,
    paramName
  ) => {
    const cardStyle = {
      height: "200px",
    };

    const truncate = (str, n) => {
      if (!str) return "";

      return str.length > n ? `${str.substr(0, n - 1)}...` : str;
    };
    const displayNameKeys = Object.keys(displayNameCounts);

    const truncatedDisplayName = truncate(displayName, 12);
    const truncateValue1 = truncate(value, 6);

    const finalCount = displayNameCounts[displayName] || null;
    const chartValue = { dataType: dataType, parameterName: paramName };
    const truncateValue = isNaN(truncateValue1) ? 0 : truncateValue1;
    switch (dataType) {
      case "NUMBER":
        const gaugeValue = parseFloat(
          Array.isArray(value) ? value[0].vocabulary : value
        );
        let formattedValue;
        if (Number.isInteger(gaugeValue)) {
          formattedValue = gaugeValue.toFixed(0);
        } else {
          formattedValue = gaugeValue.toFixed(3);
        }
        if (formattedValue.length > 6) {
          formattedValue = formattedValue.slice(0, 6);
        }
        // console.log(formattedValue, "page");
        formattedValue = isNaN(formattedValue) ? 0 : formattedValue;

        const widgetType = assetWidgets?.widgetType;
        const gaugeType = assetWidgets?.gaugeProperties?.type;
        const min = assetWidgets?.gaugeProperties?.min;
        const max = assetWidgets?.gaugeProperties?.max;

        switch (widgetType) {
          case "Gauge":
            if (gaugeType === "semicircle") {
              return (
                <>
                  <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col flex={2}>
                      <h4
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "8px",
                        }}
                      >
                        {truncatedDisplayName}
                      </h4>
                    </Col>
                    <Col>
                      <Row align="middle">
                        <Col>
                          <Button
                            onClick={() => handleCardClick(chartValue)}
                            style={realtimePopStyle}
                            size="small"
                          >
                            <img src="/vector.svg" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row span={24} justify="center">
                    <ReactSpeedometer
                      width={200}
                      height={130}
                      ringWidth={25}
                      minValue={min}
                      maxValue={max}
                      needleHeightRatio={0.5}
                      value={formattedValue}
                    />
                  </Row>
                </>
              );
            } else if (gaugeType === "radial") {
              return (
                <>
                  <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col flex={2}>
                      <h4
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "8px",
                        }}
                      >
                        {truncatedDisplayName}
                      </h4>
                    </Col>
                    <Col>
                      <Row align="middle">
                        <Col>
                          <Button
                            onClick={() => handleCardClick(chartValue)}
                            style={realtimePopStyle}
                            size="small"
                          >
                            <img src="/vector.svg" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16} align="middle">
                    <Col span={12}>
                      <h4 style={{ color: "lightgrey" }}>Value</h4>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong
                          style={{ fontSize: "25px", marginRight: "10px" }}
                        >
                          {formattedValue}
                        </strong>

                        <h4>{unit}</h4>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <CircularProgressbar
                          height=""
                          value={formattedValue}
                          text={`${formattedValue}%`}
                          styles={buildStyles({
                            strokeWidth: 5,
                            rotation: 0.15,
                            strokeLinecap: "butt",
                            textSize: "14px",
                            pathTransitionDuration: 0.2,
                            pathColor: `rgba(255, 99, 71, ${
                              formattedValue / 100
                            })`,
                            taril: "#d6d6d6",
                            textColor: "#f88",
                            trailColor: "#d6d6d6",
                          })}
                        />
                      </div>
                    </Col>
                  </Row>
                </>
              );
            }
            break;
          case "Temperature":
            const { temperatureProperties } = assetWidgets;
            const temperatureMin = temperatureProperties?.min || 0;
            const temperatureMax = temperatureProperties?.max || 100;

            return (
              <>
                <Row gutter={16} style={{ marginBottom: "16px" }}>
                  <Col flex={2}>
                    <h4
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: "8px",
                      }}
                    >
                      {truncatedDisplayName}
                    </h4>
                  </Col>
                  <Col>
                    <Row align="middle">
                      <Col>
                        <Button
                          onClick={() => handleCardClick(chartValue)}
                          style={realtimePopStyle}
                          size="small"
                        >
                          <img src="/vector.svg" />
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <h4 style={{ color: "lightgrey" }}>Value</h4>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <strong style={{ fontSize: "25px", marginRight: "10px" }}>
                        {formattedValue}
                      </strong>

                      <h4>{unit}</h4>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src="/thermo.svg" width={150} />
                    </div>
                  </Col>
                </Row>
              </>
            );

          case "Battery":
            return (
              <>
                <Row gutter={16} style={{ marginBottom: "16px" }}>
                  <Col flex={2}>
                    <h4
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: "8px",
                      }}
                    >
                      {truncatedDisplayName}
                    </h4>
                  </Col>
                  <Col>
                    <Row align="middle">
                      <Col>
                        <Button
                          onClick={() => handleCardClick(chartValue)}
                          style={realtimePopStyle}
                          size="small"
                        >
                          <img src="/vector.svg" />
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <h4 style={{ color: "lightgrey" }}>Value</h4>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <strong style={{ fontSize: "25px", marginRight: "10px" }}>
                        {formattedValue}
                      </strong>

                      <h4>{unit}</h4>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <img src="/61223.svg" width={150} />
                    </div>
                  </Col>
                </Row>
              </>
            );
          default:
            return (
              <>
                <Row gutter={16} style={{ marginBottom: "16px" }}>
                  <Col flex={2}>
                    <h4
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {truncatedDisplayName}
                    </h4>
                  </Col>
                  <Col>
                    <Row align="middle">
                      <Col>
                        <Button
                          onClick={() => handleCardClick(chartValue)}
                          style={realtimePopStyle}
                          size="small"
                        >
                          <img src="/vector.svg" />
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <h4 style={{ color: "lightgrey" }}>Value</h4>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <strong style={{ fontSize: "25px", marginRight: "10px" }}>
                        {formattedValue}
                      </strong>
                      <h4>{unit}</h4>
                    </div>
                    <p style={{ color: "red" }}>
                      <FallOutlined /> 1.5%(123)
                    </p>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src="/leaf.svg" width={100} />
                    </div>
                  </Col>
                </Row>
              </>
            );
        }
        break;

      case "BOOLEAN":
        // console.log(value, "value");

        const extractedValue = value.replace("String{'", "").replace("'}", ""); // Extracts 'false'

        const booleanValue = extractedValue.toLowerCase() === "true";
        // console.log("extractedValue:", extractedValue);

        const assetDisplayValueTrue = Array.isArray(assetDisplayValue)
          ? assetDisplayValue.find(
              (item) => item.value.toLowerCase() === "true"
            )
          : undefined;

        const assetDisplayValueFalse = Array.isArray(assetDisplayValue)
          ? assetDisplayValue.find(
              (item) => item.value.toLowerCase() === "false"
            )
          : undefined;

        const displayValue = booleanValue
          ? assetDisplayValueTrue
          : assetDisplayValueFalse;

        // console.log("displayValue:", displayValue);

        const color = booleanValue
          ? assetDisplayValueTrue
            ? assetDisplayValueTrue.colour
            : null
          : assetDisplayValueFalse
          ? assetDisplayValueFalse.colour
          : null;

        // console.log("color:", color, displayName);

        let iconComponent;
        let textColor;
        let borderColor;

        switch (color) {
          case "#ffcccc":
            borderColor = "#ff471a";
            iconComponent = (
              <MinusCircleFilled style={{ color: "red", fontSize: "40px" }} />
            );
            textColor = "black";
            break;
          case "#ccffcc":
            borderColor = "#33cc33";
            iconComponent = (
              <CheckCircleFilled style={{ color: "green", fontSize: "40px" }} />
            );
            textColor = "black";
            break;
          default:
            borderColor = "#fff";
            iconComponent = (
              <ExclamationCircleFilled
                style={{ color: "black", fontSize: "40px" }}
              />
            );
            textColor = "black";
            break;
        }

        return (
          <Card
            hoverable
            style={{
              minHeight: "20vh",
              backgroundColor: color || "lightgrey",
              border: `1px solid ${borderColor}`,
              color: textColor,
            }}
          >
            <div>
              <Row gutter={16} style={{ marginBottom: "8px" }}>
                <Col flex={2}>{iconComponent}</Col>
              </Row>
              <h2>{truncatedDisplayName}</h2>
              <h2>
                Status:{" "}
                <span>
                  {displayValue ? displayValue.displayValue : "No Status"}
                </span>
              </h2>
            </div>
          </Card>
        );

      case "STRING":
        return (
          <>
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col flex={2}>
                <h4
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "8px",
                  }}
                >
                  {truncatedDisplayName}
                </h4>
              </Col>
              <Col>
                <Row align="middle">
                  <Col>
                    <Button
                      onClick={() => handleCardClick(chartValue)}
                      style={realtimePopStyle}
                      size="small"
                    >
                      <img src="/vector.svg" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={24}>
                <h4 style={{ color: "lightgrey" }}>Value</h4>
                <div>
                  <p>
                    <strong style={{ fontSize: "25px" }}>
                      {truncateValue}
                    </strong>
                    <span style={{ float: "right", color: "green" }}>
                      <RiseOutlined /> 1.5%
                    </span>
                  </p>
                  <h4>{unit}</h4>
                </div>

                <div>
                  {" "}
                  <Progress percent={truncateValue} strokeColor="#7AFABC" />
                </div>
              </Col>
            </Row>
          </>
        );
      default:
        return (
          <>
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col flex={2}>
                <h4
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "8px",
                  }}
                >
                  {truncatedDisplayName}
                </h4>
              </Col>
              <Col>
                <Row align="middle">
                  <Col>
                    <Button
                      onClick={() => handleCardClick(chartValue)}
                      style={realtimePopStyle}
                      size="small"
                    >
                      <img src="/vector.svg" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <h4 style={{ color: "lightgrey" }}>Value</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong style={{ fontSize: "25px" }}>{truncateValue}</strong>

                  <h4>{unit}</h4>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src="/leaf.svg" width={100} />
                </div>
              </Col>
            </Row>
          </>
        );
    }
  };

  const numberData = filtered.filter((e) => {
    // console.log("Element e:", e);
    // Extracts 'false'
    return e.dataType === "NUMBER";
  });

  const stringData = filtered.filter((e) => e.dataType === "STRING");
  // const booleanData = filtered.filter((e) => e.dataType === "BOOLEAN");
  const booleanData = filtered.filter((e) => {
    // console.log("Element e:", e.assetDisplayValue?.value);
    return e.dataType === "BOOLEAN";
  });
  // console.log("Filtered Number Data:", booleanData);
  const otherData = filtered.filter(
    (e) => !["NUMBER", "STRING", "BOOLEAN"].includes(e.dataType)
  );
  const realtimePopStyle = {
    height: "20px",
    width: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  useEffect(() => {
    if (reduxSelectedAssetId) {
      fetchParameter(reduxSelectedAssetId);
    }
  }, [reduxSelectedAssetId]);

  useEffect(() => {
    if (assetName) {
      if (timeIntervalId) {
        clearInterval(timeIntervalId);
      }
      fetchValue();
      const newIntervalId = setInterval(() => {
        fetchValue();
      }, 6000);
      // console.log(newIntervalId, "response0");
      setTimeIntervalId(newIntervalId);
      return () => {
        clearInterval(newIntervalId);
      };
    }
  }, [assetName]);
  return (
    <Page>
      <Spin spinning={isLoading}>
        <Row style={{ marginTop: "20px" }} gutter={[10, 10]}>
          {numberData.map((e) => (
            <Col xs={24} sm={24} md={6} lg={6} key={e.parameterName}>
              <Card hoverable style={{ minHeight: "38vh" }}>
                {renderUIComponent(
                  e.dataType,
                  e.chartType,
                  e.assetWidgets,
                  e.type,
                  getDisplayName(e.displayName),
                  e.unit,
                  getValue(e.parameterName, e.dataType),
                  // e.min,
                  // e.max,
                  e.assetDisplayValue,
                  // e.sourcePropertyCount,
                  e.parameterName
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <Row style={{ marginTop: "20px" }} gutter={[10, 10]}>
          {booleanData.map((e) => (
            <Col xs={24} sm={24} md={6} lg={6} key={e.parameterName}>
              {/* <div onClick={() => handleCardClick(e)}> */}
              {renderUIComponent(
                e.dataType,
                e.chartType,
                e.assetWidgets,
                e.type,
                getDisplayName(e.displayName),
                e.unit,
                getValue(e.parameterName, e.dataType),
                e.assetDisplayValue,
                e.parameterName
              )}
              {/* </div> */}
            </Col>
          ))}
        </Row>
        <Row style={{ marginTop: "20px" }} gutter={[10, 10]}>
          {stringData.map((e) => (
            <Col xs={24} sm={24} md={6} lg={6} key={e.parameterName}>
              <Card
                hoverable
                style={{ minHeight: "38vh" }}
                onClick={() => handleCardClick(e)}
              >
                {renderUIComponent(
                  e.dataType,
                  e.chartType,
                  getDisplayName(e.displayName),
                  e.unit,
                  getValue(e.parameterName, e.dataType),
                  e.min,
                  e.max,
                  e.assetDisplayValue,
                  e.parameterName
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <Row style={{ marginTop: "20px" }} gutter={[10, 10]}>
          {otherData.map((e) => (
            <Col xs={24} sm={24} md={6} lg={6} key={e.parameterName}>
              <Card
                hoverable
                style={{ minHeight: "38vh" }}
                onClick={() => handleCardClick(e)}
              >
                {renderUIComponent(
                  e.dataType,
                  e.chartType,
                  e.assetWidgets,
                  e.type,
                  getDisplayName(e.displayName),
                  e.unit,
                  getValue(e.parameterName, e.dataType),
                  e.min,
                  e.parameterName,
                  e.max,
                  e.assetDisplayValueDto
                )}
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          visible={isModalVisible}
          onCancel={handleModalClose}
          // title={getValue(cardData?.parameterName)}
          width="70%"
          footer={null}
        >
          {console.log(
            selectedCardData !== "" ? selectedCardData : 0,
            "selectedCardData1"
          )}
          <LiveChartCBM
            id="1"
            title={SelectedParameterName}
            data2={selectedCardData !== "" ? selectedCardData : 0}
          />
        </Modal>
      </Spin>
    </Page>
  );
};
export default CbmDashboard;
