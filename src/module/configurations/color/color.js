import { Space, Table } from "antd";
import PageList from "../../../utils/page/page-list";
import {
  ViewButton,
  EditButton,
  DeleteButton,
  AddButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
// import Colorform from "./colorform";
import ColorService from "../../../services/color-service";
import ColorForm from "../color/colorform";
import { Badge } from "antd";

class Color extends PageList {
  service = new ColorService();
  title = "Color";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 0,
    },

    {
      dataIndex: "colorCode",
      key: "colorCode",
      title: "Color",
      align: "center",
      width: "120px",
      render: (text) => (
        <Space>
          <div
            style={{
              borderRadius: "5px",
              backgroundColor: text,
              width: "25px",
              height: "25px",
            }}
          ></div>
        </Space>
      ),
    },
    {
      dataIndex: "colorName",
      key: "colorName",
      title: "Description",
      align: "left",
    },
    {
      dataIndex: "colorMasterId",
      key: "colorMasterId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <ViewButton onClick={() => this.view(value)} />
            <EditButton onClick={() => this.edit(value)} />
            <DeleteButton onClick={() => this.delete(value)} />
          </>
        );
      },
    },
  ];

  render() {
    return (
      <Page
        title={this.title}
        action={<AddButton onClick={() => this.add()} />}
      >
        <Table
          // rowKey="checkTypeId"
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={this.columns}
          size="middle"
          pagination={{
            showSizeChanger: true,

            size: "default",
          }}
        />
        <ColorForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}

export default withRouter(Color);
