import { Row, Table } from "antd";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
// import AppHierarchyForm from "./app-hierarchy-form";
import { appHierarchyPageId } from "../../../helpers/page-ids";
import { withAuthorization } from "../../../utils/with-authorization";
import EntityHeirarchyForm from "./entity-heirarchy-form";

class EntityHeirarchy extends PageList {
  form = EntityHeirarchyForm;
  pageId = appHierarchyPageId;
  service = new AppHierarchyService();
  // userAccessService = new UserAccessService();
  title = "Entity";
  componentDidMount() {
    this.list();
  }
  columns = [
    {
      dataIndex: "ahname",
      key: "ahname",
      title: "Name",
      align: "left",
    },

    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      align: "center",
      width: "150px",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "ahid",
      key: "ahid",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {this.props.view || <ViewButton onClick={() => this.view(value)} />}
            {this.props.edit || <EditButton onClick={() => this.edit(value)} />}
            {this.props.delete || (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];
  handleData(data) {
    return this.service.convertToTree(data);
  }

  render() {
    return (
      <>
        <Page
          title={this.title}
          action={
            <>{this.props.add || <AddButton onClick={() => this.add()} />}</>
          }
        >
          <Table
            bordered
            rowKey="ahid"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="small"
            pagination={{
              showSizeChanger: true,

              // //showQuickJumper: true,

              size: "default",
            }}
          />
          <this.form {...this.state.popup} close={this.onClose} />
        </Page>
      </>
    );
  }
}

export default withAuthorization(EntityHeirarchy);
