import React from "react";
import RoleService from "../../../services/role-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import { Link } from "react-router-dom";
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
import DynamicDashboardConfigurationService from "../../../services/dynamic-dashboard-configuration-service";
import DynamicDashboardConfigurationForm from "./dynamic-dashboard-configuration-form";

class DynamicDashboardConfiguration extends PageList {
  service = new DynamicDashboardConfigurationService();

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

  title = "Dynamic Dashboard Configuration";

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
      dataIndex: "dynamicDashboardName",
      key: "dynamicDashboardName",
      title: "Parameter Name",
      sorter: (a, b) =>
        a.dynamicDashboardName.localeCompare(b.dynamicDashboardName),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return value === true ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "dynamicDashboardConfigurationId",
      key: "dynamicDashboardConfigurationId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {<ViewButton onClick={() => this.view(value)} />}
            {<EditButton onClick={() => this.edit(value)} />}
            {<DeleteButton onClick={() => this.delete(value)} />}
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
        e.dynamicDashboardName?.toLowerCase().includes(s)
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
          action={<>{<AddButton onClick={() => this.add()} />}</>}
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
            rowKey="dynamicDashboardConfigurationId"
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
          <DynamicDashboardConfigurationForm
            {...this.state.popup}
            close={this.onClose1}
          />
          {/* <br />
          <Link to={"/settings/user"} state={this.props.location.state}>
            <Button>Back</Button>
          </Link> */}
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(DynamicDashboardConfiguration));
