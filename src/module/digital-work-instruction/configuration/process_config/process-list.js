import { SearchOutlined } from "@ant-design/icons";
import ProcessListService from "../../../../services/digital-work-instruction-service/process-list-service";
import PageList from "../../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
  AddButton,
} from "../../../../utils/action-button/action-button";
import { Col, Input, Row, Table } from "antd";
import { withRouter } from "../../../../utils/with-router";
import ProcessForm from "./process-form";
import Page from "../../../../utils/page/page";

class ProcessList extends PageList {
  service = new ProcessListService();
  // userAccessService = new UserAccessService();

  title = "Process / Operation";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 0,
    },
    {
      dataIndex: "processName",
      key: "processName",
      title: "Process Name",
      align: "left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "center",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "processId",
      key: "processId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton
              // hidden={this.access.View}
              onClick={() => this.view(value)}
            />
            <EditButton
              // hidden={this.access.Edit}
              onClick={() => this.edit(value)}
            />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.rows.filter((e) => {
      return e.processName?.toLowerCase().includes(s);
    });
    this.setState((state) => ({ ...state, res: res }));
  };

  render() {
    return (
      <Page
        title="Process / Operation"
        action={<AddButton onClick={() => this.add()} />}
      >
        <Row justify="space-between">
          <Col span={24}>
            <Input
              prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
              onInput={this.filter}
              placeholder="Search..."
              bordered={true}
            />
          </Col>
        </Row>
        <br />
        <Table
          rowKey="checkTypeId"
          loading={this.state.isLoading}
          dataSource={this.state.res}
          columns={this.columns}
          size="middle"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
        />
        <ProcessForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}

export default withRouter(ProcessList);
