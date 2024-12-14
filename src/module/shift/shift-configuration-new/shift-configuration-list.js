import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Modal, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";

function ShiftConfigurationList() {
  const [data, setData] = useState({ loading: false, dataSource: [] });
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 250,
    },
    // {
    //   title: "Assets",
    //   dataIndex: "shiftAssetMappingList",
    //   render: (value) => {
    //     return value.map((e) => <Tag>{e.assetName}</Tag>);
    //   },
    // },
    {
      title: "Action",
      dataIndex: "shiftMasterAssetWiseId",
      align: "center",
      render: (value) => {
        return (
          <Space>
            <Link to={`update/${value}`}>
              <Button icon={<EditOutlined />} type="text" />
            </Link>
            <Button
              onClick={() => deleteData(value)}
              icon={<DeleteOutlined />}
              type="text"
            />
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    list();
  }, []);
  const list = () => {
    const service = new ShiftMasterAssetWiseService();
    setData((state) => ({
      ...state,
      loading: true,
    }));
    service
      .list()
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          dataSource: data.map((e, i) => ({ ...e, sno: i + 1 })),
        }));
      })
      .finally(() => {
        setData((state) => ({
          ...state,
          loading: false,
        }));
      });
  };
  const deleteData = (id) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure, you want to delete this record ?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          const service = new ShiftMasterAssetWiseService();
          service
            .delete(id)
            .then(() => {
              message.success("Deleted Successfully");
              list();
              resolve();
            })
            .catch((err) => reject(err));
        });
      },
    });
  };
  return (
    <Card
      // title="Shift Configuration"
      extra={
        <Link to={`add`}>
          <Button icon={<PlusOutlined />} type="primary">
            Add
          </Button>
        </Link>
      }
    >
      <Table
        rowKey="shiftMasterAssetWiseId"
        size="small"
        {...data}
        columns={columns}
        bordered
      />
    </Card>
  );
}

export default ShiftConfigurationList;
