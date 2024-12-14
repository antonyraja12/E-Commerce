import { Col, Form, Input, Row, Table } from "antd";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import LocationForm from "./location-form";
import { appHierarchyPageId } from "../../../helpers/page-ids";
import { withAuthorization } from "../../../utils/with-authorization";
import LocationService from "../../../services/preventive-maintenance-services/location-service";
import { withRouter } from "../../../utils/with-router";
import { SearchOutlined } from "@ant-design/icons";

class Location extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  form = LocationForm;
  //   pageId = appHierarchyPageId;
  service = new LocationService();
  // userAccessService = new UserAccessService();
  title = "Location";
  componentDidMount() {
    this.list();
  }
  columns = [
    {
      dataIndex: "locationName",
      key: "locationName",
      title: "Location Name",
      align: "left",
      sorter: (a, b) => {
        a = a.locationName || "";
        b = b.locationName || "";
        return a.localeCompare(b);
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
      dataIndex: "locationId",
      key: "locationId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {this.props.access[0]?.includes("view") && (
              <ViewButton onClick={() => this.view(value)} />
            )}
            {this.props.access[0]?.includes("edit") && (
              <EditButton onClick={() => this.edit(value)} />
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  resetSearchInput = () => {
    this.setState({ searchValue: "" });
  };
  handleData(data) {
    return this.service.convertToTree(data);
  }

  // filter = (event) => {
  //   let s = event.target.value.toLowerCase().trim();
  //   let res = this.state.rows.filter((e) => {
  //     return e.locationName?.toLowerCase().includes(s);
  //   });

  //   this.setState({ searchValue: s, res });
  // };

  filter = (event) => {
    let s = event.target.value.toLowerCase();

    const searchNested = (obj, keyword) => {
      if (typeof obj !== "object" || obj === null) {
        return false;
      }

      for (let key in obj) {
        if (
          typeof obj[key] === "string" &&
          obj[key].toLowerCase().includes(keyword)
        ) {
          return true;
        }
        if (typeof obj[key] === "object" && searchNested(obj[key], keyword)) {
          return true;
        }
      }
      return false;
    };

    let res = this.state.rows.filter((e) => {
      return searchNested(e, s);
    });

    this.setState({ searchValue: s, res });
  };

  onClose = (data) => {
    this.setState(
      { ...this.state, popup: { open: false }, popup1: { open: false } },
      () => {
        if (data) {
          this.list();
        }
        this.resetSearchInput();
      }
    );
  };

  render() {
    console.log("sta", this.state);
    return (
      <>
        <Page
          title={this.title}
          action={
            <>
              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </>
          }
        >
          <Row justify="space-between">
            <Col span={24}>
              <Form>
                <Form.Item>
                  <Input
                    prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                    onInput={this.filter}
                    value={this.state.searchValue}
                    placeholder="Search..."
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <br />
          <Table
            bordered
            rowKey="locationId"
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
          {this.state.popup?.open && (
            <this.form {...this.state.popup} close={this.onClose} />
          )}
        </Page>
      </>
    );
  }
}

export default withRouter(withAuthorization(Location));
