import { Button, Col, Form, Input, Result, Row, Spin, Table } from "antd";
import CheckService from "../../../../services/inspection-management-services/check-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import CheckForm from "./check-form";

import UserAccessService from "../../../../services/user-access-service";
import { checkPageId } from "../../../../helpers/page-ids";
import { withAuthorization } from "../../../../utils/with-authorization";
import Checks from "./check copy";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withRouter } from "../../../../utils/with-router";
class Check extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }
  form = CheckForm;
  pageId = checkPageId;
  service = new CheckService();
  userAccessService = new UserAccessService();
  title = "Check";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 0,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "checkName",
      key: "checkName",
      title: "Check Name",
      align: "left",
      width: "220px",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
    },
    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      align: "left",
    },
    {
      dataIndex: "active",
      key: "active",
      title: "Status",
      align: "center",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "checkId",
      key: "checkId",
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

  filter = (event) => {
    let s = event.target.value.toLowerCase();
    let res = this.state.rows.filter((e) => {
      return e.checkName?.toLowerCase().includes(s);
    });
    this.setState({ searchValue: s, res });
  };
  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={<>{this.title}</>}
          action={
            this.props.access[0]?.includes("add") && (
              <AddButton onClick={() => this.add()} />
            )
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
            rowKey="checkId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
            pagination={{
              showSizeChanger: true,

              size: "default",
            }}
          />

          <this.form {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(Check));
