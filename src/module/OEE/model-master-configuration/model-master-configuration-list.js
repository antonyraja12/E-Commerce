import { Table, Space, Row, Col, Input, Result, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModelMasterConfigurationService from "../../../services/oee/model-master-configuration-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import ModelMasterConfigurationForm from "./model-master-configuration-form";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";

class ModelMasterConfigurationList extends PageList {
  service = new ModelMasterConfigurationService();
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  title = "Model Master Configuration";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
    },

    {
      dataIndex: "modelName",
      key: "modelName",
      title: "Model Name",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
    },
    {
      dataIndex: "modelNumber",
      key: "modelNumber",
      title: "Model Number",
      // sorter: (a, b) => a.modelNumber.localeCompare(b.modelNumber),
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
      dataIndex: "modelMasterId",
      key: "modelMasterId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value) => {
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
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    // console.log("Search term:", s);
    let res = this.state.rows.filter((e) => {
      return (
        e.modelName.toLowerCase().includes(s) ||
        e.modelNumber.toLowerCase().includes(s)
      );
    });
    // console.log("Filtered result:", res);
    this.setState((state) => ({ ...state, res: res }));
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
            <>
              {this.props.access[0]?.includes("add") && (
                <AddButton onClick={() => this.add()} />
              )}
            </>
          }
        >
          <Row justify="space-between" gutter={[0, 16]}>
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search Model Name or Model Number..."
              />
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Table
                pagination={{
                  showSizeChanger: true,
                  size: "default",
                }}
                loading={this.state.isLoading}
                columns={this.columns}
                dataSource={this.state.res}
                size="medium"
                bordered
              />
            </Col>
          </Row>
          <ModelMasterConfigurationForm
            {...this.state.popup}
            close={this.onClose}
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(ModelMasterConfigurationList));
