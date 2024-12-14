import { CloseOutlined } from "@ant-design/icons";
import {
  Form,
  Table,
  Input,
  Row,
  Col,
  Radio,
  Modal,
  Steps,
  Button,
  Popover,
} from "antd";
import { useState } from "react";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import { useParams } from "react-router-dom";

function ChangeBom({ property }) {
  const [saving, isSaving] = useState(false);
  const { id } = useParams();
  const [formModel, openFormModel] = useState(false);
  const [form] = Form.useForm();

  const parseData = (data) => {
    if (data) {
      return JSON.parse(data);
    }
    return [];
  };

  const onRemove = (value) => {
    form.setFieldsValue({
      workStationDisplayName: value?.workStationDisplayName,
      assemblyDetailId: value?.assemblyDetailId,
      productId: value?.productId,
      sequenceNumber: value?.sequenceNumber,
      description: value?.description,
      qrCode: value?.qrCode,
    });

    openFormModel(true);
  };

  const onFinish = (value) => {
    console.log(value);
  };

  const childPartColumns = [
    {
      title: "S.No.",
      key: "Code",
      width: 50,
      render: (v, _, i) => {
        return i + 1;
      },
    },
    {
      dataIndex: "workStationDisplayName",
      title: "Work Station",
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "expectedValue",
      title: "Part.No.",
    },
    {
      dataIndex: "qrCode",
      title: "Scan Value",
    },
    {
      dataIndex: "result",
      title: "Status",
      align: "center",
    },
    {
      dataIndex: "qrCode",
      title: "",
      key: "action",
      width: 50,
      align: "Center",
      render: (value, record) => {
        return (
          // <Popover
          //   destroyTooltipOnHide
          //   title={`${record.value}`}
          //   trigger="click"
          //   content={
          //     <Form
          //       layout="vertical"
          //       onFinish={onFinish}
          //       // wrapperCol={{ span: 16 }}
          //       // labelCol={{ span: 8 }}
          //     >
          //       <Form.Item
          //         name="status"
          //         label="Status"
          //         rules={[
          //           {
          //             required: true,
          //           },
          //         ]}
          //       >
          //         <Radio.Group
          //           // optionType="button"
          //           size="small"
          //           // style={{ paddingTop: "10%" }}
          //         >
          //           <Radio value={"Reusable"}>Reusable</Radio>
          //           <Radio value={"Scrap"}>Scrap</Radio>
          //         </Radio.Group>
          //       </Form.Item>
          //       <Form.Item
          //         label="Remark"
          //         name={"remark"}
          //         rules={[
          //           {
          //             required: true,
          //           },
          //         ]}
          //       >
          //         <Input.TextArea rows={2} placeholder="Remark" />
          //       </Form.Item>
          //       <Form.Item>
          //         <Button htmlType="submit" variant="solid" color="default">
          //           Save
          //         </Button>
          //       </Form.Item>
          //     </Form>
          //   }
          // >
          //   <Button
          //     // onClick={() => onRemove(record)}
          //     variant="text"
          //     icon={<CloseOutlined />}
          //     color="danger"
          //   />
          // </Popover>
          <Button
            onClick={() => onRemove(record)}
            variant="text"
            icon={<CloseOutlined />}
            color="danger"
          />
        );
      },
    },
  ];

  const onRemoveItem = (value) => {
    isSaving(true);
    const service = new WorkStationInstanceService();
    service
      .callService(id, "removePart", { value })
      .then(({ data }) => {})
      .finally(() => {
        isSaving(false);
        openFormModel(false);
      });
  };

  const getRowClassName = (record, index) => {
    let str = "";
    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";

    return str;
  };
  return (
    <>
      <Row gutter={[10, 10]}>
        {/* <Col md={12} lg={8}>
          <Input autoFocus />
        </Col> */}
        <Col span={24}>
          <Table
            columns={childPartColumns}
            pagination={false}
            dataSource={parseData(property?.childPartList)}
            bordered
            size="small"
            rowClassName={getRowClassName}
          />
        </Col>
      </Row>

      <Modal
        width={500}
        open={formModel}
        title="Change BOM"
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          loading: saving,
        }}
        onCancel={() => openFormModel(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            size="small"
            layout="vertical"
            form={form}
            name="form_in_modal"
            // initialValues={}
            clearOnDestroy
            onFinish={(values) => onRemoveItem(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item label="AssDetId" name="assemblyDetailId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="sequenceNumber" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Work Station" name="workStationDisplayName">
          <Input readOnly variant="filled" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input readOnly variant="filled" />
        </Form.Item>
        <Form.Item label="Product Id" name="productId" hidden>
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Scan Value" name="qrCode">
          <Input readOnly variant="filled" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group
            // optionType="button"
            size="small"
            // style={{ paddingTop: "10%" }}
          >
            <Radio value={"Reusable"}>Reusable</Radio>
            <Radio value={"Scrap"}>Scrap</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Remark"
          name={"remark"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea rows={2} placeholder="Remark" variant="filled" />
        </Form.Item>
      </Modal>
    </>
  );
}

export default ChangeBom;
