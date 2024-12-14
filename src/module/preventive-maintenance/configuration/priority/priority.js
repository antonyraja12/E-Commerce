import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Spin, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import PriorityService from "../../../../services/preventive-maintenance-services/priority-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";
import PriorityForm from "./priority-form";

class Prioirty extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  service = new PriorityService();

  componentDidMount() {
    super.componentDidMount();
  }

  title = "Priority";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      // width: 20,
      align: "Left",
    },
    {
      dataIndex: "priorityGroupName",
      key: "priorityset",
      title: "Priority Set",
      // width: 100,
      align: "Left",
      sorter: (a, b) => a.priorityGroupName?.localeCompare(b.priorityGroupName),
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      // width:150,
      align: "Left",
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "priorityGroupId",
      key: "priorityGroupId",
      title: "Action",
      // width: 100,
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
      return e.priorityGroupName?.toLowerCase().includes(s);
      // ||
      // e.contactNumber?.toLowerCase().includes(s)
    });
    this.setState({ searchValue: s, res });
  };
  handleBackClick = () => {
    window.history.back();
  };
  render() {
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
          <br />
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
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            columns={this.columns}
            dataSource={this.state.res}
            loading={this.state.isLoading}
          ></Table>
          <PriorityForm {...this.state.popup} close={this.onClose} />
          <br></br>
          <Button onClick={this.handleBackClick}>Back</Button>
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(Prioirty));
