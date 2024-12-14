import { DeleteFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Input,
  message,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { showDeleteConfirm } from "../../../utils/action-button/action-button";
import PropertyForm from "./property-form";

const Properties = () => {
  const { id } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const service = new WorkStationService();

  useEffect(() => {
    list();
  }, [id]);

  const list = () => {
    setLoading(true);
    service
      .retrieve(id)
      .then(({ data }) => {
        setData(
          Object.values(data.propertyDefinition).sort((a, b) =>
            a.parameterName.localeCompare(b.parameterName)
          )
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setEditId(null);
    setOpen(false);
  };

  const onEdit = (id) => {
    setEditId(id);
    showDrawer();
  };
  const title = "property";

  const onAdd = () => {
    setEditId(null);
    showDrawer();
  };

  const columns = [
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter Name",
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
      defaultSortOrder: "ascend",
    },
    {
      dataIndex: "displayName",
      key: "displayName",
      title: "Display name",
      render: (value, row) => {
        return value;
      },
      sorter: (a, b) => a.parameterName?.localeCompare(b.parameterName),
      defaultSortOrder: "ascend",
    },
    {
      dataIndex: "dataType",
      key: "dataType",
      title: "Base type",
      width: 150,
    },
    {
      dataIndex: "unit",
      key: "unit",
      title: "Unit",
      width: 150,
    },
    {
      dataIndex: "readonly",
      title: "Readonly",
      align: "center",
      render: (value) => {
        return <Checkbox checked={value} />;
      },
      width: 80,
    },
    {
      dataIndex: "generic",
      title: "Generic",
      align: "center",
      render: (value) => {
        return <Checkbox checked={value} />;
      },
      width: 80,
    },
    {
      dataIndex: "monitoring",
      title: "Monitoring",
      align: "center",
      render: (value) => {
        return <Checkbox checked={value} />;
      },
      width: 80,
    },
  ];

  const afterSave = (data) => {
    closeDrawer();
    list();
  };
  const onDelete = () => {
    try {
      showDeleteConfirm(async () => {
        for (let selectedIds of selectedRowKeys) {
          const response = await service.deletePropertyByName(id, selectedIds);
          if (response.status !== 200) {
            message.error(`Failed to delete item with ID: ${id}`);
          }
        }
        message.success("Selected rows deleted successfully");
        list();
        setSelectedRowKeys([]);
      });
    } catch (error) {
      message.error("Failed to delete selected rows");
    }
  };

  const onTableRowSelect = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const filteredData = useMemo(() => {
    if (!filter) return data;
    return data?.filter((e) => {
      return e.parameterName?.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, data]);

  return (
    <>
      <Spin spinning={loading}>
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
                disabled={selectedRowKeys.length === 0}
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
              placeholder="Search..."
              style={{ maxWidth: 300, width: "100%" }}
              onInput={(e) => setFilter(e.target.value)}
            />
            <br />
            <br />
            <Table
              rowSelection={{
                type: "checkbox",
                selectedRowKeys,
                onChange: onTableRowSelect,
              }}
              // loading={isLoading}
              rowKey="parameterName"
              className="table"
              size="small"
              dataSource={filteredData}
              columns={columns}
              pagination={false}
            />
          </Col>
        </Row>
        <Drawer
          title={`${editId ? "Update" : "Add"} property`}
          placement="right"
          closable={true}
          onClose={closeDrawer}
          open={open}
          destroyOnClose
          // getContainer={false}
        >
          <PropertyForm
            afterSave={afterSave}
            workStationId={id}
            parameterName={editId}
          />
        </Drawer>
      </Spin>
    </>
  );
};

export default Properties;
