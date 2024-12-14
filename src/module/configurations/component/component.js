import FloorService from "../../../services/floor-service";
import ComponentService from "../../../services/asset-component service";
import PageList from "../../../utils/page/page-list";
import { remoteAsset } from "../../../helpers/url";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import ComponentForm from "./component-form";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import { Table, Avatar, message } from "antd";
import { withForm } from "../../../utils/with-form";

class Component extends PageList {
  service = new ComponentService();

  title = "Component";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
    },

    {
      dataIndex: "componentName",
      key: "componentName",
      title: "Component Name",
      align: "left",
      //width:10,
    },

    {
      dataIndex: "componentId",
      key: "componentId",
      title: "Action",
      width: 160,
      // headeralign:"center",
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
          rowKey="componentId"
          pagination={{
            showSizeChanger: true,

            // //showQuickJumper: true,

            size: "default",
          }}
          scroll={{ x: 980 }}
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="middle"
        />
        <ComponentForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}

export default withForm(Component);
