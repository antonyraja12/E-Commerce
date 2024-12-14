// import axios from "axios";
import {
  CaretRightOutlined,
  DeleteFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Drawer,
  Space,
  Table,
  message,
  Collapse,
  theme,
  Badge,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import AssetService from "../../../services/asset-service";
import AlertForm from "./alerts-form";
import AssetLibraryService from "../../../services/asset-library-service";

function Alerts() {
  const { token } = theme.useToken();
  const ref = useRef();
  const [popup, setPopup] = useState({ title: null, open: false });
  const { assetId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [library, setLibrary] = useState(null);
  const [libraryAlert, setLibraryAlert] = useState([]);

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const list = () => {
    setLoading(true);
    const service = new AssetService();
    service
      .retrieve(assetId)
      .then(({ data }) => {
        setData(Object.values(data.alerts));
        if (data.assetLibraryId) {
          const assetLibraryService = new AssetLibraryService();
          assetLibraryService.retrieve(data.assetLibraryId).then(({ data }) => {
            setLibrary(data);
            setLibraryAlert(data.alerts ? Object.values(data.alerts) : []);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    list();
  }, []);

  const columns = [
    {
      dataIndex: "alertName",
      key: "alertName",
      title: "Alert Name",
      align: "left",
      sorter: (a, b) => a.alertName.localeCompare(b.alertName),
      render: (value, record, index) => {
        return (
          <Button type="link" onClick={() => edit(record.alertName)}>
            {value}
          </Button>
        );
      },
    },
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter Name",
      align: "left",
      width: 250,
      sorter: (a, b) => a.parameterName.localeCompare(b.parameterName),
      // render: (value) => {
      //   return this.getParameterDisplayName(value);
      // },
    },
    {
      dataIndex: "notificationType",
      key: "notificationType",
      title: "Notification Type",
      align: "left",
      width: "150px",
      render: (value) => {
        return value.join(",");
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 150,
    },
    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      align: "right",
      width: "120px",
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
  ];
  const libraryColumns = [
    {
      dataIndex: "alertName",
      key: "alertName",
      title: "Alert Name",
      align: "left",
      sorter: (a, b) => a.alertName.localeCompare(b.alertName),
    },
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter Name",
      align: "left",
      width: 250,
      sorter: (a, b) => a.parameterName.localeCompare(b.parameterName),
      // render: (value) => {
      //   return this.getParameterDisplayName(value);
      // },
    },
    {
      dataIndex: "notificationType",
      key: "notificationType",
      title: "Notification Type",
      align: "left",
      width: "150px",
      render: (value) => {
        return value.join(",");
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 150,
    },
    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      align: "right",
      width: "120px",
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
  ];
  const onClose = (data = false) => {
    console.log(data, "data");
    if (data) {
      setData(Object.values(data?.alerts));
    }
    setPopup({ open: false, title: null });
  };
  const onTableRowSelect = (selectedRowKeys, selectedRows, info) => {
    setSelectedItem(
      selectedRows.map((e) => ({
        assetId: e.assetId,
        parameterName: e.parameterName,
        alertName: e.alertName,
      }))
    );
  };
  const deleteRow = () => {
    setLoading(true);
    const service = new AssetService();
    let req = [];
    for (let x of selectedItem) {
      req.push(service.deleteAlert(assetId, x.alertName));
    }
    Promise.all(req)
      .then(({ data }) => {
        list();
        message.success("Deleted successfully");
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const edit = (alertName) => {
    setPopup({ open: true, title: "Update", alertName: alertName });
  };

  const add = () => {
    setPopup({ open: true, title: "Add Alert" });
  };
  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <Space>
          <Button
            onClick={() => add()}
            size="small"
            type="primary"
            icon={<PlusOutlined />}
          >
            Add
          </Button>
          <Button
            onClick={() => deleteRow()}
            disabled={!selectedItem || selectedItem?.length === 0}
            size="small"
            type="primary"
            icon={<DeleteFilled />}
          >
            Delete
          </Button>
        </Space>
      </Col>
      <Col span={24}>
        <Collapse
          bordered={false}
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
              label: "Alert",
              style: panelStyle,
              // showArrow: false,
              // collapsible: "disabled",
              extra: <Badge count={data.length} showZero color="#1677FF" />,
              children: (
                <Table
                  rowSelection={{
                    type: "checkbox",
                    onChange: onTableRowSelect,
                  }}
                  bordered
                  rowKey="alertName"
                  pagination={{
                    showSizeChanger: true,
                    // //showQuickJumper: true,
                    size: "default",
                  }}
                  loading={loading}
                  dataSource={data}
                  columns={columns}
                  size="small"
                />
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  Asset Library Alert
                  <br />
                  {library?.assetLibraryName}
                </span>
              ),
              extra: (
                <Badge count={libraryAlert?.length} showZero color="#1677FF" />
              ),
              // label: library?.assetLibraryName,
              children: (
                <Table
                  bordered
                  rowKey="alertName"
                  pagination={{
                    showSizeChanger: true,
                    // //showQuickJumper: true,
                    size: "default",
                  }}
                  loading={loading}
                  dataSource={libraryAlert}
                  columns={libraryColumns}
                  size="small"
                />
              ),
              style: panelStyle,
            },
          ]}
        />

        <Drawer
          title={popup?.title}
          placement="right"
          closable={true}
          onClose={() => onClose()}
          open={popup?.open}
          destroyOnClose
          // getContainer={false}
        >
          {/* <Spin spinning={!!this.state.isFetching}> */}
          <AlertForm
            alertName={popup?.alertName}
            assetId={assetId}
            afterSave={onClose}
          />
          {/* </Spin> */}
        </Drawer>
      </Col>
    </Row>
  );
}

export default Alerts;
