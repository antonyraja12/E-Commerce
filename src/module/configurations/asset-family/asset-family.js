import RoleService from "../../../services/role-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
// import RoleForm from "./roleform";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import { Table, Row, Col, Input, message } from "antd";
import { withAuthorization } from "../../../utils/with-authorization";
import { SearchOutlined } from "@ant-design/icons";
import AssetFamilyForm from "./asset-family-form";
import AssetFamilyService from "../../../services/asset-family-service";
class AssetFamily extends PageList {
  service = new AssetFamilyService();
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });

    this.service
      .list()
      .then((response) => {
        // console.log("response.data", response.data);
        this.setState({
          rows: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        message.error("Error fetching data");
        this.setState({ isLoading: false });
      });
  };

  title = "Asset Family";
  columns = [
    {
      dataIndex: "Sno",
      key: "sno",
      title: "S.No",
      width: 80,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "assetFamilyName",
      key: "assetFamilyName",
      title: "AssetFamily",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return !!value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "assetFamilyId",
      key: "assetFamilyId",
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

  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();

    // If the search input is empty, show the full data without filtering
    if (s === "") {
      this.setState({ rows: this.state.originalRows });
    } else {
      // If the search input is not empty, perform the filtering
      let rows = this.state.originalRows.filter((e) => {
        return e.roleName?.toLowerCase().includes(s);
      });
      this.setState({ rows: rows });
    }
  };

  render() {
    return (
      <Page
        title={this.title}
        action={
          <>{this.props.add || <AddButton onClick={() => this.add()} />}</>
        }
      >
        <br />
        <Table
          onRow={(record, index) => {
            return {
              "data-testid": "row",
            };
          }}
          rowKey="roleId"
          pagination={{
            showSizeChanger: true,

            // //showQuickJumper: true,

            size: "default",
          }}
          scroll={{ x: 980 }}
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="small"
          bordered
        />
        <AssetFamilyForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}

export default withAuthorization(AssetFamily);
