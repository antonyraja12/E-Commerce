import {
  Badge,
  Button,
  Col,
  Collapse,
  Drawer,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";

import {
  CaretRightOutlined,
  DeleteFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useParams } from "react-router";
import AssetParametersValueService from "../../../services/asset-parameter- value-service";
import AssetService from "../../../services/asset-service";
import AssetParameterForm from "./asset-parameters-form";
import AssetLibraryService from "../../../services/asset-library-service";
import Paragraph from "antd/es/typography/Paragraph";
function AssetParameter(props) {
  const { token } = theme.useToken();
  const { assetId } = useParams();
  const [expandedColumns, setExpandedColumns] = useState({});

  const toggleExpand = (v) => {
    setExpandedColumns((prevExpandedColumns) => ({
      ...prevExpandedColumns,
      [v]: !prevExpandedColumns[v],
    }));
  };
  const columns = [
    {
      dataIndex: "displayName",
      key: "displayName",
      title: "Display name",
      render: (value, row) => {
        return value;
      },
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      // defaultSortOrder: "ascend",
    },
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter name",
      width: 250,
      render: (value, row) => {
        return (
          <Button
            type="link"
            onClick={() => {
              onEdit(row.parameterName);
            }}
          >
            <Typography.Paragraph
              copyable={{
                text: value,
              }}
            >
              {value}
            </Typography.Paragraph>
          </Button>
        );
      },
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      // defaultSortOrder: "ascend",
    },
    {
      dataIndex: "dataType",
      key: "dataType",
      title: "Base type",
      width: 150,
    },
    {
      dataIndex: "parameterName",
      key: "value",
      title: "Value",
      width: 150,
      render: (v) => {
        return (
          <Paragraph
            // ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {/* {new String(data?.properties[e.parameterName])} */}
            {expandedColumns[v]
              ? new String(value[v]?.value)
              : new String(value[v]?.value).length > 36
              ? `${new String(value[v]?.value).slice(0, 36)}`
              : new String(value[v]?.value)}

            {new String(value[v]?.value).length > 36 && (
              <Button
                // style={{ marginLeft: "-1em" }}
                type="link"
                onClick={() => toggleExpand(v)}
              >
                {expandedColumns[v] ? "View Less  " : "Expand"}
              </Button>
            )}
          </Paragraph>
        );
      },
    },
    {
      dataIndex: "parameterName",
      key: "time",
      title: "Updated at",
      render: (v) => {
        return (
          value[v]?.time && (
            <Tag>{moment(value[v]?.time).format("DD-MM-YYYY hh:mm:ss A")}</Tag>
          )
        );
      },
      width: 150,
    },
  ];

  const libraryColumns = [
    {
      dataIndex: "displayName",
      key: "displayName",
      title: "Display name",
      render: (value, row) => {
        return value;
      },
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      // defaultSortOrder: "ascend",
    },
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter name",
      width: 250,
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      // defaultSortOrder: "ascend",
      render: (value) => {
        return (
          <Typography.Paragraph
            copyable={{
              text: value,
            }}
          >
            {value}
          </Typography.Paragraph>
        );
      },
    },
    {
      dataIndex: "dataType",
      key: "dataType",
      title: "Base type",
      width: 150,
    },
    {
      dataIndex: "parameterName",
      key: "value",
      title: "Value",
      width: 150,
      render: (v) => {
        return (
          <span className="parameterValue">{new String(value[v]?.value)}</span>
        );
      },
    },
    {
      dataIndex: "parameterName",
      key: "time",
      title: "Updated at",
      render: (v) => {
        return (
          value[v]?.time && (
            <Tag>{moment(value[v]?.time).format("DD-MM-YYYY hh:mm:ss A")}</Tag>
          )
        );
      },
      width: 150,
    },
  ];
  const [dataSource, setDataSource] = useState([]);
  const [library, setLibrary] = useState(null);
  const [libraryParameter, setLibraryParameter] = useState([]);
  const [value, setValue] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const closeDrawer = () => {
    setEditId(null);
    setOpen(false);
  };
  useEffect(() => {
    if (assetId) {
      list();
      getData();
    }
  }, [assetId]);
  useEffect(() => {
    if (autoRefresh) {
      let intervalId = setInterval(() => {
        if (assetId) getData();
      }, 4000);
      setIntervalId(intervalId);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [autoRefresh]);

  const list = () => {
    const assetService = new AssetService();
    assetService.retrieve(assetId).then(({ data }) => {
      let parameters = Object.values(data.parameters);
      parameters.sort((a, b) =>
        a.parameterName?.localeCompare(b.parameterName)
      );
      setDataSource(parameters);
      if (data.assetLibraryId) {
        const assetLibraryService = new AssetLibraryService();
        assetLibraryService.retrieve(data.assetLibraryId).then(({ data }) => {
          setLibrary(data);
          setLibraryParameter(
            data.parameters ? Object.values(data.parameters) : []
          );
        });
      }
    });
  };
  const getData = () => {
    if (assetId) {
      setLoading(true);
      const service = new AssetParametersValueService();
      service
        .getParameterValue(assetId)
        .then(({ data }) => {
          let valueObject = {};
          for (let x of data) {
            valueObject[x.parameterName] = { value: x.value, time: x.time };
          }
          setValue(valueObject);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const enableAutoRefresh = (value, event) => {
    setAutoRefresh(value);
  };
  const onTableRowSelect = (selectedRowKeys, selectedRows, info) => {
    setSelectedItem(selectedRowKeys);
  };
  const onAdd = () => {
    setEditId(null);
    showDrawer();
  };
  const onEdit = (id) => {
    setEditId(id);
    showDrawer();
  };
  const afterSave = (data) => {
    closeDrawer();
    if (data) {
      let parameters = Object.values(data.parameters);
      parameters.sort((a, b) =>
        a.parameterName?.localeCompare(b.parameterName)
      );
      setDataSource(parameters);
    }
  };

  const onDelete = () => {
    Modal.confirm({
      title: "Delete",
      content: `Are you sure to delete ${selectedItem.length} item${
        selectedItem.length > 1 ? "s" : ""
      }?`,
      onOk: () => {
        let req = [];
        const service = new AssetService();
        for (let id of selectedItem) {
          req.push(service.deleteParameter(assetId, id));
        }
        setLoading(true);
        Promise.all(req)
          .then((response) => {
            message.success("Deleted Successfully");
            list();
            setSelectedItem([]);
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  return (
    <div style={{ minHeight: "300px" }}>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Space>
            <Button
              onClick={onAdd}
              size="small"
              type="primary"
              icon={<PlusOutlined />}
            >
              Add
            </Button>
            <Button
              onClick={onDelete}
              disabled={selectedItem.length === 0}
              size="small"
              type="primary"
              icon={<DeleteFilled />}
            >
              Delete
            </Button>
            <Button
              onClick={getData}
              size="small"
              type="primary"
              icon={<ReloadOutlined />}
            >
              Refresh
            </Button>
            <label>
              <Switch size="small" onChange={enableAutoRefresh} />
              &nbsp; Auto Refresh
            </label>
          </Space>
        </Col>
        <Col span={24}>
          <Collapse
            bordered={false}
            // activeKey={dataSource.length > 0 ? ["1"] : ["2"]}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: token.colorBgContainer,
            }}
            items={[
              {
                key: "1",
                label: "Asset Parameter",
                style: panelStyle,
                extra: (
                  <Badge
                    showZero
                    color="#1677FF"
                    count={dataSource.length}
                  ></Badge>
                ),
                // showArrow: false,
                // collapsible: "disabled",
                children: (
                  <Table
                    rowSelection={{
                      type: "checkbox",
                      onChange: onTableRowSelect,
                    }}
                    loading={isLoading}
                    rowKey="parameterName"
                    className="table"
                    size="small"
                    dataSource={dataSource}
                    columns={columns}
                  />
                ),
              },
              {
                key: "2",
                // label: library?.assetLibraryName,
                label: (
                  <span>
                    Asset Library Parameter
                    <br />
                    {library?.assetLibraryName}
                  </span>
                ),
                style: panelStyle,
                extra: (
                  <Badge
                    showZero
                    color={"#1677FF"}
                    count={libraryParameter.length}
                  ></Badge>
                ),
                children: (
                  <Table
                    loading={isLoading}
                    rowKey="parameterName"
                    className="table"
                    size="small"
                    dataSource={libraryParameter}
                    columns={libraryColumns}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <Drawer
        title={`${editId ? "Update" : "Add"} Parameter`}
        placement="right"
        closable={true}
        onClose={closeDrawer}
        open={open}
        destroyOnClose
        // getContainer={false}
      >
        <AssetParameterForm
          afterSave={afterSave}
          assetId={assetId}
          parameterName={editId}
        />
      </Drawer>
    </div>
  );
}

export default AssetParameter;
