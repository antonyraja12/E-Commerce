import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import CategoryService from "../../../../services/track-and-trace-service/category-service";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";
import ModelService from "../../../../services/track-and-trace-service/model-service";
import { UploadOutlined } from "@ant-design/icons";
import { publicUrl } from "../../../../helpers/url";
import { FileUploadService } from "../../../../services/file-upload-service";

const ModelForm = (props) => {
  const { form, open, mode, title, onClose, disabled } = props;

  const service = new ModelService();

  useEffect(() => {
    if (props.id) {
      patchForm(props.id);
    }
  }, [open, props.id]);

  const patchForm = (id) => {
    service.retrieve(id).then(({ data }) => {
      let fileList = [];
      const file = data.modelImage;

      if (data.modelImage) {
        const link = `${publicUrl}/${file}`;
        fileList = [
          {
            uid: "-1",
            name: data.modelImage,
            status: "done",
            url: link,
            response: file,
          },
        ];
      }
      form.setFieldsValue({
        ...data,
        fileList,
      });
    });
  };

  const closePopup = () => {
    form.resetFields();
    onClose();
  };

  const onFinish = (value) => {
    let val = {
      modelName: value.modelName,
      modelImage: value.fileList[0] ? value.fileList[0].response : null,
    };

    const response = props.id
      ? service.update(val, props.id)
      : service.add(val);

    response
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
          closePopup();
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {});
  };
  const getValueFromEvent = ({ file, fileList }) => {
    return fileList;
  };
  const customRequest = async ({
    file,
    filename,
    data,
    onProgress,
    onSuccess,
    onError,
  }) => {
    const formData = new FormData();
    formData.append(filename, file);
    const service = new FileUploadService();
    try {
      const response = await service.uploadFile(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress({ percent: percentCompleted });
        },
      });
      const link = `${publicUrl}/${response.data}`;
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    }
  };
  const onRemove = ({ response }) => {
    const service = new FileUploadService();
    return service.deleteFile(response);
  };
  return (
    <Popups
      destroyOnClose
      title={title}
      open={open}
      onCancel={closePopup}
      footer={[
        <Row justify="space-between">
          <Col>
            {(mode == "Add" || mode == "Update") && (
              <Button key="close" onClick={closePopup}>
                Cancel
              </Button>
            )}
          </Col>
          <Col>
            {(mode == "Add" || mode == "Update") && (
              <Button
                key="submit"
                type="primary"
                onClick={form.submit}
                htmlType="submit"
              >
                {mode == "Add" ? "Save" : "Update"}
              </Button>
            )}
          </Col>
        </Row>,
      ]}
    >
      <Form
        labelAlign="left"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        layout="horizontal"
        colon={false}
        onFinish={onFinish}
        className="form-horizontal"
        initialValues={{ status: true }}
        disabled={disabled}
      >
        <Form.Item
          label="Name"
          name={"modelName"}
          rules={[
            {
              required: true,
              message: "Please enter model name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"fileList"}
          label="Logo"
          getValueFromEvent={getValueFromEvent}
          valuePropName="fileList"
        >
          <Upload
            customRequest={customRequest}
            listType="picture"
            onRemove={(e) => onRemove(e)}
            maxCount={1}
          >
            <Button block icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>
        {/* <Form.Item
          label="Status"
          name={"status"}
          rules={[
            {
              required: true,
              message: "Please enter quantity",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item> */}
      </Form>
    </Popups>
  );
};
export default withForm(ModelForm);
