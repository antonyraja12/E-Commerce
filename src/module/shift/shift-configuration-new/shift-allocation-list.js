import { useEffect, useRef, useState } from "react";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import {
  Card,
  Col,
  Form,
  Row,
  Table,
  Select,
  DatePicker,
  Button,
  Modal,
  Space,
  Checkbox,
  message,
  Tooltip,
} from "antd";
import { dateFormat, dateTimeFormat } from "../../../helpers/url";
import AssetService from "../../../services/asset-service";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  CloseCircleOutlined,
  CloseCircleTwoTone,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ShiftCancellation from "./shift-cancellation";
import ShiftAllocationForm from "./shift-allocation-form";
import ShiftAllocationEdit from "./shift-allocation-edit";
const { confirm } = Modal;
function ShiftAllocationList() {
  const ref = useRef();
  const shiftAllocationRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [modal, setModal] = useState({ open: false, title: "Cancel Shift" });
  const [modalAdd, setModalAdd] = useState({
    open: false,
    title: "Shift Allocation",
  });
  const [modalEdit, setModalEdit] = useState({
    open: false,
    title: "Update Shift Allocation",
  });
  const [data, setData] = useState({ loading: false, dataSource: [] });
  const [assetOptions, setAssetOptions] = useState({
    loading: false,
    options: [],
  });
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
    },

    // {
    //   title: "Asset Name",
    //   dataIndex: "asset",
    //   render: (val) => {
    //     return val?.assetName;
    //   },
    // },
    {
      title: "Shift Date",
      dataIndex: "shiftDate",
      render: (value) => {
        return dateFormat(value);
      },
    },
    {
      title: "Shift Name",
      dataIndex: "shiftName",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value) => {
        return dateTimeFormat(value);
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value) => {
        return dateTimeFormat(value);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Cancel",
      dataIndex: "cancel",
      align: "center",
      render: (value, row) => {
        return (
          <Button
            type="text"
            disabled={value || row.status == "COMPLETED"}
            icon={<CloseOutlined />}
            shape="circle"
            size="small"
            onClick={() => cancelShift(row.shiftAllocationId)}
            danger
          />
        );
      },
    },
    {
      title: "Action",
      align: "center",
      dataIndex: "shiftAllocationId",
      render: (value, row) => {
        return (
          <Space>
            <Button
              type="text"
              disabled={row.status !== "SCHEDULED"}
              icon={<EditOutlined />}
              shape="circle"
              size="small"
              onClick={() => editShiftAllocation(row.shiftAllocationId)}
            />
            {/* <Button
              type="text"
              disabled={row.status !== "SCHEDULED"}
              icon={<DeleteOutlined />}
              shape="circle"
              size="small"
              // onClick={() => cancelShift(row.shiftAllocationId)}
            /> */}
          </Space>
        );
      },
    },
  ];
  const cancelShift = (shiftAllocationId) => {
    setModal((state) => ({
      ...state,
      open: true,
      shiftAllocationId: shiftAllocationId,
    }));
  };
  const editShiftAllocation = (shiftAllocationId) => {
    setModalEdit((state) => ({
      ...state,
      open: true,
      shiftAllocationId: shiftAllocationId,
    }));
  };
  const closeModal = () => {
    setModal((state) => ({
      ...state,
      open: false,
    }));
  };
  const list = (value = {}) => {
    let filter = { ...value };
    if (filter.startDate)
      filter.startDate = dayjs(filter.startDate).startOf("d").toISOString();
    if (filter.endDate)
      filter.endDate = dayjs(filter.endDate).endOf("d").toISOString();

    const service = new ShiftAllocationService();
    setData((state) => ({ ...state, loading: true }));
    service
      .list(filter)
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          dataSource: data?.map((e, index) => ({ ...e, sno: index + 1 })),
        }));
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  useEffect(() => {
    // const service = new AssetService();
    // setAssetOptions((state) => ({ ...state, loading: true }));
    // service
    //   .list({ active: true })
    //   .then(({ data }) => {
    //     setAssetOptions((state) => ({
    //       ...state,
    //       options: data.map((e) => ({ label: e.assetName, value: e.assetId })),
    //     }));
    //   })
    //   .finally(() => {
    //     setAssetOptions((state) => ({ ...state, loading: false }));
    //   });
    list();
  }, []);
  const submitForm = () => {
    ref.current.submit();
  };
  const afterSave = () => {
    closeModal();
    closeShiftAllocationModal();
    closeShiftAllocationEditModal();
    form.submit();
  };
  const addShiftAllocation = () => {
    setModalAdd((state) => ({ ...state, open: true }));
  };
  const closeShiftAllocationModal = () => {
    setModalAdd((state) => ({ ...state, open: false }));
  };
  const closeShiftAllocationEditModal = () => {
    setModalEdit((state) => ({ ...state, open: false }));
  };
  const submitShiftAllocationForm = () => {
    shiftAllocationRef.current.submit();
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showDeleteConfirm = (okCallBack) => {
    confirm({
      title: "Are you sure to delete this entry?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        okCallBack();
      },

      onCancel() {
        // console.log("Cancel");
      },
    });
  };
  const onDelete = () => {
    const service = new ShiftAllocationService();

    if (selectedRowKeys.length > 0) {
      Promise.all(selectedRowKeys.map((id) => service.delete(id)))
        .then(() => {
          message.success("Deleted Successfully");
          form.submit();
        })
        .finally(() => {});
    }
  };
  return (
    <Card
      // title="Shift Allocation"
      extra={
        <Space>
          <Tooltip title={"Calender"}>
            <Link to={`calendar`}>
              <Button
                icon={<CalendarOutlined />}
                type="primary"
                shape="circle"
              />
              {/* Calendar
            </Button> */}
            </Link>
          </Tooltip>
          <Tooltip title="Bulk Add">
            <Link to={`add`}>
              <Button icon={<PlusOutlined />} type="primary" shape="circle">
                {/* Add */}
              </Button>
            </Link>
          </Tooltip>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={addShiftAllocation}
          >
            Add New
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={list}>
        <Row gutter={[10, 10]}>
          {/* <Col sm={6}>
            <Form.Item label="Asset" name="assetId">
              <Select mode="multiple" {...assetOptions} />
            </Form.Item>
          </Col> */}
          <Col>
            <Form.Item label="From" name="startDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="To" name="endDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                Go
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Button
        disabled={selectedRowKeys.length === 0}
        danger
        type="primary"
        onClick={() => showDeleteConfirm(onDelete)}
      >
        Delete
      </Button>
      <br />
      <br />
      <Table
        rowSelection={rowSelection}
        onRow={(record, index) => {
          if (record.cancel) {
            return {
              style: { color: "#cccccc" },
            };
          }
        }}
        bordered
        size="small"
        rowKey="shiftAllocationId"
        {...data}
        columns={columns}
        pagination={{
          size: "default",

          // showLessItems: true,
          // responsive: true,
          // showQuickJumper: true,
        }}
      />
      <Modal {...modal} onCancel={closeModal} onOk={submitForm} destroyOnClose>
        <ShiftCancellation
          afterSave={afterSave}
          shiftAllocationId={modal.shiftAllocationId}
          ref={ref}
        />
      </Modal>

      <Modal
        {...modalAdd}
        onCancel={closeShiftAllocationModal}
        onOk={submitShiftAllocationForm}
        destroyOnClose
      >
        <ShiftAllocationForm
          afterSave={afterSave}
          shiftAllocationId={modal.shiftAllocationId}
          ref={shiftAllocationRef}
        />
      </Modal>
      <Modal
        {...modalEdit}
        onCancel={closeShiftAllocationEditModal}
        onOk={submitShiftAllocationForm}
        destroyOnClose
        width={1200}
      >
        <ShiftAllocationEdit
          shiftAllocationId={modalEdit.shiftAllocationId}
          ref={shiftAllocationRef}
          afterSave={afterSave}
        />
      </Modal>
    </Card>
  );
}

export default ShiftAllocationList;
