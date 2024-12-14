import {
  Button,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import MenuUserService from "../../../../services/menu-user-services";
import RoleService from "../../../../services/role-service";
import UserAccessBulkService from "../../../../services/user-access-bulk-services";
import UserAccessService from "../../../../services/user-access-service";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
const CheckboxGroup = Checkbox.Group;
// const style = {
//   formItem: {
//     minWidth: "50px",
//   },
// };

class UserAccess extends PageList {
  access = { Add: false, Edit: false, Delete: false, View: false };
  service = new UserAccessService();
  menuService = new MenuUserService();
  roleService = new RoleService();
  useraccessbulkService = new UserAccessBulkService();
  title = "User Access Menu";
  selectedMenu = {};
  groupcheckbox = [
    { value: "Add", label: "ADD" },
    { value: "Edit", label: "EDIT" },
    { value: "View", label: "VIEW" },
    { value: "Delete", label: "DELETE" },
    { value: "Open", label: "Open" },
  ];

  handleMenuCheckboxChange = (e, record) => {
    const menuName = record.menuName;
    this.selectedMenu[menuName] = {
      ...this.selectedMenu[menuName],
      checked: e.target.checked,
    };
  };

  handleActionCheckboxChange = (checkedValues, record) => {
    const menuName = record.menuName;
    this.selectedMenu[menuName] = {
      ...this.selectedMenu[menuName],
      actions: checkedValues,
    };
  };

  handleNext = () => {
    let list = this.state.res;
    let arr = list
      ?.filter((e) => e.checked?.length > 0)
      .map((e) => ({
        roleId: this.state.selectedRoleId,
        menuId: e.menuId,
        feature: e.checked,
      }));

    this.useraccessbulkService
      .add(arr)
      .then((response) => {
        // console.log("Data successfully submitted:", response);
        message.success("UserAcess provided successfully");
        this.getrolefeatures(this.state.selectrole);
      })
      .catch((error) => {
        // console.error("Error occurred while submitting data:", error);
        message.error(
          "Error occurred while submitting data. Please try again."
        );
      });
  };

  list() {
    this.setState((state) => ({ ...state, roleLoading: true }));
    Promise.all([
      this.menuService.list(),
      this.roleService.list({
        active: true,
        roleId: this.state.selectedRoleId,
      }),
    ])
      .then((response) => {
        this.setState((state) => ({
          ...state,
          res: response[0].data,
          dup: response[0].data,
          role: response[1].data?.map((e) => ({
            value: e.roleId,
            label: e.roleName,
          })),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, roleLoading: false }));
      });
  }

  componentDidMount() {
    this.list();
    super.componentDidMount();
  }

  getrolefeatures = (roleId) => {
    this.setState({ selectedRoleId: roleId }, () => {
      Promise.all([
        this.service.list({ roleId }),
        this.menuService.list(),
      ]).then((response) => {
        const featuresList = response[0].data;
        const menuList = response[1].data;

        const updatedRes = this.state.dup?.map((e) => {
          const selectedFeature = featuresList.find(
            (k) => k.menuId === e.menuId
          );
          const checked = selectedFeature ? selectedFeature.feature : [];

          return {
            ...e,
            checked,
          };
        });

        this.setState((state) => ({
          ...state,
          selectrole: roleId,
          featureslist: featuresList,
          res: updatedRes,
          dup: menuList,
        }));
      });
    });
  };

  selectall = (list, index, record, value) => {
    let arr = [...this.state.res];
    let obj = {
      menuName: record?.menuName,
      feature: record?.feature,
      menuId: record?.menuId,
      pageId: record?.pageId,
      parentId: record?.parentId,
      checked: value.target.checked ? list : [],
    };
    arr.splice(index, 1, obj);
    // console.log(arr);
    this.setState((state) => ({
      ...state,
      res: arr,
    }));
  };

  uncheck = (list, index, record) => {
    let arr = [...this.state.res];
    let obj = {
      menuName: record?.menuName,
      feature: record?.feature,
      menuId: record?.menuId,
      pageId: record?.pageId,
      parentId: record?.parentId,
      checked: list,
    };
    arr.splice(index, 1, obj);
    // console.log(arr);
    this.setState((state) => ({
      ...state,
      res: arr,
    }));
  };

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "SNO",
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "menuName",
      key: "menuName",
      title: "Menu",
      align: "left",
      width: "300px",
      render: (value, record, index) => {
        const isDropdownSelected =
          this.state.selectrole !== undefined && this.state.selectrole !== null;
        const isCheckboxDisabled = !isDropdownSelected;

        return (
          <>
            <Row>
              <Space>
                <Col>
                  <Checkbox
                    indeterminate={
                      record.checked?.length === 0
                        ? false
                        : record.checked?.length < record.feature.length
                    }
                    checked={record.checked?.length === record.feature.length}
                    onChange={(v) =>
                      this.selectall(record.feature, index, record, v)
                    }
                    disabled={isCheckboxDisabled}
                  />
                </Col>
                <Col>
                  <Typography>{value}</Typography>
                </Col>
              </Space>
            </Row>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "feature",
      render: (value, record, index) => {
        const isDropdownSelected =
          this.state.selectrole !== undefined && this.state.selectrole !== null;
        const isCheckboxDisabled = !isDropdownSelected;
        const checklist = record.feature;

        return (
          <>
            <Checkbox.Group
              options={checklist}
              value={isDropdownSelected ? record.checked : []}
              onChange={(v) => this.uncheck(v, index, record)}
              disabled={isCheckboxDisabled}
            />
          </>
        );
      },
    },
  ];

  render() {
    const { selectrole, res, role } = this.state;
    // console.log(this.state.res);
    const isDropdownSelected = selectrole !== undefined && selectrole !== null;
    return (
      <>
        <Page title={this.title}>
          <br></br>

          <Form>
            <Form.Item name="roleName" style={{ width: "150px" }}>
              <Select
                onChange={(v) => this.getrolefeatures(v)}
                showSearch
                loading={this.state.isRoleListLoading}
                placeholder="Role"
                // allowClear
                options={this.state.role}
              ></Select>
            </Form.Item>
          </Form>

          <Table
            bordered
            rowKey="ahid"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="small"
            pagination={false}
          />
          <br />

          <Row justify="end">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleNext}
                disabled={!isDropdownSelected}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Page>
      </>
    );
  }
}

export default withAuthorization(UserAccess);
