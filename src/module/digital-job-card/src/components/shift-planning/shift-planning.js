import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Popconfirm, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ShiftPlanningService } from "../../services/shift-planning-service";
import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import ShiftPlanningForm from "./shift-planning-form";
class ShiftPlanning extends List {
  service = new ShiftPlanningService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "salesOrderNo",
      key: "salesOrderNo",
      title: "Sales Order.No",
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      width: "180px",
      align: "right",
    },
    {
      dataIndex: "startTime",
      key: "startTime",
      title: "Start Time",
      width: "180px",
      render: (value) => {
        return DateTimeFormat(value);
      },
    },
    {
      dataIndex: "endTime",
      key: "endTime",
      title: "End Time",
      width: "180px",
      render: (value) => {
        return DateTimeFormat(value);
      },
    },
    // {
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   title: "Created At",
    //   width: "180px",
    //   render: (value) => {
    //     return DateTimeFormat(value);
    //   },
    // },
    // {
    //   dataIndex: "lastUpdatedAt",
    //   key: "lastUpdatedAt",
    //   title: "Last Updated At",
    //   width: "180px",
    //   render: (value) => {
    //     return DateTimeFormat(value);
    //   },
    // },
    {
      dataIndex: "shiftPlanningId",
      key: "shiftPlanningId",
      title: "Action",
      width: "180px",
      align: "center",
      render: (value) => {
        return (
          <Space>
            <Link to={`./detail/${value}`}>
              <Button type="text" icon={<FolderOpenOutlined />} />
            </Link>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => this.edit(value)}
            />
            <Popconfirm
              title="Confirm to delete"
              description="Are you sure to delete this entry?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => this.delete(value)}
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  patchForm(data) {
    let form = this.getFormInstance();
    form.setFieldsValue({
      ...data,
      startTime: dayjs(data.startTime),
      endTime: dayjs(data.endTime),
    });
  }
  render() {
    const { isLoading, dataSource, popup, isSaving } = this.state;
    return (
      <>
        <Row gutter={[10, 10]}>
          <Col style={{ marginLeft: "auto" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              htmlType="button"
              onClick={this.add}
            >
              Add
            </Button>
          </Col>

          <Col span={24}>
            <Table
              loading={isLoading}
              bordered
              dataSource={dataSource}
              columns={this.columns}
              size="small"
              rowKey="shiftPlanningId"
            />

            <Modal
              maskClosable={false}
              confirmLoading={isSaving}
              onOk={this.submitForm}
              onCancel={this.closePopup}
              open={popup.open}
              title={popup.title}
              destroyOnClose
            >
              <ShiftPlanningForm
                ref={this.ref}
                submit={this.submit}
                id={popup.id}
              />
            </Modal>
          </Col>
        </Row>
      </>
    );
  }
}

export default ShiftPlanning;
