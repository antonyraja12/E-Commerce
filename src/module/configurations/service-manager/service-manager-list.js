import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Modal, Row, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssetLibraryService from "../../../services/asset-library-service";
import AssetService from "../../../services/asset-service";
import ServiceManagerForm from "./service-manager-form";
function ServiceManagerList(props) {
  const { assetId, assetLibraryId } = useParams();
  // const { assetId } = props;
  const [drawer, setDrawer] = useState({ open: false });
  const [data, setData] = useState({ loading: false, dataSource: [] });
  const [selectedItem, setSelectedItem] = useState([]);
  // const [id, setId] = useState(null);
  useEffect(() => {
    list();
  }, []);
  const list = () => {
    let service;
    let id;
    if (assetId) {
      service = new AssetService();
      id = assetId;
    } else if (assetLibraryId) {
      service = new AssetLibraryService();
      id = assetLibraryId;
    }
    // const service = new ServiceManagerService();
    setData((state) => ({ ...state, loading: true }));
    service
      .listService(id)
      // .list({ assetId: assetId })
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          dataSource: data ? Object.values(data) : [],
        }));
        // setData((state) => ({ ...state, dataSource: data }));
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  const onTableRowSelect = (selectedRowKeys, selectedRows, info) => {
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
    Modal.confirm({
      title: "Delete",
      content: `Are you sure to delete ${selectedItem.length} item${
        selectedItem.length > 1 ? "s" : ""
      }?`,
      onOk: () => {
        let req = [];
        // const service = new ServiceManagerService();
        let service;
        let id;
        if (assetId) {
          service = new AssetService();
          id = assetId;
        } else if (assetLibraryId) {
          service = new AssetLibraryService();
          id = assetLibraryId;
        }
        for (let selectedName of selectedItem) {
          req.push(service.deleteService(id, selectedName));
        }
        setData((state) => ({ ...state, loading: true }));
        Promise.all(req)
          .then((response) => {
            message.success("Deleted Successfully");
            list();
            setSelectedItem([]);
          })
          .finally(() => {
            setData((state) => ({ ...state, loading: false }));
          });
      },
    });
  };
  const columns = [
    {
      dataIndex: "name",
      key: "name",
      // dataIndex: "serviceName",
      // key: "serviceName",
      title: "Name",
      render: (value, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              onEdit(value);
              // onEdit(record.serviceManagerId);
            }}
          >
            {value}
          </Button>
        );
      },
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
          <Table
            size="small"
            columns={columns}
            dataSource={data.dataSource}
            loading={data.loading}
            rowKey="name"
            bordered
            rowSelection={{
              type: "checkbox",
              onChange: onTableRowSelect,
            }}
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
        <ServiceManagerForm
          afterSave={afterSave}
          assetId={assetId}
          assetLibraryId={assetLibraryId}
          name={drawer.name}
          // serviceManagerId={drawer.serviceManagerId}
        />
      </Drawer>
    </>
  );
}
export default ServiceManagerList;
