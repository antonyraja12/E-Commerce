import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Popconfirm, Row, Space, Table } from "antd";
import dayjs from "dayjs";

import { ShiftMasterService } from "../../services/shift-master-service";
import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import ShiftMasterForm from "./shift-master-form";

class ShiftMaster extends List {
  service = new ShiftMasterService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
    },
    {
      dataIndex: "shiftDate",
      key: "shiftDate",
      title: "Shift Date",
      width: "180px",
      render: (value) => {
        return DateTimeFormat(value);
      },
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

    {
      dataIndex: "shiftId",
      key: "shiftId",
      title: "Action",
      width: "180px",
      align: "center",
      render: (value) => {
        return (
          <Space>
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
      shiftDate: dayjs(data.shiftDate),
      startTime: dayjs(data.startTime),
      endTime: dayjs(data.endTime),
    });
  }
  render() {
    const { isLoading, dataSource, popup, isSaving, isDeleting } = this.state;
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
              rowKey="shiftId"
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
              <ShiftMasterForm
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

export default ShiftMaster;
