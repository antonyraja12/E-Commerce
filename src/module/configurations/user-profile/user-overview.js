import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  TreeSelect,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import PageForm from "../../../utils/page/page-form";
import FormItem from "antd/es/form/FormItem";
import CurrentUserService from "../../../services/user-list-current-user-service";
import { withForm } from "../../../utils/with-form";
import { response } from "msw";
import PhoneInput from "react-phone-input-2";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function OverviewCard(props) {
  // console.log(props, "Props");
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [editData, setEditData] = useState({});
  const [id, setId] = useState(0);
  // console.log("Data", props.data);

  const service = new CurrentUserService();

  const handleCancel = () => setPreviewOpen(false);
  useEffect(() => {
    service.getUser().then((response) => {
      setEditData(response.data);
      setId(response.data.userId);
      // console.log("res data", response.data);
      loadformData();
    });
  }, [id]);

  // const userRole = editData.role.roleName;
  const imgCount = form.getFieldValue("image")?.length;

  const loadformData = () => {
    props.form.setFieldsValue({
      userName: editData.userName,
      email: editData.email,
      contactNumber: editData.contactNumber,
      userGroupMappings: editData.userGroupMappings,
      imageUrl: editData.imageUrl,
      roleId: editData.role?.roleId,
      ahid: editData.ahid,
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = (value) => {
    // setFileList(value);

    if (Array.isArray(value)) {
      return value;
    }
    return value?.fileList;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const checkFileType = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    if (!isImage) {
      message.error("You can only upload image files (JPEG, PNG)");
    }
    return isImage;
  };
  const remove = (e) => {
    props.form.setFieldValue("image", []);
    props.form.setFieldValue("imagePath", null);
    // setState((state) => state);
    return false;
  };
  const beforeUpload = (file) => {
    checkFileType(file);
    return false;
  };

  const disableButton = () => {
    setComponentDisabled(!componentDisabled);
  };
  const upadteFun = (data) => {
    let formData = new FormData();
    for (let x in data) {
      if (
        x === "image" &&
        fileList &&
        fileList[0] &&
        fileList[0].originFileObj
      ) {
        formData.append(x, fileList?.[0].originFileObj);
      } else formData.append(x, data[x]);
    }
    formData.append("active", true);
    return service.save(formData, id);
  };

  const onFinish = (value) => {
    // console.log("id", value);
    upadteFun(value).then((response) => {
      // console.log("response", response);
      if (response.success) {
        setFileList([]); // Clear fileList after successful submission
      }
    });
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={22}>
          <h3>User Overview</h3>
        </Col>
        <Col span={2}>
          <Button
            type="text"
            onClick={disableButton}
            style={{
              width: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditOutlined />
          </Button>
        </Col>
      </Row>
      <Card style={{ borderRadius: "8px" }}>
        <Form
          size="small"
          className="form-horizontal"
          layout="vertical"
          form={props.form}
          labelAlign="left"
          colon={false}
          labelCol={{ sm: 24, xs: 24 }}
          wrapperCol={{ sm: 24, xs: 24 }}
          onFinish={onFinish}
          disabled={componentDisabled}
        >
          <Row>
            <Form.Item
              name="imageUrl"
              valuePropName="fileList"
              getValueFromEvent={handleChange}
            >
              <Upload
                // action="/upload.do"
                accept=".jpg, .jpeg, .png, .gif, .webp"
                maxCount={1}
                // onChange={this.imageCrop}
                beforeUpload={beforeUpload}
                listType="picture-circle"
                onRemove={remove}
              >
                {!imgCount && <PlusOutlined />}
              </Upload>
            </Form.Item>
            <Modal
              visible={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="User Name" name="userName">
                <Input autoFocus maxLength={20} style={{ height: "32px" }} />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input type="email" style={{ height: "32px" }} />
              </Form.Item>
              <Form.Item label="Contact No" name="contactNumber">
                <PhoneInput
                  country={"in"}
                  inputStyle={{ width: "100%", height: "32px" }}
                  disabled={componentDisabled}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Role" name="roleId">
                <Select style={{ height: "32px" }} showSearch>
                  {}
                </Select>
              </Form.Item>
              <Form.Item label="Entity" name="ahid">
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  style={{ width: "100%", height: "32px" }}
                  allowClear
                />
              </Form.Item>
              <Form.Item label="User Group" name="userGroupMappings">
                <Select
                  style={{ height: "32px" }}
                  mode="multiple"
                  allowClear
                  optionFilterProp="children"
                ></Select>
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default withForm(OverviewCard);
