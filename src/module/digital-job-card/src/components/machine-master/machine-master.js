import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Form,
  Input,
} from "antd";
import dayjs from "dayjs";
import { MachineMasterService } from "../../services/machine-master-service";

import { ShiftMasterService } from "../../services/shift-master-service";
import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import MachineMasterForm from "./machine-master-form";

class MachineMaster extends List {
  service = new MachineMasterService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "machineName",
      key: "machineName",
      title: "Resources",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "180px",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },

    {
      dataIndex: "machineId",
      key: "machineId",
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
              type="text"
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //   patchForm(data) {
  //     let form = this.getFormInstance();
  //     form.setFieldsValue({
  //       ...data,
  //       shiftDate: dayjs(data.shiftDate),
  //       startTime: dayjs(data.startTime),
  //       endTime: dayjs(data.endTime),
  //     });
  //   }
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
              rowKey="machineId"
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
              <MachineMasterForm
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

export default MachineMaster;
