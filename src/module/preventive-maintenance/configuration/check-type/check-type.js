import PageList from "../../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import { AddButton } from "../../../../utils/action-button/action-button";
import { Button, Col, Form, Result, Row, Spin, Table } from "antd";
import { withRouter } from "../../../../utils/with-router";
import CheckTypeService from "../../../../services/preventive-maintenance-services/check-type-service";
import CheckTypeForm from "./check-type-form";
import Page from "../../../../utils/page/page";
import { checkTypePageId } from "../../../../helpers/page-ids";
import UserAccessService from "../../../../services/user-access-service";
import Input from "antd/es/input/Input";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withAuthorization } from "../../../../utils/with-authorization";

class CheckType extends PageList {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
    };
  }

  pageId = checkTypePageId;
  service = new CheckTypeService();
  userAccessService = new UserAccessService();

  title = "Check Type";
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
      dataIndex: "checkTypeName",
      key: "checkTypeName",
      title: "Check Type",
      align: "left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
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
      dataIndex: "checkTypeId",
      key: "checkTypeId",
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
            )}{" "}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];
  filter = (event) => {
    let s = event.target.value.toLowerCase();
    let res = this.state.rows.filter((e) => {
      return e.checkTypeName?.toLowerCase().includes(s);
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
                    placeholder="Search Check Type..."
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <br />
          <Table
            rowKey="checkTypeId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={this.columns}
            size="middle"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
          />
          {/* <br />
          <Link to="../" state={this.props.location?.state}>
            <Button>Back</Button>
          </Link> */}
          <CheckTypeForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(CheckType));
