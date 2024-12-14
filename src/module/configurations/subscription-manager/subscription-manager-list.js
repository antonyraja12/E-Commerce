import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Modal, Row, Space, Table, message } from "antd";
// import { Button, Drawer, Table, Row, Col, Space, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import SubscriptionManagerForm from "./subscription-manager-form";
import { FaPlay, FaStop } from "react-icons/fa";
import AssetEngineService from "../../../services/asset-engine-service";
import AssetLibraryService from "../../../services/asset-library-service";
// import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
// import SubscriptionManagerService from "../../../services/subscription-manager-service";
// import AssetService from "../../../services/asset-service";
function SubscriptionManagerList(props) {
  const { assetId, assetLibraryId } = useParams();
  // const { assetId } = props;
  // const [parameters, setParameters] = useState([]);
  const [drawer, setDrawer] = useState({ open: false });
  const [data, setData] = useState({ loading: false, dataSource: [] });
  const [selectedItem, setSelectedItem] = useState([]);
  const [runningSub, setRunningSub] = useState({});
  useEffect(() => {
    if (assetId || assetLibraryId) {
      list();
    }
  }, [assetId, assetLibraryId]);
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
    // const service = new SubscriptionManagerService();
    setData((state) => ({ ...state, loading: true }));
    service
      .listSubscription(id)
      // .list({ assetId: assetId })
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          dataSource: data ? Object.values(data) : [],
        }));
        let sub = Object.keys(data);
        // for (let x of sub) {
        //   statusSubscription(x);
        // }
        // setData((state) => ({ ...state, dataSource: Object.values(data) }));
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  const onTableRowSelect = (selectedRowKeys, selectedRows, info) => {
    setSelectedItem(selectedRowKeys);
  };
  const onEdit = (name) => {
    // const onEdit = (id) => {
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
    // setDrawer({ open: true, title: "Add Service" });
  };
  const onClose = () => {
    setDrawer({ open: false });
    // setDrawer({ open: false, title: "Add Service" });
  };

  const onDelete = () => {
    Modal.confirm({
      title: "Delete",
      content: `Are you sure to delete ${selectedItem.length} item${
        selectedItem.length > 1 ? "s" : ""
      }?`,
      onOk: () => {
        let req = [];
        // const service = new AssetService();
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
          req.push(service.deleteSubscription(id, selectedName));
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
      render: (value, row, index) => {
        switch (value) {
          case "DataChange":
            return (
              value + " - (Associated property : " + row.parameterName + ")"
            );
          case "Scheduler":
            return value + " - (CRON expression : " + row.expression + ")";
          default:
            return value;
        }
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
        <SubscriptionManagerForm
          afterSave={afterSave}
          assetId={assetId}
          assetLibraryId={assetLibraryId}
          name={drawer.name}
        />
      </Drawer>
    </>
  );
}
export default SubscriptionManagerList;
