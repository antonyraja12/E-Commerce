import { Table } from "antd";
import ModelMasterConfigurationService from "../../../services/oee/model-master-configuration-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import ModelMasterConfigurationForm from "./model-master-configuration-form";

class ModelMasterConfigurationList extends PageList {
  service = new ModelMasterConfigurationService();
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  title = "Model Master Configuration";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
    },

    {
      dataIndex: "modelName",
      key: "modelName",
      title: "Model Name",
    },
    {
      dataIndex: "modelNumber",
      key: "modelNumber",
      title: "Model Number",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },

    {
      dataIndex: "modelMasterId",
      key: "modelMasterId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value) => {
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
          pagination={{
            showSizeChanger: true,

            //showQuickJumper: true,

            size: "default",
          }}
          loading={this.state.isLoading}
          columns={this.columns}
          dataSource={this.state.res}
          size="medium"
          bordered
        />

        <ModelMasterConfigurationForm
          {...this.state.popup}
          close={this.onClose}
        />
      </Page>
    );
  }
}

export default ModelMasterConfigurationList;
