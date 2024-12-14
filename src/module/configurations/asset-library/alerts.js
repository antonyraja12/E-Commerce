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
  Badge,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AssetLibraryAlertsForm from "./alerts-form";
import AssetLibraryService from "../../../services/asset-library-service";

function AssetLibrarayAlerts() {
  const [popup, setPopup] = useState({ title: null, open: false });
  const { assetLibraryId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const list = () => {
    setLoading(true);
    const service = new AssetLibraryService();
    service
      .listAlert(assetLibraryId)
      .then(({ data }) => {
        setData(Object.values(data));
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
      sorter: (a, b) => a.parameterName.localeCompare(b.parameterName),
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
    // console.log(data);
    if (data) {
      setData(Object.values(data?.alerts));
    }
    setPopup({ open: false, title: null });
  };
  const onTableRowSelect = (selectedRowKeys, selectedRows, info) => {
    setSelectedItem(
      selectedRows.map((e) => ({
        assetLibraryId: e.assetLibraryId,
        parameterName: e.parameterName,
        alertName: e.alertName,
      }))
    );
  };
  const deleteRow = () => {
    setLoading(true);
    const service = new AssetLibraryService();
    let req = [];
    for (let x of selectedItem) {
      req.push(service.deleteAlert(assetLibraryId, x.alertName));
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
          items={[
            {
              key: "1",
              label: "Alert",
              extra: <Badge color="#1677FF" showZero count={data.length} />,

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
          <AssetLibraryAlertsForm
            alertName={popup?.alertName}
            assetLibraryId={assetLibraryId}
            afterSave={onClose}
          />
        </Drawer>
      </Col>
    </Row>
  );
}

export default AssetLibrarayAlerts;
