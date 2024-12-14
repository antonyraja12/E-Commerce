import { Input, Select, Table } from "antd";
import QualityCalculationService from "../../../services/oee/quality-calculation-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import QualityConfigurationForm from "./quality-configuration-form";
const { Option } = Select;
const onSearch = (value) => {
  console.log(`selected ${value}`);
};
const { TextArea } = Input;
class QualityConfigurationList extends PageList {
  service = new QualityCalculationService();
  onClose = () => {
    this.setState({ ...this.state, popup: { open: false } });
    this.list();
  };

  title = "Quality Configuration";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      render: (record, value, data) => {
        return record;
      },
    },
    {
      dataIndex: "modelMaster",
      key: "modelMaster",
      title: "Model Name",
      render: (record, value, data) => {
        return record?.modelName;
        // console.log("rec", record);
      },
    },
    {
      dataIndex: "modelMaster",
      key: "modelNumber",
      title: "Model Number",
      render: (modelMaster, record, index) => {
        return modelMaster?.modelNumber;
      },
    },

    {
      dataIndex: "totalPartCount",
      key: "totalPartCount",
      title: "Total Part Count",
    },
    {
      dataIndex: "acceptedPartCount",
      key: "acceptedPartCount",
      title: "Accepted Part Count",
    },
    {
      dataIndex: "rejectedPartCount",
      key: "rejectedPartCount",
      title: "Rejected Part Count",
    },
    {
      dataIndex: "reason",
      key: "reason",
      title: "Reason",
    },
    {
      dataIndex: "qualityconfigurationId",
      key: "qualityconfigurationId",
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
        action={
          <>
            <AddButton onClick={() => this.add()} />
          </>
        }
      >
        <Table
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
          loading={this.state.isLoading}
          columns={this.columns}
          dataSource={this.state.res}
          size="middle"
          bordered
        />
        <QualityConfigurationForm {...this.state.popup} close={this.onClose} />
      </Page>
    );
  }
}
export default QualityConfigurationList;
