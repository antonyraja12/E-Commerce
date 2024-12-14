import { Table } from "antd";
import GatewayService from "../../../services/gateway-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import KepwareForm from "./kepwareform";
import KepwareService from "../../../services/kepware-service ";

class Kepware extends PageList {
  service = new KepwareService();
  title = "Kepware Connection";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
    },
    {
      dataIndex: "kepwareName",
      key: "kepwareName",
      title: "Kepware Name",
      sorter: (a, b) => a.kepwareName.localeCompare(b.kepwareName),
    },

    {
      dataIndex: "port",
      key: "port",
      title: "Port ",
    },

    {
      dataIndex: "ip",
      key: "ip",
      title: "IP Address ",
      // sorter: (a, b) => a.userId.localeCompare(b.userId),
    },
    {
      dataIndex: "userName",
      key: "userName",
      title: "User Name",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status ",
      align: "left",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },

    {
      dataIndex: "kepwareId",
      key: "kepwareId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton onClick={() => this.edit(value)} />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];

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
          scroll={{ x: 980 }}
          rowKey="kepwareId"
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="middle"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
        />
        <KepwareForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}

export default Kepware;
