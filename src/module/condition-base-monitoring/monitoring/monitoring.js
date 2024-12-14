import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Result,
  Row,
  Select,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { PiPlugsConnected, PiPlugsLight } from "react-icons/pi";
import { publicUrl } from "../../../helpers/url";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetEngineService from "../../../services/asset-engine-service";
import AssetService from "../../../services/asset-service";
import Page from "../../../utils/page/page";
import MonitoringCard from "./monitoring-card";
import { IoMdAlert } from "react-icons/io";
import { IoAlert } from "react-icons/io5";
import "./monitoring.css";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import {
  NavLink,
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { withAuthorization } from "../../../utils/with-authorization";
import { useAccess } from "../../../hooks/useAccess";
function Monitoring(props) {
  const { hideFilter } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const assetIdParam = searchParams.get("assetId");
  const [loading, setLoading] = useState(false);
  const [assetId, setAssetId] = useState(null);
  const [assetThing, setAssetThing] = useState(null);
  const [parameter, setParameter] = useState([]);
  const [parameterHash, setParameterHash] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [access] = useAccess();
  const [assetOption, setAssetOption] = useState({
    loading: false,
    options: [],
  });
  const [ahList, setAhList] = useState({
    loading: false,
    parentTreeData: [],
    selected: null,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    fetchAppHierarchy();
  }, []);
  const fetchAppHierarchy = () => {
    const appHierarchyService = new AppHierarchyService();
    const aHId = queryParams.get("entityId");
    setAhList((state) => ({ ...state, loading: true }));
    appHierarchyService
      .list({ active: true })
      .then((response) => {
        const parentTreeData = appHierarchyService.convertToSelectTree(
          response.data
        );

        setAhList((state) => ({
          ...state,
          parentTreeData,
        }));
        if (parentTreeData.length > 0) {
          props.form?.setFieldsValue({
            // ahId: parentTreeData[0].value,
            ahId: aHId,
          });
          assetList(parentTreeData[0].value);
        }
      })
      .finally(() => {
        setAhList((state) => ({ ...state, loading: false }));
      });
  };
  const assetList = (ahId) => {
    if (ahId) {
      const service = new AssetService();
      setAssetOption((state) => ({ ...state, loading: true }));
      service
        .list({
          active: true,
          aHId: ahId,
          assetCategory: 1,
        })
        .then(({ data }) => {
          setAssetOption((state) => ({
            ...state,
            options: data.map((e) => ({
              label: e.assetName,
              value: e.assetId,
            })),
          }));
          if (data.length > 0) {
            props.form?.setFieldsValue({
              assetId: data[0].assetId,
            });
            setAssetId(data[0]?.assetId);
          }
        })
        .finally(() => {
          setAssetOption((state) => ({ ...state, loading: false }));
        });
    }
  };

  const fetchData = (assetId) => {
    const service = new AssetEngineService();
    service
      .getAsset(assetId)
      .then(({ data }) => {
        setAssetThing(data);
        setParameter(
          Object.values(data?.parameterDefinition)?.filter((e) => e.monitoring)
        );
        setParameterHash(data?.properties);

        setAlerts(() => {
          let alertList = Object.values(data.activeAlerts);
          let obj = {};
          for (let x of alertList) {
            if (!obj[x.parameterName]) {
              obj[x.parameterName] = [];
            }
            obj[x.parameterName].push(x);
          }
          return obj;
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (assetId) {
      setLoading(true);
      let interval = setInterval(() => {
        fetchData(assetId);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [assetId]);

  useMemo(() => {
    setAssetId(assetIdParam);
  }, [assetIdParam]);

  const listAlertParameters = () => {
    if (alerts) {
      let parameters = Object.keys(alerts);
      return parameters;
    }
    return [];
  };
  const getIcon = (in0dex) => {
    // if (index % 3 === 0) {
    //   return <SlGraph />;
    // }

    // if (index % 2 === 0) {
    //   return <FiBarChart2 />;
    // }

    // return <FiActivity />;
    return <FiBarChart2 />;
  };
  const loadingContainer = () => {
    return (
      <Row gutter={[10, 10]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((e) => (
          <Col lg={4} md={4}>
            <Card loading />
          </Col>
        ))}
      </Row>
    );
  };
  const { isLoading } = props;

  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  console.log(props, "Sss");
  // if (!access[0] || access[0].length === 0) {
  //   return (
  //     <Result
  //       status={"403"}
  //       title="403"
  //       subTitle="Sorry You are not authorized to access this page"
  //     />
  //   );
  // }

  return (
    <Spin spinning={isLoading}>
      <Page>
        {!hideFilter && (
          <Form form={props.form}>
            <Row gutter={[10, 10]}>
              <Col lg={6}>
                <Form.Item name="ahId">
                  <TreeSelect
                    onChange={(val) => assetList(val)}
                    treeData={ahList.parentTreeData}
                    loading={ahList.loading}
                  />
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item name="assetId">
                  <Select
                    options={assetOption?.options}
                    loading={assetOption?.loading}
                    onChange={setAssetId}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Row gutter={[10, 10]}>
              <Col lg={24}>
                {loading ? (
                  <Card loading></Card>
                ) : (
                  <Flex align="center" gap={15}>
                    {assetThing?.image && (
                      <Image
                        style={{
                          height: "80px",
                          width: "80px",
                          border: "1px solid #eeeeee",
                          objectFit: "contain",
                          // boxShadow: "rgb(221, 221, 221) 3px 3px 8px",
                          borderRadius: 5,
                          padding: 5,
                        }}
                        size={40}
                        preview={false}
                        src={`${publicUrl}/${assetThing?.image}`}
                      />
                    )}
                    <Flex vertical>
                      <Typography.Title level={4}>
                        {assetThing?.assetName}
                      </Typography.Title>

                      {assetThing?.connected ? (
                        <Typography.Text type="success" strong>
                          <Flex align="center" gap={10}>
                            <PiPlugsConnected
                              style={{
                                fontSize: "2em",
                                transform: "rotate(45deg)",
                              }}
                            />
                            Connected
                          </Flex>
                        </Typography.Text>
                      ) : (
                        <Typography.Text type="danger" strong>
                          <Flex align="center" gap={10}>
                            <PiPlugsLight
                              style={{
                                fontSize: "2em",
                                transform: "rotate(45deg)",
                              }}
                            />
                            Disconnected
                          </Flex>
                        </Typography.Text>
                      )}
                    </Flex>
                    {listAlertParameters()?.length > 0 && (
                      <div style={{ marginLeft: "auto" }}>
                        <Badge
                          count={listAlertParameters()?.length}
                          style={{ backgroundColor: "#FF5353" }}
                        >
                          <Avatar
                            shape="square"
                            icon={<IoAlert style={{ color: "#FF5353" }} />}
                            style={{ backgroundColor: "#ff535351" }}
                          />
                        </Badge>
                      </div>
                    )}
                  </Flex>
                )}
              </Col>
              <Col lg={24}>
                {loading ? (
                  loadingContainer()
                ) : (
                  <Flex gap={15} wrap="wrap">
                    {parameter?.map((e, i) => (
                      <MonitoringCard
                        dataType={e.dataType}
                        id={e.parameterName}
                        value={new String(parameterHash[e.parameterName])}
                        title={e.displayName}
                        alerts={alerts[e.parameterName]}
                        icon={getIcon(i)}
                      />
                    ))}
                  </Flex>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Page>
    </Spin>
  );
}

export default withRouter(withAuthorization(withForm(Monitoring)));
