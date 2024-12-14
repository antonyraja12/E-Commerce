import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Form,
  Row,
  Col,
  Select,
  Input,
  Radio,
  Button,
  Card,
  Table,
  InputNumber,
  Space,
  message,
  Spin,
} from "antd";
import { useProductMaster } from "../../../hooks/useProductMaster";
import { useWorkStation } from "../../../hooks/useWorkStation";
import { useDeviceType } from "../../../hooks/useDeviceType";
import { useEffect, useState } from "react";
import WorkInstructionService from "../../../services/track-and-trace-service/work-instruction-service";
import { FileUploadService } from "../../../services/file-upload-service";
import { publicUrl } from "../../../helpers/url";
import { useNavigate, useParams } from "react-router-dom";
import { useWatch } from "antd/es/form/Form";
import ProductService from "../../../services/track-and-trace-service/product-service";

function WorkInstructionFormNew({ disabled }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isWsLoading, wsList] = useWorkStation();
  const [isProductLoading, productList] = useProductMaster();
  const [isDeviceTypeLoading, deviceTypeList] = useDeviceType();
  const [loaders, setLoaders] = useState({
    loading: false,
    saving: false,
  });
  const [childOptions, setChildOptions] = useState([]);
  useEffect(() => {
    let service = new ProductService();
    service.list().then(({ data }) => {
      setChildOptions(
        data
          .filter((e) => e.type != "PARENT")
          ?.map((e) => ({
            value: e.code,
            label: e.code,
          }))
      );
    });
  }, []);
  useEffect(() => {
    if (id) {
      setLoaders((state) => ({ ...state, loading: true }));
      const service = new WorkInstructionService();
      service
        .retrieve(id)
        .then(({ data }) => {
          let obj = {
            ...data,
            workInstructionTasks: data.workInstructionTasks
              ?.map((e) => ({
                ...e,
                workInstructionTaskSteps: e.workInstructionTaskSteps
                  ?.map((el) => {
                    let fileList = [];
                    const file = el.file;

                    if (file) {
                      const link = `${publicUrl}/${file}`;
                      fileList = [
                        {
                          uid: "-1",
                          name: "file",
                          status: "done",
                          url: link,
                          response: file,
                        },
                      ];
                    }
                    return {
                      ...el,
                      fileList: fileList,
                    };
                  })
                  .sort((a, b) => a.sequenceNumber - b.sequenceNumber),
              }))
              .sort((a, b) => a.seqNo - b.seqNo),
          };

          form.setFieldsValue(obj);
        })
        .finally(() => {
          setLoaders((state) => ({ ...state, loading: false }));
        });
    }
  }, [id]);

  const onFinish = (value) => {
    let obj = {
      ...value,
      workInstructionTasks: value.workInstructionTasks?.map((e) => ({
        ...e,
        workInstructionTaskSteps: e.workInstructionTaskSteps?.map((el) => {
          const fileList = el.fileList;
          let file = null;

          if (fileList?.length > 0) {
            file = fileList[0].response;
          }
          const temp = { ...el };
          delete temp.fileList;
          return {
            ...temp,
            file: file,
          };
        }),
      })),
    };
    setLoaders((state) => ({ ...state, saving: true }));
    const service = new WorkInstructionService();
    let req;
    if (id) {
      req = service.update(obj, id);
    } else {
      req = service.add(obj);
    }

    req
      .then(({ data }) => {
        message.success("Saved Successfully");
        navigate("../");
      })
      .finally(() => {
        setLoaders((state) => ({ ...state, saving: false }));
      });
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
          const percentCompleted = Math.round();
          onProgress({ percent: percentCompleted });
        },
      });
      const link = `${publicUrl}/${response.data}`;
      onSuccess(response.data);
    } catch (error) {
      onError(error);
    }
  };
  // const onRemove = ({ response }) => {
  //   const service = new FileUploadService();
  //   return service.deleteFile(response);
  // };

  const onRemove = ({ response, name, url }) => {
    if (!response && !url && !name) {
      message.error("Invalid file data for removal");
      return false;
    }

    const filePath = response?.path || url || name;

    const service = new FileUploadService();

    return service
      .deleteFile(filePath)
      .then(() => {
        message.success("File removed successfully");
        return true;
      })
      .catch((error) => {
        // console.error("Error removing file:", error);
        message.error("Failed to remove file");
        return false;
      });
  };

  const getValueFromEvent = ({ file, fileList }) => {
    return fileList;
    // console.log(file);
  };

  const beforeUpload = (file) => {
    const allowedExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isImage = allowedExtensions.includes(fileExtension);

    if (!isImage) {
      message.error(
        `${
          file.name
        } is not a valid image file. Allowed formats: ${allowedExtensions.join(
          ", "
        )}`
      );
      return Upload.LIST_IGNORE;
    }

    message.success(`${file.name} uploaded successfully.`);
    return true;
  };

  const stepsColumns = (key, removeStep, fields) => [
    {
      title: "Seq.No",
      dataIndex: "sequenceNumber",
      width: 40,
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "sequenceNumber"]}
            noStyle
          >
            <InputNumber min={1} style={{ width: "100%" }} controls={false} />
          </Form.Item>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "description"]}
            noStyle
          >
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "deviceType",
      width: 80,
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            style={{ width: "100%" }}
            name={[_.name, "deviceType"]}
            noStyle
          >
            <Select
              options={deviceTypeList.options}
              loading={isDeviceTypeLoading}
              style={{ width: "100%" }}
              onChange={(selectedValue) => {
                form.setFieldsValue({
                  workInstructionTasks: form
                    .getFieldValue("workInstructionTasks")
                    .map((task, i) => {
                      if (i === index) {
                        return {
                          ...task,
                          expectedValueType:
                            selectedValue === "SCANNER" ? "dropdown" : "input",
                        };
                      }
                      return task;
                    }),
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "action"]}
            style={{ width: "100%" }}
            noStyle
          >
            <Select
              style={{ width: "100%" }}
              options={[
                { label: "Read", value: "READ" },
                { label: "Write", value: "WRITE" },
              ]}
            />
          </Form.Item>
        );
      },
    },

    {
      title: "Expected Value",
      dataIndex: "expectedValue",
      width: 150,
      render: (value, _, index) => {
        const allValues = form.getFieldsValue(true);
        const deviceType =
          allValues?.workInstructionTasks?.[key]?.workInstructionTaskSteps?.[
            index
          ]?.deviceType;
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "expectedValue"]}
            noStyle
          >
            {deviceType === "SCANNER" ? (
              <Select
                showSearch
                options={childOptions}
                style={{ width: "100%" }}
              />
            ) : (
              <Input />
            )}
          </Form.Item>
        );
      },
    },
    {
      title: "Tolerance",
      dataIndex: "tolerance",
      width: 50,
      render: (value, _, index) => {
        return (
          <Form.Item name={[_.name, "tolerance"]} noStyle>
            <InputNumber />
          </Form.Item>
        );
      },
    },
    {
      title: "File",
      dataIndex: "fileList",
      align: "center",
      width: 80,
      render: (value, _, index) => {
        return (
          <Form.Item
            shouldUpdate
            name={[_.name, "fileList"]}
            noStyle
            getValueFromEvent={getValueFromEvent}
            valuePropName="fileList"
          >
            <Upload
              withCredentials
              customRequest={customRequest}
              listType="text"
              onRemove={(e) => onRemove(e)}
              maxCount={1}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        );
      },
    },
    {
      title: "",
      key: "id",
      dataIndex: "sequenceNumber",
      render: (value, _, index) => {
        return (
          <Form.Item noStyle>
            <CloseOutlined onClick={() => removeStep(_.name)} />
          </Form.Item>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={loaders.loading}>
        <Form
          disabled={disabled}
          onFinish={onFinish}
          form={form}
          layout="vertical"
          initialValues={{
            status: true,
            workInstructionTasks: [{}],
          }}
        >
          <Row gutter={[10, 10]}>
            <Col lg={6}>
              <Card>
                <Form.Item
                  name="productId"
                  label="Product Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter product name",
                    },
                  ]}
                >
                  <Select
                    loading={isProductLoading}
                    placeholder="Select product name"
                    options={productList?.parentOptions}
                    showSearch
                  />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter work description",
                    },
                  ]}
                >
                  <Input placeholder="Enter work description" />
                </Form.Item>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>In-Active</Radio>
                  </Radio.Group>
                </Form.Item>
              </Card>
            </Col>
            <Col lg={18}>
              <Form.List name="workInstructionTasks">
                {(fields, { add, remove }) => (
                  <Space
                    direction="vertical"
                    size={10}
                    style={{ width: "100%" }}
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <Card>
                        <Row gutter={[10, 10]} align="top">
                          <Col lg={3}>
                            <Form.Item
                              {...restField}
                              name={[name, "seqNo"]}
                              label="Seq.No"
                              rules={[
                                {
                                  required: true,
                                  // message: "Please select a workstation",
                                },
                              ]}
                            >
                              <InputNumber min={1} />
                            </Form.Item>
                          </Col>
                          <Col lg={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "workStationId"]}
                              label="Workstation"
                              rules={[
                                {
                                  required: true,
                                  // message: "Please select a workstation",
                                },
                              ]}
                            >
                              <Select
                                options={wsList?.options}
                                loading={isWsLoading}
                                showSearch
                              />
                            </Form.Item>
                          </Col>
                          <Col lg={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "workInstructionTaskName"]}
                              // noStyle
                              label="Task Name"
                              rules={[
                                {
                                  required: true,
                                  // message: "Please select a workstation",
                                },
                              ]}
                            >
                              <Input placeholder="New Task" />
                            </Form.Item>
                          </Col>
                          <Col style={{ marginLeft: "auto" }}>
                            <Form.Item noStyle>
                              <CloseOutlined onClick={() => remove(name)} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.List
                              name={[name, "workInstructionTaskSteps"]}
                            >
                              {(
                                stepFields,
                                { add: addStep, remove: removeStep }
                              ) => (
                                <>
                                  <Table
                                    size="small"
                                    summary={() => (
                                      <Table.Summary.Row>
                                        <Table.Summary.Cell
                                          colSpan={8}
                                          align="center"
                                        >
                                          <Form.Item noStyle>
                                            <Button
                                              type="dashed"
                                              onClick={() => {
                                                let num = 0;
                                                if (stepFields.length > 0) {
                                                  let last =
                                                    stepFields[
                                                      stepFields.length - 1
                                                    ];

                                                  num = form.getFieldValue([
                                                    "workInstructionTasks",
                                                    name,
                                                    "workInstructionTaskSteps",
                                                    last.name,
                                                    "sequenceNumber",
                                                  ]);
                                                }

                                                addStep({
                                                  sequenceNumber: ++num,
                                                });
                                              }}
                                            >
                                              Add Step
                                            </Button>
                                          </Form.Item>
                                        </Table.Summary.Cell>
                                      </Table.Summary.Row>
                                    )}
                                    bordered
                                    pagination={false}
                                    columns={stepsColumns(key, removeStep, [
                                      "workInstructionTasks",
                                      name,
                                      "workInstructionTaskSteps",
                                    ])}
                                    dataSource={stepFields}
                                  />
                                </>
                              )}
                            </Form.List>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() =>
                          add({
                            workInstructionTaskSteps: [
                              {
                                sequenceNumber: 1,
                              },
                            ],
                          })
                        }
                        block
                      >
                        Add Task
                      </Button>
                    </Form.Item>
                  </Space>
                )}
              </Form.List>
              <Button
                style={{ marginBottom: "5px" }}
                type="primary"
                htmlType="submit"
                loading={loaders.saving}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
}

export default WorkInstructionFormNew;
