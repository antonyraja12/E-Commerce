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
import CategoryService from "../../../../services/track-and-trace-service/category-service";
import CategoryForm from "./categoryForm";
const { Option } = Select;

const Category = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popup, setPopup] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [categoryList, setCategorytList] = useState([]);
  const service = new CategoryService();
  const title = "Category";
  const { access } = props;
  const { form } = Form.useForm();

  const { data, isLoading, fetchData, setIsLoading, setData } =
    useCrudOperations(service);

  useEffect(() => {
    setCategorytList(data);
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
      dataIndex: "categoryName",
      key: "categoryName",
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
      dataIndex: "categoryId",
      key: "categoryId",
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
      return e.categoryName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setCategorytList(result);
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
          rowKey="categoryId"
          columns={columns}
          dataSource={categoryList}
        />
      </Form>
      <CategoryForm {...popup} onClose={onClose} />
    </Page>
  );
};

export default withAuthorization(withRouter(Category));
