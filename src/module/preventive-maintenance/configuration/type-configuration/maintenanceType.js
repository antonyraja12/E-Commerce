import { Button, Col, Form, Input, Row, Spin, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";

import { SearchOutlined } from "@ant-design/icons";
import MaintenanceTypeForm from "./MaintenanceTypeForm";

import MaintenanceTypeService from "../../../../services/preventive-maintenance-services/maintenance-type-service";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";

class MaintenanceType extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }
  service = new MaintenanceTypeService();
  title = "Issue Type";

  componentDidMount() {
    super.componentDidMount();
    this.list();
  }

  columns = [
    {
      dataIndex: "maintenanceTypeName",
      key: "MaintenanceType",
      title: "Issue Type",
      align: "Left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "Left",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "left",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "maintenanceTypeId",
      key: "maintenanceTypeId",
      title: "Action",
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
  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.service
      .list({ active: true })
      .then(({ data }) => {
        // console.log("data", data);
        this.setState((state) => ({
          ...state,
          parentTreeList: this.service.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };

  handleData(data) {
    return this.service.convertToTree(data);
  }
  onClose = () => {
    this.setState((state) => ({ ...state, popup: { open: false } }));
    this.loadParent();
    this.list();
    this.resetSearchInput();
  };

  resetSearchInput = () => {
    this.setState({ searchValue: "" });
  };

  filter = (event) => {
    let s = event.target.value.toLowerCase();
    let res = this.state.rows.filter((e) => {
      return e.maintenanceTypeName?.toLowerCase().includes(s);
      // ||
      // e.contactNumber?.toLowerCase().includes(s)
    });
    this.setState({ searchValue: s, res });
  };
  handleBackClick = () => {
    window.history.back();
  };
  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            this.props.access[0]?.includes("view") && (
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
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            rowKey="maintenanceTypeId"
            columns={this.columns}
            dataSource={this.state.res}
            loading={this.state.isLoading}
          ></Table>
          <MaintenanceTypeForm
            destroyOnClose={true}
            {...this.state.popup}
            close={this.onClose}
          />
          <br></br>

          <Button onClick={this.handleBackClick}>Back</Button>
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(MaintenanceType));
