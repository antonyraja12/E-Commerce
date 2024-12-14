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
  message,
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
import AssetLibraryService from "../../../services/asset-library-service";
import ParameterForm from "./parameters-form";
function Parameter(props) {
  const { assetLibraryId } = useParams();
  const columns = [
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter name",
      render: (value, row) => {
        return (
          <Button
            type="link"
            onClick={() => {
              onEdit(row.parameterName);
            }}
          >
            {value}
          </Button>
        );
      },
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      // defaultSortOrder: "ascend",
    },
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
      dataIndex: "dataType",
      key: "dataType",
      title: "Base type",
      width: 150,
    },
  ];
  const [dataSource, setDataSource] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setEditId(null);
    setOpen(false);
  };
  useEffect(() => {
    if (assetLibraryId) {
      list();
    }
  }, [assetLibraryId]);

  const list = () => {
    const assetLibraryService = new AssetLibraryService();
    assetLibraryService.listParameter(assetLibraryId).then(({ data }) => {
      let parameters = Object.values(data);
      parameters.sort((a, b) =>
        a.parameterName?.localeCompare(b.parameterName)
      );
      setDataSource(parameters);
    });
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
        const service = new AssetLibraryService();
        for (let id of selectedItem) {
          req.push(service.deleteParameter(assetLibraryId, id));
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
                label: "Parameter",
                extra: (
                  <Badge
                    color="#1677FF"
                    showZero
                    count={dataSource.length}
                  ></Badge>
                ),

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
        <ParameterForm
          afterSave={afterSave}
          assetLibraryId={assetLibraryId}
          parameterName={editId}
        />
      </Drawer>
    </div>
  );
}

export default Parameter;
