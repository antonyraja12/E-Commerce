import {
  Button,
  Col,
  Drawer,
  Row,
  Spin,
  Table,
  Typography,
  Space,
  Collapse,
  Input,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { EditFilled, SearchOutlined } from "@ant-design/icons";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import UpdatePropertyValue from "./property-value-update-form";
import { PiPlugsConnected, PiPlugsLight } from "react-icons/pi";
const { Paragraph, Text } = Typography;

const Preview = () => {
  const { pathname } = useLocation();

  const [disabled, setDisabled] = useState(false);

  const { id } = useParams();
  const [filter, setFilter] = useState(null);

  const [data, setData] = useState({
    properties: [],
    propertyDefinition: [],
    constructedData: [],
    connections: [],
  });
  const [updateParameterValueProps, setUpdateParameterValueProps] = useState({
    open: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedColumns, setExpandedColumns] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const toggleExpand = (parameterName) => {
    setExpandedColumns((prevExpandedColumns) => ({
      ...prevExpandedColumns,
      [parameterName]: !prevExpandedColumns[parameterName],
    }));
  };
  const redirect = useMemo(() => {
    if (pathname?.includes("/view")) {
      setDisabled(true);
    }
    if (pathname?.includes("update") || pathname?.includes("add"))
      return "../../";
    return "../";
  }, [pathname]);
  useEffect(() => {
    if (id) {
      retrieve(id);
    }
  }, [id]);
  let retrieve = (id) => {
    setIsLoading(true);
    const service = new WorkStationInstanceService();
    service
      .retrieve(id)
      .then((res) => {
        const { properties, propertyDefinition, connections } = res.data;

        let connectionStatusObj = {};
        let conn = [];
        for (let key in connections) {
          conn.push({
            connectionId: key,
            ...connections[key],
          });
          connectionStatusObj[key] = false;
        }
        setConnectionStatus(connectionStatusObj);
        setData({
          properties: propertyDefinition.sort((a, b) =>
            a.parameterName?.localeCompare(b.parameterName)
          ),
          value: properties,
          connections: conn,
        });
      })
      .catch((error) => {
        console.log("Error during data retrieval:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      dataIndex: "parameterName",
      title: "Property",
      key: "parameterName",
    },
    {
      dataIndex: "parameterName",
      title: "Value",
      key: "parameterName",

      render: (key, rec) => {
        let value = data?.value[key];
        const displayValue =
          typeof value === "object" ? JSON.stringify(value) : new String(value);

        return (
          <Text
            style={{ width: "100%" }}
            ellipsis={{
              rows: 1,
              expandable: "collapsible",
              expanded: expandedColumns[value],
              onExpand: (_, info) => toggleExpand(value),
            }}
          >
            {
              <>
                <Button
                  size="small"
                  icon={<EditFilled />}
                  onClick={() => {
                    openUpdateParameterValue(rec);
                  }}
                  shape="circle"
                />
                &nbsp;
              </>
            }
            {displayValue.length > 60
              ? `${displayValue.slice(0, 80)}...`
              : displayValue}
          </Text>
        );
      },
    },
    // {
    //   dataIndex: "readonly",
    //   title: "Readonly",
    //   key: "readonly",
    //   render: (value, rec) => {
    //     return <Checkbox checked={value} disabled />;
    //   },
    // },
  ];
  const closeUpdateParameterValue = (value = null) => {
    if (value) setData(value);
    retrieve(id);
    setUpdateParameterValueProps({
      open: false,
    });
  };
  const openUpdateParameterValue = (val) => {
    const { parameterName, value, dataType } = val;

    setUpdateParameterValueProps({
      open: true,
      parameterName,
      value: data?.value[parameterName],
      dataType,
      id,
    });
  };

  const toogleConnection = (connectionId) => {
    const service = new WorkStationInstanceService();
    setConnectionStatus((state) => ({ ...state, [connectionId]: true }));
    service
      .connection(id, connectionId)
      .then(({ data }) => {})
      .finally(() => {
        setConnectionStatus((state) => ({ ...state, [connectionId]: false }));
        retrieve(id);
      });
  };

  const connColumns = [
    {
      dataIndex: "connectionId",
      title: "Connection Id",
    },
    {
      dataIndex: "connected",
      title: "Connected",
      render: (value, record) => {
        if (value) {
          if (connectionStatus[record.connectionId]) {
            return <Spin spinning={true} />;
          }

          return (
            <Typography.Text type="success">
              <PiPlugsConnected
                onClick={() => {
                  toogleConnection(record.connectionId);
                }}
                style={{
                  fontSize: "2em",
                  // transform: "rotate(45deg)",
                }}
              />
            </Typography.Text>
          );
        }
        return (
          <Typography.Text type="danger">
            <PiPlugsLight
              onClick={() => {
                toogleConnection(record.connectionId);
              }}
              style={{
                fontSize: "2em",
                // transform: "rotate(45deg)",
              }}
            />
          </Typography.Text>
        );
      },
    },
  ];
  const restart = () => {
    const service = new WorkStationInstanceService();
    service
      .restart(id)
      .then(({ data }) => {
        retrieve(id);
      })
      .finally(() => {
        // setButtonLoading((state) => ({ ...state, start: false }));
      });
  };

  const start = () => {
    // setButtonLoading((state) => ({ ...state, start: true }));
    const service = new WorkStationInstanceService();
    service
      .start(id)
      .then(({ data }) => {
        retrieve(id);
      })
      .finally(() => {
        // setButtonLoading((state) => ({ ...state, start: false }));
      });
  };

  const filteredData = useMemo(() => {
    if (!filter) return data.properties;
    return data.properties?.filter((e) => {
      return e.parameterName?.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, data]);
  return (
    <>
      <Space.Compact block>
        <Button onClick={start} type="primary">
          Start
        </Button>
        <Button onClick={restart} type="primary">
          Re-start
        </Button>
        <Button onClick={() => retrieve(id)} type="primary">
          Refresh
        </Button>
      </Space.Compact>
      <Spin spinning={isLoading}>
        <Collapse
          defaultActiveKey={["1", "2"]}
          ghost
          items={[
            {
              key: "1",
              label: "Device",
              children: (
                <Table
                  columns={connColumns}
                  size="small"
                  dataSource={data.connections}
                  pagination={false}
                  className="table"
                />
              ),
            },
            {
              key: "2",
              label: "Property",
              children: (
                <>
                  <Input
                    prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                    placeholder="Search..."
                    style={{ maxWidth: 300, width: "100%" }}
                    onInput={(e) => setFilter(e.target.value)}
                  />
                  <br />
                  <br />
                  <Table
                    size="small"
                    dataSource={filteredData}
                    className="table"
                    columns={columns}
                    pagination={false}
                  />
                </>
              ),
            },
          ]}
        />

        <Row justify={"end"}>
          <Col>
            <Link to={redirect}>
              <Button type="primary"> Done</Button>
            </Link>
          </Col>
        </Row>
        <Drawer
          size="large"
          // title={`Update value - ${updateParameterValueProps.parameterName}`}
          open={updateParameterValueProps.open}
          onClose={() => closeUpdateParameterValue()}
          destroyOnClose
        >
          <UpdatePropertyValue
            disabled={disabled}
            onClose={closeUpdateParameterValue}
            {...updateParameterValueProps}
          />
        </Drawer>
      </Spin>
    </>
  );
};

export default Preview;
