import { DeleteFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  message,
} from "antd";
// import { Button, Drawer, Table, Row, Col, Space, message, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SubscriptionForm from "./subscription-form";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { showDeleteConfirm } from "../../../utils/action-button/action-button";

function SubscriptionList(props) {
  const { id } = useParams();
  const [filter, setFilter] = useState(null);
  // const { assetId } = props;
  // const [parameters, setParameters] = useState([]);
  const [drawer, setDrawer] = useState({ open: false });
  const [data, setData] = useState({ loading: false, dataSource: [] });
  const [dataSource, setDataSource] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isLoading, setIsloading] = useState({});
  const service = new WorkStationService();
  useEffect(() => {
    if (id) {
      list();
    }
  }, [id]);
  const list = () => {
    setIsloading(true);
    service
      .retrieve(id)
      .then(({ data }) => {
        setDataSource(
          Object.values(data.subscriptionDefinition).sort((a, b) =>
            a.name?.localeCompare(b.name)
          )
        );
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  const onTableRowSelect = (selectedRowKeys) => {
    setSelectedItem(selectedRowKeys);
  };
  const onEdit = (name) => {
    setDrawer({
      open: true,
      title: "Update Subscription",
      name: name,
      // title: "Update Service",
      // subscriptionManagerId: id,
    });
  };
  const onAdd = () => {
    setDrawer({ open: true, title: "Add Subscription" });
  };
  const onClose = () => {
    setDrawer({ open: false });
    // setDrawer({ open: false, title: "Add Service" });
  };

  const onDelete = () => {
    try {
      showDeleteConfirm(async () => {
        for (let selectedIds of selectedItem) {
          const response = await service.deleteSubscriptionByName(
            id,
            selectedIds
          );
          if (response.status !== 200) {
            message.error(`Failed to delete item with ID: ${id}`);
          }
        }
        message.success("Selected rows deleted successfully");
        list();
        setSelectedItem([]);
      });
    } catch (error) {
      message.error("Failed to delete selected rows");
    }
  };
  const columns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (value, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              onEdit(value);
            }}
          >
            {value}
          </Button>
        );
      },
    },
    {
      dataIndex: "trigger",
      key: "trigger",
      title: "Trigger",
      //   render: (value, row, index) => {
      //     switch (value) {
      //       case "DataChange":
      //         return (
      //           value + " - (Associated property : " + row.parameterName + ")"
      //         );
      //       case "Scheduler":
      //         return value + " - (CRON expression : " + row.expression + ")";
      //       default:
      //         return value;
      //     }
      //   },
    },
    {
      dataIndex: "active",
      key: "active",
      title: "Active",
      render: (value) => (value ? "True" : "False"),
    },
  ];
  const afterSave = () => {
    onClose();
    list();
  };
  const filteredData = useMemo(() => {
    if (!filter) return dataSource;
    return dataSource?.filter((e) => {
      return e.name?.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, dataSource]);
  return (
    <Spin spinning={isLoading}>
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
          </Space>
        </Col>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
            style={{ maxWidth: 300, width: "100%" }}
            onInput={(e) => setFilter(e.target.value)}
            placeholder="Search..."
          />
          <br />
          <br />
          <Table
            size="small"
            className="table"
            columns={columns}
            dataSource={filteredData}
            loading={data.loading}
            rowKey="name"
            bordered
            rowSelection={{
              type: "checkbox",
              onChange: onTableRowSelect,
              selectedItem,
            }}
            pagination={false}
          />
        </Col>
      </Row>
      <Drawer
        size="large"
        onClose={onClose}
        open={drawer.open}
        title={drawer.title}
        destroyOnClose
      >
        <SubscriptionForm
          name={drawer.name}
          workStationId={id}
          afterSave={afterSave}
        />
      </Drawer>
    </Spin>
  );
}
export default SubscriptionList;
