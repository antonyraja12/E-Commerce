import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import React from "react";
import { withForm } from "../../../utils/with-form";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import DispatchSpareService from "../../../services/inventory-services/dispatch-spare-service";

class Dispatchlist extends PageForm {
  service = new DispatchSpareService();
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
      dataIndex: "sparePartName",
      key: "sparePartName",
      fixed: "left",
      align: "left",
    },
    {
      title: "Quantity",
      dataIndex: "dispatchedQuantity",
      key: "dispatchedQuantity",
      align: "left",
    },
  ];

  onClose = () => {
    this.props.form.resetFields();
    this.props.close();
  };
  UpdateStatus = (id) => {
    this.service
      .upadteStatus("Acknowledged", id)
      .then(({ data }) => {
        if (data.success) {
          this.onSuccess(data);
        }
      })
      .catch((err) => console.log("catch error", err))
      .finally(() => {
        this.onClose();
      });
  };
  onFinish1 = (data) => {
    this.onFinish({
      ...data,
      resolutionWorkOrderId: this.props.resolutionWorkOrderId,
      status: "Requested",
    });
  };
  render() {
    const transformedData = this.props.data?.flatMap((data, index) =>
      data.dispatchItems.map((item, itemIndex) => ({
        sno: index * data.dispatchItems.length + itemIndex + 1,
        sparePartName: item.sparePart.sparePartName,
        dispatchedQuantity: item.dispatchedQuantity,
      }))
    );

    return (
      <>
        <Popups
          title={"Dispatched Spares List"}
          open={this.props?.open}
          width={600}
          onCancel={this.onClose}
          footer={[
            <Row justify="space-between">
              <Col>
                <Button key="close" onClick={this.props.close}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={
                    this.props.data &&
                    this.props.data[0]?.dispatchStatus === "Acknowledged"
                      ? true
                      : false
                  }
                  type="primary"
                  onClick={() =>
                    this.UpdateStatus(this.props.data[0]?.dispatchId)
                  }
                >
                  Acknowledge
                </Button>
              </Col>
            </Row>,
          ]}
        >
          <Spin spinning={!!this.state.isLoading}>
            <Table
              rowKey="spareRequestSubList"
              // loading={this.state.isLoading}
              dataSource={transformedData}
              columns={this.columns}
              size="middle"
            />
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(Dispatchlist);
