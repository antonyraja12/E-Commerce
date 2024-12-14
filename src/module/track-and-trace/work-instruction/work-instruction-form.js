import {
  Button,
  Col,
  Collapse,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
  CloseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import WorkInstructionService from "../../../services/track-and-trace-service/work-instruction-service";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { withForm } from "../../../utils/with-form";
import Popups from "../../../utils/page/popups";
import ProductService from "../../../services/track-and-trace-service/product-service";
import Page from "../../../utils/page/page";
import { Link, useNavigate } from "react-router-dom";
import { withRouter } from "../../../utils/with-router";
import { EditButton } from "../../../utils/action-button/action-button";
import DeviceTypeService from "../../../services/track-and-trace-service/device-type-service";
import "./work-instruction.css";
import { FaUpload } from "react-icons/fa6";
import WorkInstructionTaskService from "../../../services/track-and-trace-service/work-instruction-task-service";
import WorkInstructionStepsService from "../../../services/track-and-trace-service/work-instruction-steps-service";
import { remoteAsset } from "../../../helpers/url";
import Slider from "react-slick";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs } from "antd";

const { Title, Paragraph } = Typography;

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;

const WorkInstructionForm = (props) => {
  const { form, params, disabled } = props;
  const navigate = useNavigate(); // Get the navigate function
  const [isLoading, setIsLoading] = useState(false);
  const [workStationOptions, setWorkStationOptions] = useState([]);
  const [parentProductOptions, setParentProductOptions] = useState([]);
  const [deviceTypeOption, setDeviceTypeOption] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [fileList, setFilelist] = useState([]);
  const [taskFiles, setTaskFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [workInstructionId, setWorkInstructionId] = useState(null);
  const [newActiveKey, setNewActiveKey] = useState(0);
  const [items, setItems] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);
  const service = new WorkInstructionService();
  const workStationService = new WorkStationService();
  const workInstructionTaskService = new WorkInstructionTaskService();
  const workInstructionStepsService = new WorkInstructionStepsService();
  const productService = new ProductService();
  const deviceTypeService = new DeviceTypeService();
  useEffect(() => {
    fetchWorkStationOptions();
    fetchProductOptions();
    fetchDeviceTypeOptions();
  }, []);
  useEffect(() => {
    if (params?.id) {
      onRetrieve(params.id);
    }
  }, [params?.id]);

  const fetchWorkStationOptions = async () => {
    setIsLoading(true);
    try {
      const response = await workStationService.list({ active: true });
      setWorkStationOptions(
        response.data?.map((e) => ({
          label: e.workStationName,
          value: e.workStationId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch workstations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductOptions = async () => {
    setIsLoading(true);
    try {
      const response = await productService.list({ active: true });

      const parentProducts = response.data.filter((e) => e.type === "PARENT");
      const childProducts = response.data.filter((e) => e.type === "CHILD");

      setParentProductOptions(
        parentProducts.map((e) => ({
          label: e.productName,
          value: e.productId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDeviceTypeOptions = async () => {
    setIsLoading(true);
    try {
      const response = await deviceTypeService.list({ active: true });
      setDeviceTypeOption(
        response.data?.map((e) => ({
          label: e.deviceTypeName,
          value: e.deviceTypeName,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch workstations");
    } finally {
      setIsLoading(false);
    }
  };

  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      // message.error("Failed to fetch work instruction");
    } finally {
      setIsLoading(false);
    }
  };

  const patchForm = (data) => {
    const key = data.workInstructionTasks.length - 1;
    setNewActiveKey(key);
    const tasks = data.workInstructionTasks.map((task, index) => {
      const filesArray = task.files
        ? task.files?.split(",").map((filePath, fileIndex) => ({
            filePath,
          }))
        : [];
      setPreviewFiles((prev) => {
        const updatedPreviewFiles = [...prev];
        updatedPreviewFiles[task.seqNo - 1] = filesArray; // Store the files for each task
        return updatedPreviewFiles;
      });

      const processedFiles = filesArray.map((file) => {
        try {
          return {
            uid: file.filePath,
            name: "Instruction image",
            status: "done",
            url: remoteAsset(file.filePath),
          };
        } catch (error) {
          console.error("Error processing file:", error);
          return null;
        }
      });
      const validFiles = processedFiles.filter((file) => file !== null);
      setTaskFiles((prevTaskFiles) => {
        const updatedTaskFiles = [...prevTaskFiles];
        updatedTaskFiles[task.seqNo - 1] = validFiles;
        return updatedTaskFiles;
      });

      const sortedSteps = task.workInstructionTaskSteps.map((step) => ({
        sequence: step.sequenceNumber,
        description: step.description,
        action: step.action,
        expectedValue: step.expectedValue,
        tolerance: step.tolerance,
        deviceType: step.deviceType,
      }));
      sortedSteps.sort((a, b) => a.sequence - b.sequence);

      return {
        workInstructionTaskName: task.workInstructionTaskName,
        workStation: task.workStationId,
        seqNo: task.seqNo,
        files: validFiles,
        steps: sortedSteps,
      };
    });
    tasks.sort((a, b) => a.seqNo - b.seqNo);
    const formatedData = {
      productId: data.productMaster?.productId,
      description: data.description,
      status: data.status,
      tasks: tasks,
    };
    setItems([formatedData]);

    form.setFieldsValue(formatedData);
  };
  // const onClose = () => {
  //   form.resetFields();
  //   props.onClose();
  // };
  const handlePopupOpen = (index) => {
    setCurrentTaskIndex(index);
    setModalOpen(true);
  };

  const handlePopupClose = () => {
    setModalOpen(false);
  };
  const handleFileChange = (index, info) => {
    const uploadedFiles = info.fileList;

    setTaskFiles((prevTaskFiles) => {
      const updatedTaskFiles = [...prevTaskFiles];

      if (!Array.isArray(updatedTaskFiles[index])) {
        updatedTaskFiles[index] = [];
      }

      // Merge existing files with the newly uploaded files
      updatedTaskFiles[index] = [
        // Existing files
        ...uploadedFiles, // New uploads
      ].map((file) => ({
        ...file,
        status: "done", // Mark all as done if they're uploaded
      }));

      return updatedTaskFiles;
    });
  };
  const handleViewClick = (index) => {
    setModalVisible(true);
    setCurrentTaskIndex(index);
  };
  const handleRemove = (targetKey, fields, remove) => {
    const targetIndex = fields.findIndex((e) => e.key == targetKey);
    const fieldKey = fields.find((e) => e.name !== targetIndex);
    if (targetIndex !== -1) {
      Modal.confirm({
        title: "Do you want to delete this task?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          remove(targetIndex);
          setActiveKey(fieldKey.fieldKey);
        },
        onCancel: () => {
          console.log("Delete action cancelled");
        },
      });
    }
  };
  const handleRemoveSteps = (remove, field) => {
    Modal.confirm({
      title: "Do you want to delete this step?",
      // content: "Once deleted, the information cannot be recovered.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        remove(field.name);
      },
      onCancel: () => {
        console.log("Delete action cancelled");
      },
    });
  };
  const handleCancelEdit = () => {
    Modal.confirm({
      title: "Are you sure you want to cancel your changes?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        props.navigate(`..`);
      },
      onCancel: () => {
        console.log("Delete action cancelled");
      },
    });
  };
  const onTabChange = (key) => {
    setActiveKey(key);
    setCurrentTaskIndex(key);
  };
  const onFinish = async (value) => {
    const productId = value.productId;
    const productResponse = await productService.retrieve(productId);
    const data = {
      description: value.description,
      productId: productId,
      status: value.status,
    };

    let response;
    if (params.id) {
      response = await service.update(data, params.id);
    } else {
      response = await service.save(data);
    }

    if (response.status === 200) {
      setWorkInstructionId(response.data.workInstructionId);

      {
        response.data.workInstructionId &&
          onFinishTask(value, response.data.workInstructionId);
      }
      const action = params.id ? "updated" : "added";
      message.success(`Work instruction ${action} successfully`);
    } else {
      message.error("Something went wrong, Try again!");
    }
  };

  const onFinishTask = async (values, instructionId) => {
    const tasksToSubmit = values.tasks.map((task, index) => ({
      workInstructionId: instructionId,
      workStationId: task.workStation,
      seqNo: index + 1,

      workInstructionTaskName: task.workInstructionTaskName,
      workInstructionTaskSteps: task.steps.map((step) => ({
        sequenceNumber: step.sequence,
        description: step.description,
        action: step.action,
        expectedValue: step.expectedValue,
        tolerance: step.tolerance,
        deviceType: step.deviceType,
      })),
      file: taskFiles[index] ? taskFiles[index] : [],
    }));

    try {
      for (const task of tasksToSubmit) {
        const formData = new FormData();

        for (const file of task.file) {
          if (file.originFileObj) {
            formData.append("file", file.originFileObj);
          } else if (file.url) {
            const response = await fetch(file.url); // Fetch the file from the URL
            const blob = await response.blob(); // Convert the response to a blob (binary)
            const fileName = file.uid || "existing_file."; // Set a filename (or extract from URL if needed)
            formData.append(
              "file",
              new File([blob], fileName, { type: getType(file.url) })
            );
          }
        }
        const workStationId = task.workStationId;
        const workInstructionTaskName = task.workInstructionTaskName;
        const seqNo = task.seqNo;

        let taskResponse;
        if (params.id) {
          taskResponse = await workInstructionTaskService.save(
            formData,
            params.id,
            workStationId,
            workInstructionTaskName,
            seqNo
          );
        } else {
          taskResponse = await workInstructionTaskService.save(
            formData,
            instructionId,
            workStationId,
            workInstructionTaskName,
            seqNo
          );
        }

        if (taskResponse.status === 200) {
          if (taskResponse.data.workStationId) {
            onFinishSteps(
              task.workInstructionTaskSteps,
              taskResponse.data.workStationId,
              instructionId
            );
          }
        } else {
          throw new Error(
            `Failed to save task for ${task.workInstructionTaskName}`
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const onFinishSteps = async (steps, stationId, instructionId) => {
    try {
      for (const step of steps) {
        let response;
        if (params.id) {
          response = await workInstructionStepsService.save(
            step,
            params.id,
            stationId
          );
        } else {
          response = await workInstructionStepsService.save(
            step,
            instructionId,
            stationId
          );
        }

        if (response.status === 200) {
          props.navigate(`..`);
        } else {
          throw new Error("Failed to save one or more steps");
        }
      }
    } catch (error) {
      message.error(error.message || "An error occurred while saving steps.");
    }
  };
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  const getType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "pdf":
        return "application/pdf";
      case "doc":
      case "docx":
        return "application/msword";
      case "xls":
      case "xlsx":
        return "application/vnd.ms-excel";
      default:
        return "application/octet-stream";
    }
  };
  const update = (id) => {
    props.navigate(`../${id}/edit`);
  };

  const previewFile = previewFiles ? previewFiles[currentTaskIndex] : [];
  const DraggableTabNode = ({ className, ...props }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: props["data-node-key"],
      });
    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: "move",
    };
    return React.cloneElement(props.children, {
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
    });
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const tasks = form.getFieldValue("tasks") || [];
      const activeIndex = tasks.findIndex((task, index) => index == active.id);
      const overIndex = tasks.findIndex((task, index) => index == over.id);
      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(activeIndex, 1);
      reorderedTasks.splice(overIndex, 0, movedTask);
      const reorder = {
        tasks: reorderedTasks.map((task, index) => ({
          ...task,
          seqNo: index + 1,
        })),
      };

      form.setFieldsValue(reorder);
    }
  };

  return (
    <Page
      title="Work Instruction Form"
      action={
        <>
          {disabled ? (
            <Button
              data-testid="edit-button"
              name="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => update(params.id)}
            >
              EDIT
            </Button>
          ) : (
            params.id && (
              <Col>
                <Button onClick={handleCancelEdit}>Close</Button>
              </Col>
            )
          )}
        </>
      }
    >
      <Spin spinning={false}>
        <Form
          size="small"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            status: true,
            tasks: [{ steps: [{}], files: [] }],
          }}
          disabled={props.disabled ? true : false}
        >
          <Row gutter={24}>
            <Col xs={24} sm={8} md={8} lg={6} xl={4}>
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
                  placeholder="Select product name"
                  options={parentProductOptions}
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} md={8} lg={6} xl={4}>
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
            </Col>
            <Col xs={24} sm={8} md={8} lg={6} xl={4}>
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
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.List name="tasks">
                {(fields, { add, remove }) => (
                  <>
                    <Tabs
                      type={disabled ? "card" : "editable-card"}
                      activeKey={activeKey}
                      onChange={onTabChange}
                      onEdit={(targetKey, action) => {
                        if (props.disabled) {
                          return;
                        }
                        if (action === "remove") {
                          fields.length > 1 &&
                            handleRemove(targetKey, fields, remove);
                        }
                        if (action === "add") {
                          const newIndex =
                            fields[fields.length - 1].fieldKey + 1;
                          setNewActiveKey(newIndex);
                          // const newTask = { key: `${newIndex + 1}` };
                          const newTaskKey = newActiveKey + 1;
                          add({
                            steps: [
                              {
                                sequence: "",
                                action: "",
                                expectedValue: "",
                                description: "",
                                tolerance: "",
                              },
                            ],
                          });

                          setActiveKey(newTaskKey);
                        }
                      }}
                      tabBarGutter={10}
                      closable={
                        disabled
                          ? !props.disabled
                          : fields.length === 1
                          ? false
                          : true
                      }
                      items={fields.map(
                        ({ key, name, fieldKey, ...restField }, index) => ({
                          key: key,
                          label: (
                            <Form.Item
                              name={[name, "workInstructionTaskName"]}
                              noStyle
                            >
                              <Input
                                placeholder="New Task"
                                bordered={false}
                                style={{ width: 150, cursor: "pointer" }}
                                readOnly
                                disabled={false}
                              />
                            </Form.Item>
                          ),
                          children: (
                            <>
                              <Row gutter={[16]}>
                                <Form.Item
                                  name="workInstructionId"
                                  hidden
                                ></Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "seqNo"]}
                                  hidden
                                >
                                  <InputNumber value={index + 1} />
                                </Form.Item>

                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "workInstructionTaskName"]}
                                    // noStyle
                                    label="Task Name"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select a workstation",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="New Task" />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "workStation"]}
                                    label="Workstation"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select a workstation",
                                      },
                                    ]}
                                  >
                                    <Select
                                      options={workStationOptions}
                                      showSearch
                                    />
                                  </Form.Item>
                                </Col>

                                <Col xs={24} sm={24} md={3} lg={4} xl={4}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "file"]}
                                    label=" "
                                  >
                                    {!disabled && (
                                      <Tooltip title="Click to upload image">
                                        <Button
                                          type="text"
                                          icon={<FaUpload />}
                                          onClick={() => handlePopupOpen(index)}
                                        >
                                          Upload
                                        </Button>
                                      </Tooltip>
                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[10, 10]}>
                                {disabled && (
                                  <Col span={24}>
                                    <Collapse
                                      bordered={false}
                                      defaultActiveKey={["1"]} // Change to your preference
                                      expandIcon={({ isActive }) => (
                                        <CaretRightOutlined
                                          rotate={isActive ? 90 : 0}
                                        />
                                      )}
                                      items={[
                                        {
                                          key: "1",
                                          label: "Images",

                                          onClick: () => {
                                            setModalVisible(true);
                                            // setCurrentTaskIndex(index);
                                          },
                                          children: modalVisible && (
                                            <div
                                              style={{
                                                backgroundColor: "#fff",
                                              }}
                                            >
                                              <Slider {...settings}>
                                                {previewFile &&
                                                previewFile.length > 0 ? (
                                                  previewFile.map(
                                                    (image, index) => (
                                                      <div key={index}>
                                                        <Image
                                                          style={{
                                                            width: 200,
                                                            height: 100,
                                                          }}
                                                          src={remoteAsset(
                                                            image.filePath
                                                          )}
                                                          alt={`Preview ${
                                                            index + 1
                                                          }`}
                                                        />
                                                      </div>
                                                    )
                                                  )
                                                ) : (
                                                  <div>
                                                    No images available for
                                                    preview
                                                  </div>
                                                )}
                                              </Slider>
                                            </div>
                                          ),

                                          // </Modal>
                                        },
                                      ]}
                                    ></Collapse>
                                  </Col>
                                )}

                                <Col span={24}>
                                  {
                                    <Collapse
                                      bordered={false}
                                      defaultActiveKey={["2"]} // Change to your preference
                                      expandIcon={({ isActive }) => (
                                        <CaretRightOutlined
                                          rotate={isActive ? 90 : 0}
                                        />
                                      )}
                                      style={
                                        {
                                          // background: "#f0f2f5", // Your desired background color
                                        }
                                      }
                                      items={[
                                        {
                                          key: "2",
                                          label: "Steps",
                                          children: (
                                            <Row>
                                              <Form.List name={[name, "steps"]}>
                                                {(
                                                  stepFields,
                                                  { add, remove }
                                                ) => (
                                                  <table className="table">
                                                    <thead>
                                                      <tr>
                                                        <th width="50px">
                                                          Sq.No
                                                        </th>
                                                        <th width="30%">
                                                          Description
                                                        </th>
                                                        <th width="20%">
                                                          Device Type
                                                        </th>
                                                        <th width="100px">
                                                          Action
                                                        </th>
                                                        <th width="150px">
                                                          Expected Value
                                                        </th>
                                                        <th width="100px">
                                                          Tolerance
                                                        </th>
                                                        <th width="100px">
                                                          Actions
                                                        </th>
                                                      </tr>
                                                    </thead>

                                                    <tbody>
                                                      {stepFields.map(
                                                        (field, index) => {
                                                          return (
                                                            <tr key={field.key}>
                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "sequence",
                                                                  ]}
                                                                  rules={[
                                                                    {
                                                                      required: true,
                                                                      message:
                                                                        "Enter sequence no",
                                                                    },
                                                                  ]}
                                                                >
                                                                  <InputNumber
                                                                    min={1}
                                                                  />
                                                                </Form.Item>
                                                              </td>
                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "description",
                                                                  ]}
                                                                  rules={[
                                                                    {
                                                                      required: true,
                                                                      message:
                                                                        "Enter description",
                                                                    },
                                                                  ]}
                                                                >
                                                                  <Input.TextArea
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      const currentValue =
                                                                        e.target
                                                                          .value;

                                                                      const steps =
                                                                        form.getFieldValue(
                                                                          "tasks",
                                                                          "steps"
                                                                        ) || [];
                                                                      const updatedSteps =
                                                                        steps.map(
                                                                          (
                                                                            step,
                                                                            idx
                                                                          ) =>
                                                                            idx ===
                                                                            index
                                                                              ? {
                                                                                  ...step,
                                                                                  description:
                                                                                    currentValue,
                                                                                }
                                                                              : step
                                                                        );
                                                                      form.setFieldsValue(
                                                                        {
                                                                          steps:
                                                                            updatedSteps,
                                                                        }
                                                                      );
                                                                    }}
                                                                  />
                                                                </Form.Item>
                                                              </td>
                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "deviceType",
                                                                  ]}
                                                                  rules={[
                                                                    {
                                                                      required: true,
                                                                      message:
                                                                        "Select device type",
                                                                    },
                                                                  ]}
                                                                >
                                                                  <Select
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                    }}
                                                                    options={
                                                                      deviceTypeOption
                                                                    }
                                                                    showSearch
                                                                  />
                                                                </Form.Item>
                                                              </td>
                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "action",
                                                                  ]}
                                                                  rules={[
                                                                    {
                                                                      required: true,
                                                                      message:
                                                                        "Select action",
                                                                    },
                                                                  ]}
                                                                >
                                                                  <Select
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                    }}
                                                                  >
                                                                    <Option value="READ">
                                                                      READ
                                                                    </Option>
                                                                    <Option value="WRITE">
                                                                      WRITE
                                                                    </Option>
                                                                  </Select>
                                                                </Form.Item>
                                                              </td>

                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "expectedValue",
                                                                  ]}
                                                                  rules={[
                                                                    {
                                                                      required: true,
                                                                      message:
                                                                        "Enter expected value",
                                                                    },
                                                                  ]}
                                                                >
                                                                  <Input />
                                                                </Form.Item>
                                                              </td>

                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                  {...field}
                                                                  name={[
                                                                    field.name,
                                                                    "tolerance",
                                                                  ]}
                                                                  // rules={[
                                                                  //   {
                                                                  //     // required: true,
                                                                  //     // message: "Enter tolerance",
                                                                  //   },
                                                                  // ]}
                                                                >
                                                                  <InputNumber />
                                                                </Form.Item>
                                                              </td>

                                                              <td>
                                                                <Form.Item
                                                                  noStyle
                                                                >
                                                                  <Space>
                                                                    <Button
                                                                      icon={
                                                                        <CloseOutlined />
                                                                      }
                                                                      onClick={() =>
                                                                        handleRemoveSteps(
                                                                          remove,
                                                                          field
                                                                        )
                                                                      }
                                                                      style={{
                                                                        display:
                                                                          stepFields.length ===
                                                                          1
                                                                            ? "none"
                                                                            : "block",
                                                                        backgroundColor:
                                                                          "rgba(255, 179, 179, 0.6)",
                                                                      }}
                                                                    />
                                                                    {!disabled &&
                                                                      stepFields.length ===
                                                                        index +
                                                                          1 && (
                                                                        <Button
                                                                          type="primary"
                                                                          onClick={() =>
                                                                            add()
                                                                          }
                                                                          icon={
                                                                            <PlusOutlined />
                                                                          }
                                                                          style={{
                                                                            marginLeft: 8,
                                                                          }}
                                                                        />
                                                                      )}
                                                                  </Space>{" "}
                                                                </Form.Item>
                                                              </td>
                                                            </tr>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                  </table>
                                                )}
                                              </Form.List>
                                            </Row>
                                          ),
                                        },
                                      ]}
                                    ></Collapse>
                                  }
                                </Col>
                              </Row>
                            </>
                          ),
                        })
                      )}
                      renderTabBar={(tabBarProps, DefaultTabBar) =>
                        props.disabled ? (
                          // If disabled, render the DefaultTabBar without DnD
                          <DefaultTabBar {...tabBarProps} />
                        ) : (
                          <DndContext
                            sensors={[sensor]}
                            onDragEnd={onDragEnd}
                            collisionDetection={closestCenter}
                          >
                            <SortableContext
                              items={fields.map((i) => i.key + 1)}
                              strategy={horizontalListSortingStrategy}
                            >
                              <DefaultTabBar {...tabBarProps}>
                                {(node) => (
                                  <DraggableTabNode
                                    {...node.props}
                                    key={node.key}
                                  >
                                    {node}
                                  </DraggableTabNode>
                                )}
                              </DefaultTabBar>
                            </SortableContext>
                          </DndContext>
                        )
                      }
                    />
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          <Row justify={"end"} gutter={[16]} style={{ marginTop: "20px" }}>
            {disabled ? (
              <Col>
                <Link to="../">
                  <Button disabled={false}>Back</Button>
                </Link>
              </Col>
            ) : (
              <Col>
                <Button type="primary" htmlType="submit">
                  {params.id ? "Update" : "Save"}
                </Button>
              </Col>
            )}
          </Row>
          {/* </Form>} */}
        </Form>
      </Spin>
      <Modal
        title="Upload File"
        centered
        open={modalOpen}
        onOk={handlePopupClose}
        onCancel={handlePopupClose}
        width={400}
        bodyStyle={{
          overflowY: "auto",
          maxHeight: "calc(300px)",
          width: "376px",
          paddingRight: "2em",
        }}
      >
        <Upload
          listType="picture"
          accept="image/png, image/jpeg"
          fileList={taskFiles[currentTaskIndex] || []}
          beforeUpload={() => false}
          onChange={(info) => handleFileChange(currentTaskIndex, info)}
          multiple={true}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Modal>
    </Page>
  );
};

export default withForm(withRouter(WorkInstructionForm));
