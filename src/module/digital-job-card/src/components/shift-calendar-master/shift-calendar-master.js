import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Modal, Popconfirm, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { ShiftCalendarMasterService } from "../../services/shift-calendar-master-service";

import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import ShiftCalendarMasterForm from "./shift-calendar-master-form";

class ShiftCalendarMaster extends List {
  service = new ShiftCalendarMasterService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "day",
      key: "day",
      title: "Day",
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "180px",
      render: (value) => {
        return value ? (
          <Badge color="green" text="Active" />
        ) : (
          <Badge text="Inactive" color="#cccccc" />
        );
      },
    },
    {
      dataIndex: "shiftCalendarId",
      key: "shiftCalendarId",
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
      shiftCalendarDetails: data.shiftCalendarDetails?.map((e) => ({
        ...e,
        startTime: dayjs(e.startTime),
        endTime: dayjs(e.endTime),
      })),
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
              rowKey="shiftCalendarId"
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
              <ShiftCalendarMasterForm
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

export default ShiftCalendarMaster;
