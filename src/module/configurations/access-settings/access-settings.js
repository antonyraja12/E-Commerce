import { useEffect, useState } from "react";
import MenuService from "../../../services/menu-service";
import Page from "../../../utils/page/page";
import { Table, Form, Button, Select, Input, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import {
  ViewButton,
  EditButton,
  DeleteButton,
} from "../../../utils/action-button/action-button";
import RoleService from "../../../services/role-service";
import AccessSettingsService from "../../../services/access-settings-service";
function AccessSettings() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const menuService = new MenuService();
  const roleService = new RoleService();
  const service = new AccessSettingsService();
  const columns = [
    {
      dataIndex: "menuName",
      key: "menuName",
      title: "Menu Name",
      //sorter: (a, b) => a.menuName.localeCompare(b.menuName),
    },

    {
      dataIndex: "path",
      key: "path",
      title: "Path",
    },
  ];
  const getChildren = (list, parent) => {
    let filtered = list.filter((e) => e.parentId == parent);
    return filtered.map((e) => {
      let children = getChildren(list, e.menuId);
      if (children.length > 0) {
        return { ...e, children: children };
      } else return { ...e };
    });
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([
      menuService.list({ active: true }),
      roleService.list({ active: true }),
    ]).then((response) => {
      setLoading(false);
      let l = response[0].data.sort((a, b) => a.orderNumber - b.orderNumber);
      setMenuList(getChildren(l, null));
      setRoleList(response[1].data);
    });
  }, []);
  const onFinish = (value) => {
    setLoading(true);
    service
      .save({ ...value, menuIds: selectedRowKeys })
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRoleChange = (value) => {
    setLoading(true);
    service
      .list({ roleId: value })
      .then((response) => {
        setSelectedRowKeys(response.data?.map((e) => e.menuId));
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Page
      filter={
        <Form layout="inline" size="small" onFinish={onFinish}>
          <Form.Item
            name="roleId"
            rules={[{ required: true, message: "Please Select Role!" }]}
          >
            <Select
              placeholder="Role"
              style={{ minWidth: "150px" }}
              onChange={handleRoleChange}
            >
              {roleList?.map((e) => (
                <Select.Option value={e.roleId}>{e.roleName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Table
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          type: "checkbox",
          checkStrictly: false,
          fixed: true,
          onChange: (srks, selectedRows) => {
            setSelectedRowKeys(srks);
          },
          // onSelect: (record, selected, selectedRows, nativeEvent) => {
          //   console.log(record, selected, selectedRows, nativeEvent);
          //   setSelectedRowKeys(selectedRowKeys);
          // },
        }}
        pagination={{
          showSizeChanger: true,

          // //showQuickJumper: true,

          size: "default",
        }}
        scroll={{ x: 980 }}
        rowKey="menuId"
        loading={isLoading}
        dataSource={menuList}
        columns={columns}
        size="middle"
      />
    </Page>
  );
}

export default AccessSettings;
