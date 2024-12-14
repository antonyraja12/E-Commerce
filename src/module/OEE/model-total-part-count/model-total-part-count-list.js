import { Table, Space, Row, Col, Input, Result, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModelTotalPartCountService from "../../../services/oee/model-total-part-count-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import ModelTotalPartCountForm from "./model-total-part-count-form";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import moment from "moment";
class ModelTotalPartCountList extends PageList {
  service = new ModelTotalPartCountService();
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };
  title = "Target Part Count";

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      align: "center",
    },
    {
      dataIndex: "startDate",
      key: "startDate",
      title: "Start Date",
      width: 100,
      align: "center",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY ") : "-"),
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      width: 200,
      align: "left",
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
    },
    {
      dataIndex: "modelName",
      key: "modelName",
      title: "Model Name",
      width: 150,
      align: "left",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
    },
    {
      dataIndex: "targetedPartCount",
      key: "targetedPartCount",
      title: "Targeted Partcount",
      width: 150,
      align: "right",
      // sorter: (a, b) => a.modelNumber.localeCompare(b.modelNumber),
    },

    {
      dataIndex: "setPerformance",
      key: "setPerformance",
      title: "Performance",
      width: 80,
      align: "center",
      render: (value) => {
        return value ? "True" : "False";
      },
    },
    {
      dataIndex: "targetedId",
      key: "targetedId",
      title: "Action",
      width: 150,
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
        e.modelName.toLowerCase().includes(s)
      );
    });
    // console.log("Filtered result:", res);
    this.setState((state) => ({ ...state, res: res }));
  };

  render() {
    const { isLoading } = this.props;
    // console.log("access", this.props);
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
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={this.filter}
                placeholder="Search Model Name or Model Number..."
              />
            </Col>
          </Row>
          <br />
          <Table
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
            loading={this.state.isLoading}
            columns={this.columns}
            dataSource={this.state.res}
            size="medium"
            bordered
          />
          <ModelTotalPartCountForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(ModelTotalPartCountList));
