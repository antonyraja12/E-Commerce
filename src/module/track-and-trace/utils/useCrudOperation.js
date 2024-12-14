import { useState, useEffect } from "react";
import { Form, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const useCrudOperations = (service, filters = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const { confirm } = Modal;
  useEffect(() => {
    fetchData(filters);
  }, []);

  const fetchData = async (filter = {}) => {
    setIsLoading(true);
    try {
      const response = await service.list(filter);
      setData(response.data);
      setFileUploaded(true);
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      setFileName(file.name);

      formData.append("file", file);

      const response = await service.uploadFile(formData);
      if (response.status === 200) {
        message.success("File uploaded successfully");
        fetchData();
      } else {
        message.error("Failed to upload file");
      }
    } catch (error) {
      message.error("Error uploading file");
    }
    return false; // Prevent default upload behavior
  };
  const showDeleteConfirm = (okCallBack) => {
    confirm({
      title: "Are you sure to delete these entries?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        okCallBack();
      },
      onCancel() {
        // Optionally handle cancel event
      },
    });
  };
  const handleDelete = async () => {
    try {
      showDeleteConfirm(async () => {
        for (let id of selectedRowKeys) {
          const response = await service.delete(id);
          if (response.status !== 200) {
            message.error(`Failed to delete item with ID: ${id}`);
          }
        }
        message.success("Selected rows deleted successfully");
        fetchData();
        setEditingKey("");
        setSelectedRowKeys([]);
      });
    } catch (error) {
      message.error("Failed to delete selected rows");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await service.exportFile();
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename || "data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        message.error("Failed to download file");
      }
    } catch (error) {
      message.error("Failed to download file");
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const response = await service.update(row, key);
      setEditingKey("");
      message.success("Record updated successfully");
      fetchData();
      return response;
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Failed to save the record");
      setEditingKey("");
      throw error;
    }
  };

  return {
    data,
    isLoading,
    setIsLoading,
    selectedRowKeys,
    fileUploaded,
    editingKey,
    setEditingKey,
    form,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
    cancel,
    save,
    fileName,
    setData,
  };
};

export default useCrudOperations;
