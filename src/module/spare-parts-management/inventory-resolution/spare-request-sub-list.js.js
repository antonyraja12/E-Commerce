import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import React from "react";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import dayjs from "dayjs";
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CheckBox } from "@material-ui/icons";
class SpareRequestSubList extends PageForm {
  service = new InventoryConfigurationService();
  onSuccess(data) {
    super.onSuccess(data);
    this.props.form.resetFields();
    this.props.close();
  }
  columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      fixed: "left",
      width: 50,
      align: "left",
    },
    {
      title: "Item Name",
      dataIndex: "sparePart",
      key: "sparePart",
      render: (value, record) => {
        return value
          ? `${value?.sparePartName} - #${value?.sparePartNumber}`
          : null;
      },
      fixed: "left",
      align: "left",
    },
    {
      title: "Quantity",
      dataIndex: "requestedQuantity",
      key: "requestedQuantity",
      align: "left",
    },
  ];
  onClose = () => {
    this.props.form.resetFields();
    this.props.close();
  };

  onFinish1 = (data) => {
    this.onFinish({
      ...data,
      resolutionWorkOrderId: this.props.resolutionWorkOrderId,
      status: "Requested",
    });
  };
  render() {
    return (
      <>
        <Popups
          title={"Requested Spares List"}
          open={this.props?.open}
          width={600}
          onCancel={this.onClose}
          footer={
            [
              // <Row justify="space-between">
              //   <Col>
              //     <Button key="close" onClick={this.props.close}>
              //       Cancel
              //     </Button>
              //   </Col>
              //   <Col>
              //     <Button type="primary" onClick={this.props.close}>
              //       Done
              //     </Button>
              //   </Col>
              // </Row>,
            ]
          }
        >
          <Spin spinning={!!this.state.isLoading}>
            <Table
              rowKey="spareRequestSubList"
              // loading={this.state.isLoading}
              dataSource={this.props.data}
              columns={this.columns}
              size="middle"
            />
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(SpareRequestSubList);
