import { Button, Col, Row, Spin, Table } from "antd";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";

import { Link } from "react-router-dom";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
class ShiftConfiguration extends PageList {
  service = new ShiftMasterAssetWiseService();
  title = "Shift Weekly Configuration";
  componentDidMount() {
    this.list();
  }
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
      dataIndex: "name",
      key: "name",
      title: "Set Name",
      align: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "left",
      render: (text, record) => {
        const assetName = record.shiftAssetMappingList.map(
          (assetName) => assetName.assetName
        );

        return assetName.join(", ");
      },
    },
    {
      dataIndex: "shiftMasterAssetWiseId",
      key: "shiftMasterAssetWiseId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {this.props.access[0]?.includes("view") && (
              <Link to={`view/${value}`}>
                <ViewButton />
              </Link>
            )}
            {this.props.access[0]?.includes("edit") && (
              <Link to={`update/${value}`}>
                <EditButton />
              </Link>
            )}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  render() {
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          // title={this.title}
          action={
            <>
              <Row gutter={[10, 10]}>
                <Col>
                  <Link
                    to="shift"
                    // state={this.props.location?.state}
                  >
                    <Button>Shift</Button>
                  </Link>
                </Col>
                <Col>
                  {
                    <Link to="add">
                      {this.props.access[0]?.includes("add") && <AddButton />}
                    </Link>
                  }
                </Col>
              </Row>
            </>
          }
        >
          <Table
            rowKey="shiftMasterAssetWiseId"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="middle"
            bordered
          />
          <br />
          <Link to="/settings/shift/shift-allocation">
            <Button>Back</Button>
          </Link>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(ShiftConfiguration));
