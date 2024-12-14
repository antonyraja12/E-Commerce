import {
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import { ItemService } from "../../services/item-service";
import ItemForm from "./item-form";
import { createRef } from "react";
import Page from "../../../../../utils/page/page";

class Item extends List {
  service = new ItemService();
  isMobile = window.innerWidth <= 768;
  constructor(props) {
    super(props);
    this.formRef = createRef();
  }
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "50px",
      fixed: this.isMobile ? undefined : "left",
    },
    {
      dataIndex: "itemName",
      key: "itemName",
      title: "Item Name",
      fixed: this.isMobile ? undefined : "left",
      width: "100px",
    },
    {
      dataIndex: "itemCode",
      key: "itemCode",
      title: "Item Code",
      width: "100px",
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: "100px",
    },
    {
      dataIndex: "barCode",
      key: "barCode",
      title: "Bar Code",
      width: "100px",
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      width: "50px",
      align: "right",
    },
    {
      dataIndex: "location",
      key: "location",
      title: "Location",
      width: "100px",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "70px",
      render: (value) => {
        return value ? (
          <Badge color="green" text="Active" />
        ) : (
          <Badge text="Inactive" color="#cccccc" />
        );
      },
    },
    {
      dataIndex: "itemId",
      key: "itemId",
      title: "Action",
      width: "100px",
      align: "center",
      fixed: this.isMobile ? undefined : "right",
      render: (value) => {
        return (
          <Space>
            {/* <Link to={`./detail/${value}`}>
              <Tooltip title="View">
                <Button type="text" icon={<FolderOpenOutlined />} />
              </Tooltip>
            </Link> */}
            <Tooltip title="View">
              <Button
                type="text"
                icon={<FileSearchOutlined />}
                onClick={() => this.view(value)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => this.edit(value)}
              />
            </Tooltip>
            <Popconfirm
              title="Confirm to delete"
              description="Are you sure to delete this entry?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                this.delete(value);
                this.setState({ ...this.state, popupMode: "Edit" });
              }}
            >
              <Tooltip title="Delete">
                <Button type="text" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // patchForm(data) {
  //   let form = this.getFormInstance();
  //   form.setFieldsValue({
  //     ...data,
  //     orderDate: dayjs(data.orderDate),
  //     // productName: data.productMaster.productName,
  //   });
  // }
  // onSearch(value) {
  //   let data = value;
  //   if (value?.orderDate) {
  //     data.fromDate = value.orderDate[0].startOf("D")?.toISOString();
  //     data.toDate = value.orderDate[1].endOf("D")?.toISOString();
  //     data.orderDate = [];
  //   }
  //   this.list(data);
  // }
  closePopup() {
    this.formRef.current.resetFields();
    super.closePopup();
  }
  render() {
    const { isLoading, dataSource, popup, isSaving, productOption } =
      this.state;
    return (
      <Page
        title="Item"
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            htmlType="button"
            onClick={this.add}
          >
            Add
          </Button>
        }
      >
        <Row gutter={[10, 10]}>
          <Col sm={24}>
            <Form
              // onValuesChange={this.onValuesChange}
              ref={this.formRef}
              layout="vertical"
              onFinish={this.list}
            >
              <Row gutter={[10, 10]} align="middle">
                <Col sm={4}>
                  <Form.Item name="itemName">
                    <Input placeholder="Item Name" allowClear />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="itemCode">
                    <Input placeholder="Item Code" allowClear />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="location">
                    <Input placeholder="Location" allowClear />
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Go
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <br />
        {/* <Col span={24}> */}
        <Table
          loading={isLoading}
          bordered
          dataSource={dataSource}
          columns={this.columns}
          size="small"
          rowKey="shiftPlanningId"
          scroll={{
            x: 1500,
            y: 300,
          }}
        />

        <Modal
          maskClosable={false}
          confirmLoading={isSaving}
          // onOk={this.submitForm}
          onCancel={this.closePopup}
          open={popup.open}
          title={popup.title}
          destroyOnClose
          footer={
            popup.mode !== "view" && (
              <>
                <Button type="primary" onClick={this.submitForm}>
                  OK
                </Button>
                <Button onClick={this.closePopup}>Cancel</Button>
              </>
            )
          }
        >
          <ItemForm
            ref={this.ref}
            submit={this.submit}
            id={popup.id}
            mode={popup.mode}
          />
        </Modal>
        {/* </Col> */}
      </Page>
    );
  }
}

export default Item;
