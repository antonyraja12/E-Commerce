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
import ModuleSelectionService from "../../../services/preventive-maintenance-services/module-selection-service";
import { withAuthorization } from "../../../utils/with-authorization";
import ModuleSelectionForm from "./module-selection-form";
import TagCell from "../../../component/TagCell";
import TagsCell from "../../../component/TagCell";
class ModuleSelection extends PageList {
  form = ModuleSelectionForm;
  service = new ModuleSelectionService();
  apphierarchyservice = new AppHierarchyService();
  title = "Module Selection";

  componentDidMount() {
    this.list();
  }
  columns = [
    {
      dataIndex: "appHierarchy",
      key: "appHierarchy",
      title: "Entity",
      align: "left",
      render: (value) => {
        // console.log(value?.ahname, "Entity");
        return value?.ahname;
      },
    },
    {
      dataIndex: "moduleName",
      key: "moduleName",
      title: "Module Selection",
      align: "left",
      render: (value) => {
        // console.log("val", value);
        return (
          <div>
            {
              <TagsCell
                tags={value.map((moduleName) => ({ moduleName, moduleName }))}
                keyName="moduleName"
                valueName="moduleName"
              />
            }
          </div>
        );
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "center",
      width: "150px",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "moduleSelectionId",
      key: "moduleSelectionId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        // console.log("vaaaalueeee", value);
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

  render() {
    // console.log("Edit value:", this.state.res);
    return (
      <>
        <Page
          title={this.title}
          action={<AddButton onClick={() => this.add()} />}
        >
          <Table
            bordered
            rowKey="moduleSelectionId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="small"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
          />
          <ModuleSelectionForm {...this.state.popup} close={this.onClose} />
        </Page>
      </>
    );
  }
}

export default withAuthorization(ModuleSelection);
