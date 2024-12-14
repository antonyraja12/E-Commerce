import {
  CloseOutlined,
  InfoCircleOutlined,
  LockFilled,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React from "react";
import {
  Col,
  Input,
  Row,
  Table,
  message,
  Button,
  Tag,
  Tooltip,
  Modal,
  Form,
  Card,
  Divider,
  Space,
  Spin,
  Result,
} from "antd";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import RoleService from "../../../services/role-service";
import UserService from "../../../services/user-service";
import { Link } from "react-router-dom";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { withAuthorization } from "../../../utils/with-authorization";
import UserForm from "./user-form";
import PageList from "../../../utils/page/page-list";
import Page from "../../../utils/page/page";
import TagsCell from "../../../component/TagCell";
import UserGroupService from "../../../services/user-group-service";
import { FaLock, FaLockOpen, FaUserLock } from "react-icons/fa6";
import { MdLockReset } from "react-icons/md";
import { response } from "msw";
import { RefreshOutlined } from "@material-ui/icons";
import { validateName, validatePassword } from "../../../helpers/validation";
import ResetPassword from "./reset-password";
import { withRouter } from "../../../utils/with-router";
import { BiReset } from "react-icons/bi";

// import TagsCell from "../user-group/tag-cell";

class User extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  roleService = new RoleService();
  appHierarchyService = new AppHierarchyService();
  userGroupService = new UserGroupService();
  title = "User";

  componentDidMount() {
    Promise.all([this.appHierarchyService.list({ active: true })]).then(
      (response) => {
        this.setState((state) => ({
          ...state,
          appHeirarchyData: response[0].data,
        }));
      }
    );
    this.fetchData();
    super.componentDidMount();
    this.loadUserGroup();
    this.service
      .getCurrentUser()
      .then((response) =>
        this.setState((state) => ({ ...state, currentUser: response.data }))
      );
  }

  fetchData = () => {
    Promise.all([this.roleService.list(), this.service.list()])
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
  };

  loadUserGroup = () => {
    this.userGroupService.list({ status: true }).then((response) => {
      this.setState((state) => ({ ...state, userGroupDate: response.data }));
    });
  };
  mapUserGroupNames = (userGroupMappings, userGroupDate) => {
    const userGroupIds = userGroupDate?.map((e) => e.userGroupId);

    return Array.isArray(userGroupMappings)
      ? userGroupMappings
          .filter((groupId) => userGroupIds?.includes(groupId))
          .map((groupId) => {
            const matchingUserGroup = userGroupDate?.find(
              (group) => group.userGroupId === groupId
            );

            return matchingUserGroup && matchingUserGroup.userGroupName
              ? matchingUserGroup.userGroupName
              : null;
          })
      : [];
  };

  service = new UserService();

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 0,
      align: "Left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "userName",
      key: "userName",
      title: "User Name",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (value, record) => {
        const icon = record.locked ? (
          <FaUserLock style={{ color: "red", fontSize: "24px" }} />
        ) : (
          ""
        );
        const textColor = record.locked ? "red" : "";
        return (
          <span style={{ color: textColor }}>
            <Space>
              {icon}
              {value}
            </Space>
          </span>
        );
      },
    },
    {
      dataIndex: "roleId",
      key: "roleId",
      title: "Role",
      sorter: (a, b) => {
        const nameA = this.getName(a.roleId);
        const nameB = this.getName(b.roleId);
        return nameA.localeCompare(nameB);
      },
      render: (value) => {
        return this.getName(value);
      },
    },
    // {
    //   dataIndex: "ahid",
    //   key: "ahid",
    //   title: "Entity",
    //   render: (value) => {
    //     const appheir = this.state.appHeirarchyData?.find(
    //       (e) => e.ahid === value
    //     );
    //     return appheir ? appheir.ahname : null;
    //   },
    // },
    {
      dataIndex: "userGroupMappings",
      key: "userGroupMappings",
      title: "Group",
      width: 140,
      render: (value, record) => {
        const tags = this.mapUserGroupNames(value, this.state.userGroupDate);
        return (
          <TagsCell
            tags={tags.map((userGroupName) => ({
              userGroupName,
              userGroupName,
            }))}
            keyName="userGroupName"
            valueName="userGroupName"
          />
        );
      },
    },
    {
      dataIndex: "email",
      key: "email",
      title: "E-mail",
      sorter: (a, b) => {
        a = a.email || "";
        b = b.email || "";
        return a.localeCompare(b);
      },
    },
    {
      dataIndex: "contactNumber",
      key: "contactNumber",
      title: "Mobile No",
      sorter: (a, b) => {
        return a.contactNumber - b.contactNumber;
      },
    },
    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "userId",
      key: "userId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        // console.log("value", value, record.userName);
        const buttonColor = record.locked ? "red" : "green";
        return (
          <>
            {record.userName === "Administrator" ? (
              <>
                <Space>
                  {this.props.access[0]?.includes("view") && (
                    <ViewButton onClick={() => this.view(value)} />
                  )}
                  {this.props.access[0]?.includes("reset") && (
                    <Tooltip title="Reset Password">
                      <BiReset
                        style={{
                          color: buttonColor,
                          fontSize: "20px",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        onClick={() => {
                          this.add1(record.userId);
                        }}
                      />
                    </Tooltip>
                  )}
                </Space>
              </>
            ) : (
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
                {/* {this.state.currentUser?.userId === 2 && ( */}
                {this.props.access[0]?.includes("reset") && (
                  <Tooltip title="Reset Password">
                    {" "}
                    <BiReset
                      style={{
                        color: buttonColor,
                        fontSize: "20px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={() => {
                        this.add1(record.userId);
                      }}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];
  getName = (id) => {
    let e = this.state.role?.find((e) => e.roleId == id);
    return e ? e.roleName : "";
  };
  filter = (event) => {
    let s = event.target.value.toLowerCase();
    let res = this.state.rows.filter((e) => {
      return (
        e.userName?.toLowerCase().includes(s) ||
        e.contactNumber?.toLowerCase().includes(s)
      );
    });
    this.setState({ searchValue: s, res });
  };

  add1(id) {
    this.setState({
      ...this.state,
      popup1: {
        open: true,
        mode: "Add",
        userId: id,
        disabled: false,
      },
    });
  }
  resetSearchInput = () => {
    this.setState({ searchValue: "" });
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
  onClose1 = (data) => {
    this.setState({ ...this.state, popup1: { open: false } }, () => {
      if (data) {
        this.fetchData();
      }
    });
  };

  render() {
    const { access, isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }
    console.log(this.props, "props");
    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            <React.Fragment>
              <Link to="uploaduser">
                {this.props.access[0]?.includes("add") && (
                  <Button
                    style={{ marginRight: "10px" }}
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>
                )}
              </Link>

              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </React.Fragment>
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
            size="small"
            bordered
          />

          <UserForm {...this.state.popup} close={this.onClose} />

          <ResetPassword {...this.state.popup1} close={this.onClose1} />
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(User));
