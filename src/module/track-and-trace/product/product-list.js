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
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Upload,
  message,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { remoteAsset } from "../../../helpers/url";
import ProductService from "../../../services/track-and-trace-service/product-service";
import {
  AddButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import CustomizeModel from "../utils/customizeModel";
import useCrudOperations from "../utils/useCrudOperation";
import ProductForm from "./product-form";
const { Option } = Select;

const Product = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popup, setPopup] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [productList, setProductList] = useState([]);
  const productService = new ProductService();
  const title = "Product Master";
  const { access } = props;
  const showImageModal = (image, id) => {
    setPreviewImage(image);
    setCurrentRecord(id);
    setShowModal(true);
  };

  const handleImageUpload = (file, id) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    productService
      .updateImage(formData, id)
      .then((res) => {
        if (res.status === 200) {
          message.success("Image uploaded successfully");
          hideImageModal();
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hideImageModal = () => {
    setPreviewImage(null);
    setCurrentRecord(null);
    setShowModal(false);
    fetchData();
  };
  const {
    data,
    isLoading,
    setIsLoading,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
    editingKey,
    form,
    save,
    cancel,
  } = useCrudOperations(productService);

  const parentColumns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      width: 50,
      render: (image, record) => {
        return (
          <Avatar
            shape="square"
            src={remoteAsset(image) || undefined}
            icon={!image ? <EditOutlined /> : null}
            size={!image ? null : "large"}
            onClick={() => showImageModal(image, record?.productId)}
          />
        );
      },
    },
    {
      dataIndex: "productName",
      key: "productName",
      title: "Product Name",
      editable: true,
    },

    {
      dataIndex: "code",
      key: "code",
      title: "Product Code",
      editable: true,
    },
    {
      dataIndex: "model",
      key: "model",
      title: "Product Model",
      editable: true,
    },
    {
      dataIndex: "variant",
      key: "variant",
      title: "Product Variant",
      editable: true,
    },
    {
      dataIndex: "cycleTime",
      key: "cycleTime",
      title: "Cycle Time",
      editable: true,
    },
    {
      dataIndex: "category",
      key: "category",
      title: "Category",
      editable: true,
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      align: "center",
      width: 50,
      editable: true,
      render: (value) => <Checkbox checked={value} />,
    },

    {
      title: "Action",
      dataIndex: "productId",
      key: "actions",
      width: 50,
      align: "center",
      fixed: "right",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => save(record.productId)}
            />
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={cancel}
            />
          </Space>
        ) : (
          <Space>
            {/* <EditButton
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            /> */}
            {<EditButton onClick={() => onEdit(value)} />}
            {<ViewButton onClick={() => onView(value)} />}
          </Space>
        );
      },
    },
  ];

  const childColumns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      width: 50,
      render: (image, record) => {
        return (
          <Avatar
            shape="square"
            src={remoteAsset(image) || undefined}
            icon={!image ? <EditOutlined /> : null}
            size={!image ? null : "large"}
            onClick={() => showImageModal(image, record?.productId)}
          />
        );
      },
    },
    {
      dataIndex: "productName",
      key: "productName",
      title: "Product Name",
      editable: true,
    },

    {
      dataIndex: "code",
      key: "code",
      title: "Product Code",
      editable: true,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 50,
      align: "center",
      render: (value) => <Checkbox checked={value} />,
    },
    {
      title: "",
      dataIndex: "productId",
      key: "actions",
      width: 50,
      align: "center",
      fixed: "right",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => save(record.productId)}
            />
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={cancel}
            />
          </Space>
        ) : (
          <Space>
            {/* <EditButton
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            /> */}
            {<EditButton onClick={() => onEdit(value)} />}
            {<ViewButton onClick={() => onView(value)} />}
          </Space>
        );
      },
    },
  ];
  const isEditing = (record) => record.productId === editingKey;
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
  const onClose = () => {
    setPopup({
      open: false,
      mode: null,
      title: null,
      id: null,
      disabled: false,
    });
    fetchData();
  };

  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    setSearchValue(s);
  };
  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  const filteredList = useMemo(() => {
    const str = searchValue?.toLowerCase();
    return data
      ?.filter((e) => {
        if (!searchValue) return true;
        return (
          e.productName?.toLowerCase()?.includes(str) ||
          e.code?.toLowerCase()?.includes(str)
        );
      })
      ?.reduce(
        (c, e) => {
          if (e.type === "PARENT") {
            c.parent.push(e);
          } else {
            c.child.push(e);
          }

          return c;
        },
        { child: [], parent: [] }
      );
  }, [data, searchValue]);
  return (
    <Page
      // title={title}
      action={
        <Space>
          {
            <>
              {
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  Delete
                </Button>
              }
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  handleDownload("product");
                }}
              >
                Download
              </Button>
            </>
          }
          {
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              icon={<UploadOutlined />}
            >
              Upload
            </Button>
          }
          {<AddButton onClick={add} />}
        </Space>
      }
    >
      <Form component={false} form={form}>
        <Row gutter={[10, 10]}>
          <Col lg={24}>
            <Tabs
              items={[
                {
                  key: "1",
                  label: "Product",
                  children: (
                    <Table
                      title={() => (
                        <Input.Search
                          style={{ maxWidth: 300, margin: "5px 0" }}
                          value={searchValue}
                          onChange={filter}
                          placeholder={"Search..."}
                        />
                      )}
                      size="small"
                      bordered
                      rowKey="productId"
                      columns={parentColumns}
                      dataSource={filteredList.parent}
                      rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                      }}
                    />
                  ),
                },
                {
                  key: "2",
                  label: "Child Part",
                  children: (
                    <Table
                      title={() => (
                        <Input.Search
                          style={{ maxWidth: 300, margin: "5px 0" }}
                          value={searchValue}
                          onChange={filter}
                          placeholder={"Search..."}
                        />
                      )}
                      size="small"
                      bordered
                      rowKey="productId"
                      columns={childColumns}
                      dataSource={filteredList.child}
                      rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                      }}
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
      <CustomizeModel
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleUpload={handleUpload}
      />
      <ProductForm {...popup} onClose={onClose} />
      <Modal
        open={showModal}
        title="Image Preview"
        footer={null}
        onCancel={() => hideImageModal()}
      >
        <Spin spinning={isLoading}>
          {previewImage && (
            <img
              src={remoteAsset(previewImage)}
              alt="Preview"
              style={{ width: "100%" }}
            />
          )}
          {currentRecord && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Upload
                showUploadList={false}
                beforeUpload={(file) => handleImageUpload(file, currentRecord)}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </div>
          )}
        </Spin>
      </Modal>
    </Page>
  );
};

export default withAuthorization(withRouter(Product));
