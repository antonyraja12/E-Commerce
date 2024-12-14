import React, { useEffect, useState } from "react";
import { withRouter } from "../../../utils/with-router";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import useCrudOperations from "../utils/useCrudOperation";
import Page from "../../../utils/page/page";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";

import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Spin,
  Input,
  message,
  Card,
  Radio,
} from "antd";
import {
  DeleteOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { dateFormat } from "../../../helpers/date-format";

import { render } from "less";
import OperationForm from "./operation-form";
import LossReasonService from "../../../services/track-and-trace-service/loss-reason-service";

const Operation = (props) => {
  const title = "Operations";
  const service = new LossReasonService();
  const [form] = Form.useForm();

  const [popup, setPopup] = useState({});
  const [searchValue, setSearchValue] = useState();
  //   const [productOption, setProductOption] = useState([]);

  const {
    data,
    isLoading,
    fetchData,
    handleDelete,
    setSelectedRowKeys,
    selectedRowKeys,
    setIsLoading,
    setData,
  } = useCrudOperations(service);

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "lossReason",
      key: "lossReason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      title: "Action",
      dataIndex: "lossReasonId",
      key: "lossReasonId",
      width: 20,
      align: "center",
      render: (value) => {
        return (
          <Space>
            <ViewButton onClick={() => onView(value)} />
            <EditButton onClick={() => onEdit(value)} />
            <DeleteButton onClick={() => onDelete(value)} />
          </Space>
        );
      },
    },
  ];
  const add = () => {
    setPopup({
      open: true,
      mode: "Add",
      title: `Add ${title}`,
      id: null,
      disabled: false,
    });
  };
  const onEdit = (id) => {
    setPopup({
      open: true,
      mode: "Update",
      title: `Update ${title}`,
      id: id,
      disabled: false,
    });
  };
  const onView = (id) => {
    setPopup({
      open: true,
      mode: "View",
      title: `View ${title}`,
      id: id,
      disabled: true,
    });
  };
  const onDelete = (id) => {
    setIsLoading(true);
    service
      .delete(id)
      .then((res) => {
        if (res.status == 200) {
          message.success("Deleted Successfully");
        }
      })
      .finally(() => {
        setIsLoading(false);
        fetchData();
      });
  };
  const onClose = () => {
    setPopup({
      open: false,
    });
    fetchData();
  };

  const filter = (val) => {
    let s = val.target.value.toLowerCase();
    if (!s) {
      fetchData(); // Assuming `originalData` is the unfiltered data
    } else {
      let value = data.filter((e) => {
        return e.lossReason?.toLowerCase().includes(s);
      });
      setData(value);
    }
  };

  const onFinish = (value) => {
    console.log("value", value);
  };

  return (
    <Card title={title}>
      <Form
        labelAlign="left"
        // labelCol={{
        //   span: 6,
        // }}
        // wrapperCol={{
        //   span: 8,
        // }}
        form={form}
        layout="inline"
        colon={false}
        onFinish={onFinish}
        // className="form-horizontal"
        // initialValues={{ status: true }}
        //   disabled={disabled}
      >
        <Form.Item
          label="Operation Name"
          name={"operationName"}
          rules={[
            {
              required: true,
              message: "Please enter Opertion name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name={"operationType"}
          rules={[
            {
              required: true,
              message: "Please select operation type",
            },
          ]}
        >
          <Radio.Group optionType="button">
            <Radio value="auto">Auto</Radio>
            <Radio value="semiAuto">Semi Auto</Radio>
            <Radio value="manual">Manual</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Row justify={"end"}>
            {/* <Col>
              <Button onClick={() => form.resetFields()}> Cancel</Button>
            </Col> */}
            <Col span={2}>
              <Button htmlType="submit" type="primary">
                Save
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default withRouter(Operation);
