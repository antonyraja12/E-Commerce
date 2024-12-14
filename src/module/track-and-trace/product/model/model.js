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
import ModelService from "../../../../services/track-and-trace-service/model-service";
import ModelForm from "./model-form";
import { publicUrl, remoteAsset } from "../../../../helpers/url";
const { Option } = Select;

const Model = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [modelList, setModelList] = useState([]);

  const [popup, setPopup] = useState({});
  const title = "Model";
  const service = new ModelService();
  const { access } = props;

  const {
    data,
    setData,
    isLoading,
    setIsLoading,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
    editingKey,
    setEditingKey,
    form,
    save,
    cancel,
  } = useCrudOperations(service);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const showImageModal = (imageUrl, productId) => {
    setPreviewImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setPreviewImage(null);
  };

  useEffect(() => {
    setModelList(data);
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
      title: "Logo",
      dataIndex: "modelImage",
      key: "modelId",
      width: 50,
      render: (value, record) => {
        let imageUrl = value ? `${publicUrl}/${value}` : null;
        return (
          <Avatar
            shape="square"
            onClick={() => showImageModal(imageUrl)}
            src={imageUrl}
            size={"large"}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "modelName",
      key: "modelName",
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
      dataIndex: "modelId",
      key: "modelId",
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
      return e.modelName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setModelList(result);
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
          rowKey="modelId"
          columns={columns}
          dataSource={modelList}
        />
      </Form>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        <img
          src={previewImage}
          alt=" No preview"
          style={{ width: "100%", height: "100%" }}
        />
      </Modal>
      <ModelForm {...popup} onClose={onClose} />
    </Page>
  );
};

export default withAuthorization(withRouter(Model));
