import React, { Component, useState } from "react";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { Link } from "react-router-dom";
import UserForm from "./usergroupform";
import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import {
  Table,
  Input,
  Space,
  Row,
  Col,
  Tag,
  message,
  Button,
  Spin,
  Result,
  Form,
} from "antd";
import RoleService from "../../../services/role-service";
import { SearchOutlined } from "@ant-design/icons";
import { withAuthorization } from "../../../utils/with-authorization";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import UserGroupService from "../../../services/user-group-service";
import UserService from "../../../services/user-service";
import TagsCell from "../user-group/tag-cell";
import { index } from "d3";
import { withRouter } from "../../../utils/with-router";

// import TagsCell from "./tag-cell";

class UserGroup extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  roleService = new RoleService();
  userService = new UserService();

  appHierarchyService = new AppHierarchyService();

  componentDidMount() {
    Promise.all([this.appHierarchyService.list({ active: true })]).then(
      (response) => {
        this.setState((state) => ({
          ...state,
          appHeirarchyData: response[0].data,
        }));
      }
    );

    Promise.all([this.userService.list({ active: true }), this.service.list()])
      .then((response) => {
        let changes = this.handleData(response[1].data);
        this.setState((state) => ({
          ...state,
          role: response[0].data,
          rows: changes,
          res: changes,
        }));
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });

    super.componentDidMount();
  }

  service = new UserGroupService();
  title = "User Group";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      align: "Left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "userGroupName",
      key: "userGroupName",
      title: "User Group",
      width: 250,
      sorter: (a, b) => a.userGroupName?.localeCompare(b.userGroupName),
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 250,
      // sorter: (a, b) => a.userGroup.localeCompare(b.userGroup),
    },
    {
      dataIndex: "userMappings",
      key: "userMappings",
      title: "Users",
      // width: 250,

      render: (value) => {
        // console.log("val", value.userLists?.userName);
        return (
          <div>
            {
              <TagsCell
                tags={value}
                keyName="userLists?.userName"
                valueName="userLists?.userName"
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
      width: 200,
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "userGroupId",
      key: "userGroupId",
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

  getName = (id) => {
    let e = this.state.role?.find((e) => e.roleId === id);
    return e ? e.roleName : "";
  };

  filter = (event) => {
    let s = event.target.value.toLowerCase();

    // console.log("Search value: ", s);
    let res = this.state.rows.filter((e) => {
      return (
        e.userGroupName?.toLowerCase().startsWith(s) ||
        e.userName?.toLowerCase().startsWith(s)
      );
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

  resetSearchInput = () => {
    this.setState({ searchValue: "" });
  };
  render() {
    // console.log("this", this.state);z
    const { access, isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
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
            onRow={(record, index) => {
              return {
                "data-testid": "row",
              };
            }}
            rowKey="userId"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
          />

          <UserForm {...this.state.popup} close={this.onClose} />
          {/* <br />
          <Link to={"/settings/user"} state={this.props.location.state}>
            <Button>Back</Button>
          </Link> */}
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(UserGroup));
