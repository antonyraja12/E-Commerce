import { Button, Col, Input, Row, Space, Spin, Table } from "antd";
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

import MaintenanceTypeService from "../../../../services/quality-inspection/maintenance-type-service";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";

class MaintenanceType extends PageList {
  service = new MaintenanceTypeService();
  title = "Issue Type";

  componentDidMount() {
    // super.componentDidMount();
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
  };

  filter = (search) => {
    const searchTerm = search.target.value.toLowerCase().trim();

    const filterTree = (node) => {
      // Check if the current node matches the search criteria
      const nodeMatches = node.maintenanceTypeName
        ?.toLowerCase()
        .includes(searchTerm);

      // Recursively filter the children
      const filteredChildren = node.children
        ? node.children.filter((child) => filterTree(child))
        : [];

      // Include the current node if it or any of its children match the search criteria
      return nodeMatches || filteredChildren.length > 0;
    };

    const filteredResult = this.state.rows.filter((node) => filterTree(node));

    this.setState((state) => ({ ...state, res: filteredResult }));
  };

  render() {
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            this.props.access[0]?.includes("execute") && (
              <AddButton onClick={() => this.add()} />
            )
          }
        >
          <br />
          <Row justify="space-between">
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search..."
                // bordered={false}
              />
              <br />
            </Col>

            <Col>
              <Space>
                <></>
              </Space>
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
          <MaintenanceTypeForm {...this.state.popup} close={this.onClose} />
          <br></br>
          <Link to="../../">
            <Button>Back</Button>
          </Link>
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(MaintenanceType));
