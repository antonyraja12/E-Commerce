import { Table } from "antd";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import AppHierarchyStructureService from "../../../../services/app-hierarchy/app-hierarchy-structure-service";
import AppHierarchyStructureForm from "./app-hierarchy-structure-form";
import { AppHierarchyStructure_Pageid } from "../../../../helpers/page-id-mapping";
import UserAccessService from "../../../../services/user-access-service";

class AppHierarchyStructure extends PageList {
  pageId = AppHierarchyStructure_Pageid;
  form = AppHierarchyStructureForm;
  service = new AppHierarchyStructureService();
  userAccessService = new UserAccessService();
  title = "App Hierarchy Structure";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: "80px",
    },
    {
      dataIndex: "asName",
      key: "asName",
      title: "Name",
      align: "left",
    },

    {
      dataIndex: "level",
      key: "level",
      title: "Level",
      align: "left",
      width: "100px",
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
      dataIndex: "asId",
      key: "asId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton
              hidden={this.access.View}
              onClick={() => this.view(value)}
            />
            <EditButton
              hidden={this.access.Edit}
              onClick={() => this.edit(value)}
            />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.list();
    this.userAccessService.rolefilter().then((response) => {
      // console.log(
      //   this.setState((state) => ({
      //     ...state,
      //     roleFeature: response.data.find((e) => e.pageId === this.pageid)
      //       .feature,
      //   }))
      // );
      var feature = response.data.find((e) => e.pageId === this.pageid).feature;
      for (let i = 0; i < feature.length; i++) {
        if (feature[i] == "Add") {
          this.access.Add = false;
        }
        if (feature[i] == "Edit") {
          this.access.Edit = false;
        }
        if (feature[i] == "View") {
          this.access.View = false;
        }
        if (feature[i] == "Delete") {
          this.access.Delete = false;
        }
      }
    });
  }

  render() {
    return (
      <>
        <Page
          title={this.title}
          action={
            <AddButton hidden={this.access.Add} onClick={() => this.add()} />
          }
          //   filter={
          // <Input
          //   prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
          //   onInput={this.filter}
          //   placeholder="Search..."
          //   bordered={false}
          // />
          //   }
        >
          <Table
            bordered
            rowKey="asid"
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
          <this.form {...this.state.popup} close={this.onClose} />
        </Page>
      </>
    );
  }
}

export default AppHierarchyStructure;
