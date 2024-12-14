import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import ProductService from "../../../../services/track-and-trace-service/product-service";
import useCrudOperations from "../../utils/useCrudOperation";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";
import Page from "../../../../utils/page/page";
import VariantForm from "./variant-form";
import VariantService from "../../../../services/track-and-trace-service/variant-service";
const { Option } = Select;

const Variant = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popup, setPopup] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [variantList, setVariantList] = useState([]);
  const service = new VariantService();
  const title = "Variant";
  const { access } = props;

  const {
    data,

    setIsLoading,
    fetchData,
    handleDelete,

    form,
  } = useCrudOperations(service);

  useEffect(() => {
    setVariantList(data);
  }, [data]);
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
      dataIndex: "variantName",
      key: "variantName",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (value) => {
    //     return value ? "Active" : "Inactive";
    //   },
    // },
    {
      title: "Action",
      dataIndex: "variantId",
      key: "variantId",
      width: 20,
      align: "center",
      render: (value) => {
        return (
          <Space>
            {<ViewButton onClick={() => onView(value)} />}
            {<EditButton onClick={() => onEdit(value)} />}
            {<DeleteButton onClick={() => onDelete(value)} />}
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

  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    let result = data.filter((e) => {
      return e.variantName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setVariantList(result);
  };
  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  return (
    <Page
      // title={title}
      action={<Space>{<AddButton onClick={add} />}</Space>}
    >
      <Form component={false} form={form}>
        <Row justify="space-between">
          <Col span={7}>
            <Form>
              <Form.Item>
                <Input
                  prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                  value={searchValue}
                  onChange={filter}
                  placeholder={"Search..."}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          size="small"
          bordered
          rowKey="variantId"
          columns={columns}
          dataSource={variantList}
        />
      </Form>
      <VariantForm {...popup} onClose={onClose} />
    </Page>
  );
};

export default withAuthorization(withRouter(Variant));