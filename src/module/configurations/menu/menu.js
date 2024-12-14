import { CopyOutlined } from "@ant-design/icons";
import Page from "../../../utils/page/page";
import { Button, Col, Form, Row, Table } from "antd";
import { withForm } from "../../../utils/with-form";
import MenuService from "../../../services/menu-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
  AddButton,
} from "../../../utils/action-button/action-button";
import MenuForm from "./menu-form";
import { connect } from "react-redux";
import { menuRefresh } from "../../../store/actions";

class Menu extends PageList {
  service = new MenuService();

  title = "Menu";
  columns = [
    {
      dataIndex: "menuName",
      key: "menuName",
      title: "Menu Name",
      //sorter: (a, b) => a.menuName.localeCompare(b.menuName),
    },
    {
      dataIndex: "icon",
      key: "icon",
      title: "Icon",
      //sorter: (a, b) => a.icon.localeCompare(b.icon),
    },
    {
      dataIndex: "path",
      key: "path",
      title: "Path",
    },
    {
      dataIndex: "orderNumber",
      key: "orderNumber",
      title: "Order No",
    },
    // {
    //   dataIndex: "parentId",
    //   key: "parentId",
    //   title: "Parent",
    // },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "menuId",
      key: "menuId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Button
              onClick={() => this.duplicate(value)}
              icon={<CopyOutlined />}
            ></Button>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton onClick={() => this.edit(value)} />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];
  async delete(id) {
    try {
      await super.delete(id);
      this.props.menuRefresh(true);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }
  duplicate(id) {
    this.setState({
      ...this.state,
      popup: {
        open: true,
        mode: "Duplicate",
        title: `Duplicate ${this.title}`,
        id: id,
        disabled: false,
      },
    });
  }
  children(list, parent) {
    let filtered = list.filter((e) => e.parentId == parent);
    return filtered.map((e) => {
      let children = this.children(list, e.menuId);
      if (children.length > 0) {
        return { ...e, children: children };
      } else return { ...e };
    });
  }
  handleData(list) {
    let l = list.sort((a, b) => a.orderNumber - b.orderNumber);
    return this.children(l, null);
  }

  render() {
    return (
      <Page
        title={this.title}
        action={
          <>
            <AddButton onClick={() => this.add()} />
          </>
        }
      >
        <Table
          pagination={{ showSizeChanger: true }}
          rowKey="menuId"
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="middle"
        />
        {this.state.popup?.open && (
          <MenuForm {...this.state.popup} close={this.onClose} />
        )}
      </Page>
    );
  }
}
const mapDispatchToProps = {
  menuRefresh: menuRefresh,
};
export default connect(null, mapDispatchToProps)(withForm(Menu));
