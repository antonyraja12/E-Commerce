import {
  DeleteFilled,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { showDeleteConfirm } from "../../../utils/action-button/action-button";
import ServiceForm from "./service-form";
import ServiceExecute from "./service-execute";
function ServiceList(props) {
  const [filter, setFilter] = useState(null);
  const { id } = useParams();
  const [drawer, setDrawer] = useState({ open: false });
  const [isLoading, setIsloading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    serviceName: null,
    argument: null,
    id: null,
  });

  const service = new WorkStationService();

  useEffect(() => {
    list();
  }, []);
  const list = () => {
    setIsloading(true);
    service
      .retrieve(id)
      .then(({ data }) => {
        setDataSource(
          Object.values(data.serviceDefinition).sort((a, b) =>
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
  const onEdit = (id) => {
    setDrawer({ open: true, title: "Update Service", name: id });
    // setDrawer({ open: true, title: "Update Service", serviceManagerId: id });
  };
  const onAdd = () => {
    setDrawer({ open: true, title: "Add Service" });
  };
  const onClose = () => {
    setDrawer({ open: false, title: "Add Service" });
  };
  const onDelete = () => {
    try {
      showDeleteConfirm(async () => {
        for (let selectedIds of selectedItem) {
          const response = await service.deleteServiceByName(id, selectedIds);
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
      title: "",
      width: 50,
      align: "center",
      render: (value, record) => (
        <Tooltip title="Execute">
          <Button
            data-testid="edit-button"
            name="execute"
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={() => handleExecute(id, value, record?.argument)}
          />
        </Tooltip>
      ),
    },
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

    // {
    //   dataIndex: "active",
    //   key: "active",
    //   title: "Active",
    //   render: (value) => (value ? "True" : "False"),
    // },
  ];
  const afterSave = () => {
    onClose();
    list();
  };
  const handleExecute = (id, name, args) => {
    setModal({
      open: true,
      title: `Execute ${name}`,
      serviceName: name,
      argument: args,
      id: id,
    });
  };
  const handleExecuteClose = () => {
    setModal({
      open: false,
      title: "",
      serviceName: null,
      argument: null,
      id: null,
    });
  };
  const filteredData = useMemo(() => {
    if (!filter) return dataSource;
    return dataSource?.filter((e) => {
      return e.name?.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, dataSource]);
  return (
    <>
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
            loading={isLoading}
            rowKey="name"
            bordered
            rowSelection={{
              type: "checkbox",
              onChange: onTableRowSelect,
            }}
            pagination={false}
          />
          <ServiceExecute {...modal} onClose={handleExecuteClose} />
        </Col>
      </Row>
      <Drawer
        size="large"
        onClose={onClose}
        open={drawer.open}
        title={drawer.title}
        destroyOnClose
      >
        <ServiceForm
          afterSave={afterSave}
          workStationId={id}
          name={drawer.name}
        />
      </Drawer>
    </>
  );
}
export default ServiceList;
