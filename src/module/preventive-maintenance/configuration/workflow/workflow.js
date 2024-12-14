import { Spin, Table } from "antd";
import WorkflowService from "../../../../services/preventive-maintenance-services/work-flow-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
import WorkflowForm from "./workflow-form";

class Workflow extends PageList {
  service = new WorkflowService();
  title = "Workflow";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 0,
    },
    {
      dataIndex: "workflowName",
      key: "workflowName",
      title: "Workflow Name",
      align: "left",
    },
    {
      dataIndex: "workflowType",
      key: "workflowType",
      title: "Workflow Type",
      align: "left",
    },
    {
      dataIndex: "frequency",
      key: "frequency",
      title: "Frequency",
      align: "left",
    },
    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      align: "center",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "workflowId",
      key: "workflowId",
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
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={<AddButton onClick={() => this.add()} />}
        >
          <Table
            rowKey="workflowId"
            // bordered
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
          <WorkflowForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withAuthorization(Workflow);
