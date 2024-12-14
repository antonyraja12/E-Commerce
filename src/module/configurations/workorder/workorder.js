import WorkOrderService from "../../../services/workorder-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import { Table } from "antd";

class WorkOrder extends PageList {
  service = new WorkOrderService();
  title = "Work Order List";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
      align: "Left",
    },

    {
      dataIndex: "workorderdescription",
      key: "workorderdescription",
      title: "Work Order Description",
    },
    {
      dataIndex: "createddate",
      key: "createddate",
      title: "Created Date",
    },
    {
      dataIndex: "intiatedby",
      key: "initiatedby",
      title: "Initiated By",
    },
    {
      dataIndex: "stage",
      key: "stage",
      title: "Stage",
    },
  ];

  render() {
    return (
      <Page title={this.title}>
        <Table
          rowKey=""
          pagination={{
            showSizeChanger: true,

            //showQuickJumper: true,

            size: "default",
          }}
          scroll={{ x: 980 }}
          bordered
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="small"
        />
      </Page>
    );
  }
}

export default WorkOrder;
