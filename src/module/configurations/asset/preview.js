import {
  Badge,
  Button,
  Checkbox,
  Col,
  Drawer,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AssetEngineService from "../../../services/asset-engine-service";
import "./asset.css";
import { useConnectionStatusIcon } from "../../../hooks/useConnectionStatus";
import { EditFilled } from "@ant-design/icons";
import UpdateParameterValue from "./update-parameter-value";

const { Paragraph, Text, Title } = Typography;
function Preview() {
  const { assetId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    connect: false,
    disconnect: false,
    start: false,
    stop: false,
  });
  const [data, setData] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [updateParameterValueProps, setUpdateParameterValueProps] = useState({
    open: false,
  });
  const [expandedColumns, setExpandedColumns] = useState({});
  const toggleExpand = (parameterName) => {
    setExpandedColumns((prevExpandedColumns) => ({
      ...prevExpandedColumns,
      [parameterName]: !prevExpandedColumns[parameterName],
    }));
  };
  useEffect(() => {
    loadData();
  }, [assetId]);
  useEffect(() => {
    if (data) {
      let alerts = Object.values(data?.alertDefinition);
      let activeAlerts = Object.values(data?.activeAlerts);
      let parameters = Object.values(data?.parameterDefinition);
      parameters.sort((a, b) =>
        a.parameterName?.localeCompare(b.parameterName)
      );

      setParameters(
        parameters.map((e) => {
          let activeAlertsCount = activeAlerts.filter(
            (el) => el.parameterName === e.parameterName
          )?.length;
          let alertsCount = data.alertHashMap[e.parameterName]?.length ?? 0;

          return {
            ...e,
            alertsCount: alertsCount,
            activeAlertsCount: activeAlertsCount,
          };
        })
      );
      setAlerts(alerts);
      setActiveAlerts(activeAlerts);
    } else {
      setParameters([]);
      setAlerts([]);
      setActiveAlerts([]);
    }
  }, [data]);
  const loadData = () => {
    setLoading(true);
    const service = new AssetEngineService();
    setData(null);

    service
      .getAsset(assetId)
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const start = () => {
    setButtonLoading((state) => ({ ...state, start: true }));
    const service = new AssetEngineService();
    service
      .start(assetId)
      .then(({ data }) => {
        loadData();
      })
      .finally(() => {
        setButtonLoading((state) => ({ ...state, start: false }));
      });
  };
  const stop = () => {
    setButtonLoading((state) => ({ ...state, stop: true }));
    const service = new AssetEngineService();
    service
      .stop(assetId)
      .then(({ data }) => {
        loadData();
      })
      .finally(() => {
        setButtonLoading((state) => ({ ...state, stop: false }));
      });
  };
  const connect = () => {
    setButtonLoading((state) => ({ ...state, connect: true }));
    const service = new AssetEngineService();
    service
      .connect(assetId)
      .then(({ data }) => {
        loadData();
      })
      .finally(() => {
        setButtonLoading((state) => ({ ...state, connect: false }));
      });
  };
  const disconnect = () => {
    setButtonLoading((state) => ({ ...state, disconnect: true }));
    const service = new AssetEngineService();
    service
      .disconnect(assetId)
      .then(({ data }) => {
        loadData();
      })
      .finally(() => {
        setButtonLoading((state) => ({ ...state, disconnect: false }));
      });
  };

  const openUpdateParameterValue = (e) => {
    const { dataType, parameterName } = e;
    setUpdateParameterValueProps({
      open: true,
      dataType,
      parameterName,
      assetId,
      value: data?.properties[parameterName],
    });
  };
  const closeUpdateParameterValue = (value = null) => {
    if (value) setData(value);
    setUpdateParameterValueProps({
      open: false,
    });
  };
  const contentLength = parameters.map(
    (e) => data?.properties[e.parameterName]
  );
  return (
    <div>
      <Space.Compact block>
        <Button
          onClick={connect}
          type="primary"
          loading={buttonLoading.connect}
        >
          Connect
        </Button>
        <Button
          onClick={disconnect}
          type="primary"
          loading={buttonLoading.disconnect}
        >
          Disconnect
        </Button>
        <Button onClick={start} type="primary" loading={buttonLoading.start}>
          Start
        </Button>
        <Button onClick={stop} type="primary" loading={buttonLoading.stop}>
          Stop
        </Button>
        <Button onClick={loadData} type="primary">
          Refresh
        </Button>
      </Space.Compact>
      <br />
      <Title level={2}>
        {useConnectionStatusIcon(data?.connected, data?.assetName)}
      </Title>
      <table
        className="parameter-table"
        style={{ width: "100%", tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            <th width="40%">Property</th>
            <th>Value</th>
            <th width="100px">Alert</th>
            <th width="100px">Active Alert</th>
            <th width="100px">Readonly</th>
          </tr>
        </thead>
        <tbody>
          {parameters?.map((e) => (
            <tr>
              <td>
                <Typography.Text>{e.parameterName}</Typography.Text>
              </td>

              <td>
                <Text
                  style={{ width: "100%" }}
                  ellipsis={{
                    rows: 1,
                    expandable: "collapsible",
                    expanded: expandedColumns[e.parameterName],
                    onExpand: (_, info) => toggleExpand(e.parameterName),
                  }}
                >
                  {!e.readonly && (
                    <>
                      <Button
                        size="small"
                        icon={<EditFilled />}
                        onClick={() => {
                          openUpdateParameterValue(e);
                        }}
                        shape="circle"
                      />
                      &nbsp;
                    </>
                  )}
                  {new String(data?.properties[e.parameterName])}
                </Text>
                {/* </Space> */}
              </td>
              <td>{e.alertsCount}</td>
              <td>{e.activeAlertsCount}</td>
              <td>
                <Checkbox checked={e.readonly} disabled />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Drawer
        size="large"
        title={`Update value - ${updateParameterValueProps.parameterName}`}
        open={updateParameterValueProps.open}
        onClose={() => closeUpdateParameterValue()}
        destroyOnClose
      >
        <UpdateParameterValue
          onClose={closeUpdateParameterValue}
          {...updateParameterValueProps}
        />
      </Drawer>

      <br />
      <Row justify={"end"}>
        <Col>
          <Link to="/settings/asset">
            <Button type="primary">Done</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
export default Preview;
