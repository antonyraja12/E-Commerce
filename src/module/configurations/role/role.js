import React from "react";
import RoleService from "../../../services/role-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { Link } from "react-router-dom";
import RoleForm from "./roleform";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import {
  Table,
  Row,
  Col,
  Input,
  message,
  Button,
  Spin,
  Result,
  Form,
} from "antd";
import { withAuthorization } from "../../../utils/with-authorization";
import { SearchOutlined } from "@ant-design/icons";
import { withRouter } from "../../../utils/with-router";

class Role extends PageList {
  service = new RoleService();

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      originalRows: [],
      isLoading: false,
    };
    this.searchInput = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });

    this.service
      .list()
      .then((response) => {
        this.setState({
          rows: response.data,
          originalRows: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        message.error("Error fetching data");
        this.setState({ isLoading: false });
      });
  };

  title = "Role";

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "roleName",
      key: "roleName",
      title: "Role Name",
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
    },
    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      render: (value) => {
        return !!value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "roleId",
      key: "roleId",
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

  filter = () => {
    const searchValue = this.formRef.current.getFieldValue("search");
    const s = searchValue.toLowerCase().trim();
    if (s === "") {
      this.setState({ rows: this.state.originalRows });
    } else {
      const rows = this.state.originalRows.filter((e) =>
        e.roleName?.toLowerCase().includes(s)
      );
      this.setState({ rows });
    }
  };

  resetSearchInput = () => {
    this.formRef.current.resetFields(); // Reset form fields
    this.setState({ rows: this.state.originalRows });
  };

  onClose1 = () => {
    this.onClose();
    this.fetchData();
    this.resetSearchInput(); // Reset the search input value
  };

  render() {
    const { access, isLoading } = this.props;
    console.log("acess", access);

    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            <>
              {/* {this.props.access[0]?.includes("add") && (
                <Link to="/settings/user-access">
                  <Button style={{ marginRight: "10px" }}>User Access</Button>
                </Link>
              )} */}
              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </>
          }
        >
          <Row justify="space-between">
            <Col span={24}>
              <Form ref={this.formRef} onValuesChange={this.filter}>
                <Form.Item name="search">
                  <Input
                    prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                    placeholder="Search..."
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
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
              //showQuickJumper: true,
              size: "default",
            }}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="small"
            bordered
          />
          <RoleForm {...this.state.popup} close={this.onClose1} />
          {/* <br />
          <Link to={"/settings/user"} state={this.props.location.state}>
            <Button>Back</Button>
          </Link> */}
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(Role));
