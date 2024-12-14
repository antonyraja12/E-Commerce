import { useEffect, useState } from "react";
import UserService from "../../../services/user-service";
import { Popconfirm, Table, Tag, Typography } from "antd";
import { dateTimeFormat } from "../../../helpers/url";

function UserToken() {
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      width: "80px",
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      width: "300px",
      render: (value) => {
        return (
          <div style={{ width: "300px" }}>
            <Typography.Text ellipsis>{value}</Typography.Text>
          </div>
        );
      },
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (value) => {
        return value?.userName;
      },
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (value) => {
        return dateTimeFormat(value);
      },
    },
    {
      title: "Expire On",
      dataIndex: "expireOn",
      key: "expireOn",
      render: (value) => {
        return dateTimeFormat(value);
      },
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (value, row, index) => {
        return value ? (
          <Popconfirm
            title="Deactivate token"
            description="Are you sure to deactivate this token?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deactivate(row.userTokenId, index)}
          >
            <Tag color="success" style={{ cursor: "pointer" }}>
              Active
            </Tag>
          </Popconfirm>
        ) : (
          <Tag color="processing">Inactive</Tag>
        );
      },
    },
  ];
  const [list, setList] = useState({
    loading: false,
    data: [],
  });
  useEffect(() => {
    setList((list) => ({ ...list, loading: true }));

    const userService = new UserService();
    userService
      .listToken()
      .then(({ data }) => {
        setList((list) => ({
          ...list,
          data: data.map((e, i) => ({ ...e, sno: i + 1 })),
        }));
      })
      .finally(() => {
        setList((list) => ({ ...list, loading: false }));
      });
  }, []);
  const deactivate = (id, index) => {
    const userService = new UserService();
    userService.deactivateToken(id).then(({ data }) => {
      setList((list) => {
        let d = [...list.data];
        d[index] = data;
        return {
          ...list,
          data: d,
        };
      });
    });
  };
  return (
    <>
      <Table
        size="small"
        bordered
        rowKey="userTokenId"
        dataSource={list.data}
        loading={list.loading}
        columns={columns}
      />
      ;
    </>
  );
}

export default UserToken;
