import React from "react";

import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";

import { DownOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

import { validateName, validateNumber } from "../../../../helpers/validation";
import WorkInstructionTaskService from "../../../../services/digital-work-instruction-service/work-instruction-task-service";
import WorkInstructionService from "../../../../services/digital-work-instruction-service/work-order-details-service";
import {
  DeleteButton,
  EditButton,
} from "../../../../utils/action-button/action-button";
import PageForm from "../../../../utils/page/page-form";
import PageList from "../../../../utils/page/page-list";
import { withForm } from "../../../../utils/with-form";
import { withRouter } from "../../../../utils/with-router";

const { Text, Title } = Typography;
const { Panel } = Collapse;

class WorkInstructionTaskFrom extends PageForm {
  service = new WorkInstructionTaskService();
  wiService = new WorkInstructionService();
  pageList = new PageList();
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.onFinish1 = this.onFinish1.bind(this);

    this.state = {
      isFormVisiblesub: false,
      subTaskVisible: false,
      fileList: [],
      taskList: [],
      expandedPanels: [],
      isVisible: false,
      editVisible: false,
    };
  }

  ListTask = () => {
    if (this.props.id)
      this.wiService.retrieve(this.props.id).then((response) => {
        this.setState((state) => ({
          ...state,
          wiData: response.data,
          taskList: this.service.convertToTree(response.data.task),
        }));
      });
  };
  componentDidMount() {
    // console.log("log", this.props.id);

    // this.props.form.resetFields();
    this.props.form.setFieldsValue({
      workInstructionId: this.props.id,
    });
    this.ListTask();

    if (this.state.taskList.length <= 0) {
      this.setState((state) => ({
        ...state,
        isFormVisiblesub: true,
      }));
    }
  }

  delete(id) {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.service
      .delete(id)
      .then(({ data }) => {
        if (data?.success) {
          message.success(data.message);
          this.ListTask();
        } else {
          message.error(data?.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  getImage = () => {
    console.log("imf", this.state.fileList);
  };

  saveFun(data, file) {
    let id = this.state.taskId;

    let formData = new FormData();
    for (let x in data) {
      if (x === "file" && file && file[0] && file[0].originFileObj) {
        formData.append(x, file?.[0].originFileObj);
      } else formData.append(x, data[x]);
    }

    if (this.state.taskId) {
      if (this.state.taskId) {
        return this.service.update(this.state.taskId, formData);
      }
    }
    return this.service.add(formData);
  }

  onFinish1 = (data) => {
    const { fileList } = this.state;
    this.setState((state) => ({ ...state, isLoading: true }));

    this.saveFun(data, fileList)
      .then(({ data, statuscode }) => {
        if (data.success === true) {
          this.onSuccess(data);
        } else {
          this.onSuccess({ success: true, message: "Added Successfully" });
        }
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.props.form.resetFields();
        this.ListTask();
        this.setState({
          ...this.state,
          isLoading: false,
          isFormVisible: false,
          isFormVisiblesub: false,
          subTaskVisible: false,
          fileList: [],
          activePanel: null,
          isVisible: false,
          editVisible: false,
          taskId: null,
        });
      });
  };

  addSubTask = (id) => {
    this.setState((state) => ({
      ...state,
      subTaskVisible: true,
      isFormVisiblesub: false,
      editVisible: false,
      taskId: null,
    }));
    this.props.form.setFieldsValue({
      parentId: id,
      workInstructionId: this.props.id,
      taskName: null,
      description: null,
      level: null,
    });
  };

  addTask = () => {
    if (this.state.isFormVisiblesub === false) {
      this.props.form.resetFields();
      this.setState((state) => ({
        ...state,
        isFormVisiblesub: true,
        subTaskVisible: false,
        editVisible: false,
        fileList: [],
      }));
    }
    this.props.form.setFieldsValue({
      parentId: null,
      workInstructionId: this.props.id,
    });
  };

  nextStep = () => {
    // console.log("id");
    this.state.taskList.length > 0
      ? this.props.next(this.props.id)
      : message.error("You need to create at least one task");
  };
  beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isGif = file.type === "image/gif";

    if (!isImage && !isVideo && !isGif) {
      message.error("You can only upload images, videos, and GIFs!");
      return false;
    }
  };
  handleChange = (info) => {
    let fileList = [...info.fileList];

    this.setState({ fileList });
  };
  handlePanelClick = (panelKey, id) => {
    this.setState((state) => ({
      ...state,
      activePanel: panelKey === this.state.activePanel ? null : panelKey,
    }));
    this.addSubTask(id);
  };

  editTask(index, taskId) {
    this.setState({
      editingTaskIndex: index,
      isVisible: true,
      taskId: taskId,
      isFormVisiblesub: false,
    });
    this.service.retrieve(taskId).then((response) => {
      this.props.form.setFieldsValue({
        taskName: response.data.taskName,
        file: response.data.taskImg,
        cycleTime: response.data.cycleTime,
        level: response.data.level,
        workInstructionId: this.props.id,
      });
    });
  }
  editSubTask(index, taskId) {
    this.setState({
      editingsubTaskIndex: index,
      editVisible: true,
      taskId: taskId,
      isFormVisiblesub: false,
      subTaskVisible: false,
    });
    this.service.retrieve(taskId).then((response) => {
      this.props.form.setFieldsValue({
        taskName: response.data.taskName,
        file: response.data.taskImg,
        description: response.data.description,
        workInstructionId: this.props.id,
        parentId: response.data.parentId,
        level: response.data.level,
      });
    });
  }
  render() {
    // console.log("asdf task img", this.state.taskList);

    return (
      <>
        <Row>
          <Col span={23}>
            <Title level={4} style={{ fontWeight: "600" }}>
              {this.state.wiData?.title}
            </Title>
          </Col>
          <Col span={1}>
            <Tooltip title="Add Task">
              <Button
                style={{ border: "none" }}
                icon={<PlusOutlined />}
                onClick={this.addTask}
              />
            </Tooltip>
          </Col>
        </Row>
        <Divider />

        <div style={{ minHeight: "40vh" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {this.state.taskList?.map((task, index) => (
              <div key={index}>
                {this.state.editingTaskIndex === index &&
                this.state.isVisible === true ? (
                  <Card>
                    <Form
                      form={this.props.form}
                      name="form"
                      onFinish={this.onFinish1}
                      autoComplete="off"
                      layout="vertical"
                    >
                      <Form.Item name="workInstructionId" hidden>
                        <Input />
                      </Form.Item>
                      <Row gutter={[10, 10]}>
                        <Col sm={3}>
                          <Form.Item name="level">
                            <InputNumber placeholder="Orderno *" />
                          </Form.Item>
                        </Col>
                        <Col sm={7}>
                          <Form.Item
                            name="taskName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter task",
                              },
                              {
                                validator: validateName,
                              },
                            ]}
                            style={{ flex: "1", minWidth: "100px" }}
                          >
                            <Input placeholder="Enter Task  *" />
                          </Form.Item>
                        </Col>

                        <Col sm={7}>
                          <Form.Item
                            name="cycleTime"
                            rules={[
                              {
                                required: true,
                                message: "Please enter ideal cycle time   ",
                              },
                            ]}
                            style={{ flex: "1", minWidth: "100px" }}
                          >
                            <Input
                              placeholder="Ideal cycle time in minutes  *"
                              maxLength={4}
                            />
                          </Form.Item>
                        </Col>
                        <Col sm={5}>
                          <Form.Item
                            name="file"
                            rules={[]}
                            style={{ flex: "1", minWidth: "100px" }}
                            // label="upload media"
                          >
                            <Upload
                              maxCount={1}
                              beforeUpload={this.beforeUpload}
                              showUploadList={true}
                              fileList={this.state.fileList}
                              onChange={this.handleChange}
                              accept="image/*, video/*, .gif"
                              title="Click or drag files to this area to upload"
                              style={{
                                backgroundColor: "#fff",
                                border: "1px solid  #E8E8E8",
                              }}
                            >
                              <Button
                                style={{
                                  boxSizing: "border-box",
                                  // width: "130%",
                                  color: "#bfbfbf",
                                }}
                                icon={<UploadOutlined />}
                              >
                                Upload media
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Col>

                        <Col sm={2}>
                          <Button type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                ) : (
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <DownOutlined rotate={isActive ? 0 : -90} />
                    )}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      paddingTop: "8px",
                    }}
                  >
                    <Collapse.Panel
                      key={index}
                      header={task.taskName}
                      extra={
                        <>
                          <Tooltip title="Sub Task">
                            <Button
                              type="text"
                              data-testid="add-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.handlePanelClick(index, task.taskId);
                              }}
                              icon={<PlusOutlined />}
                            />
                          </Tooltip>
                          <EditButton
                            onClick={() => this.editTask(index, task.taskId)}
                          />
                          <DeleteButton
                            onClick={() => this.delete(task.taskId)}
                          />
                        </>
                      }
                    >
                      {/* Task details */}
                      <ul style={{ listStyle: "disc" }}>
                        {task?.children?.map((e, index) => (
                          <li key={index}>
                            {this.state.editingsubTaskIndex === index &&
                            this.state.editVisible === true ? (
                              // Render the form for editing the task
                              <Form
                                form={this.props.form}
                                name="sub Task Form"
                                onFinish={this.onFinish1}
                                autoComplete="off"
                              >
                                <Row gutter={[5, 5]}>
                                  <Form.Item name="parentId" hidden>
                                    <Input />
                                  </Form.Item>

                                  <Form.Item name="workInstructionId" hidden>
                                    <Input />
                                  </Form.Item>
                                  <Col sm={3}>
                                    <Form.Item name="level">
                                      <InputNumber placeholder="Orderno *" />
                                    </Form.Item>
                                  </Col>
                                  <Col sm={7}>
                                    <Form.Item
                                      name="taskName"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter Sub task ",
                                        },
                                        {
                                          validator: validateName,
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter sub-task *" />
                                    </Form.Item>
                                  </Col>

                                  <Col sm={7} justify="end">
                                    <Form.Item name="description">
                                      <Input
                                        placeholder="Description"
                                        maxLength={200}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col sm={5}>
                                    <Form.Item name="file" rules={[]}>
                                      <Upload
                                        maxCount={1}
                                        beforeUpload={this.beforeUpload}
                                        showUploadList={true}
                                        fileList={this.state.fileList}
                                        onChange={this.handleChange}
                                        accept="image/*, video/*, .gif"
                                      >
                                        <Button
                                          style={{
                                            boxSizing: "border-box",
                                            // width: "130%",
                                            color: "#bfbfbf",
                                          }}
                                          icon={<UploadOutlined />}
                                        >
                                          Upload media
                                        </Button>
                                      </Upload>
                                    </Form.Item>
                                  </Col>
                                  <Col md={2}>
                                    <Button type="primary" htmlType="submit">
                                      Save
                                    </Button>
                                  </Col>
                                </Row>
                              </Form>
                            ) : (
                              // Render the task details
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span>{e.taskName}</span>
                                <span>
                                  <EditButton
                                    onClick={() =>
                                      this.editSubTask(index, e.taskId)
                                    }
                                  />
                                  <DeleteButton
                                    onClick={() => this.delete(e.taskId)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </span>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>

                      {this.state.subTaskVisible &&
                        this.state.activePanel === index && (
                          <Form
                            form={this.props.form}
                            name="sub Task Form"
                            onFinish={this.onFinish1}
                            autoComplete="off"
                          >
                            <Row gutter={[5, 5]}>
                              <Col>
                                <Form.Item name="parentId" hidden>
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Form.Item name="workInstructionId" hidden>
                                <Input />
                              </Form.Item>
                              <Col sm={3}>
                                <Form.Item name="level">
                                  <InputNumber placeholder="Orderno *" />
                                </Form.Item>
                              </Col>
                              <Col sm={7}>
                                <Form.Item
                                  name="taskName"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter Sub task ",
                                    },
                                    {
                                      validator: validateName,
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter sub-task *" />
                                </Form.Item>
                              </Col>

                              <Col sm={7} justify="end">
                                <Form.Item name="description">
                                  <Input
                                    placeholder="Description"
                                    maxLength={200}
                                  />
                                </Form.Item>
                              </Col>
                              <Col sm={5}>
                                <Form.Item name="file" rules={[]}>
                                  <Upload
                                    maxCount={1}
                                    beforeUpload={this.beforeUpload}
                                    showUploadList={true}
                                    fileList={this.state.fileList}
                                    onChange={this.handleChange}
                                    accept="image/*, video/*, .gif"
                                  >
                                    <Button
                                      style={{
                                        boxSizing: "border-box",
                                        // width: "130%",
                                        color: "#bfbfbf",
                                      }}
                                      icon={<UploadOutlined />}
                                    >
                                      Upload media
                                    </Button>
                                  </Upload>
                                </Form.Item>
                              </Col>
                              <Col sm={1}>
                                <Button type="primary" htmlType="submit">
                                  Save
                                </Button>
                              </Col>
                            </Row>
                          </Form>
                        )}
                    </Collapse.Panel>
                  </Collapse>
                )}
              </div>
            ))}
            <br />
            {this.state.isFormVisiblesub && (
              <Form
                form={this.props.form}
                name="form"
                onFinish={this.onFinish1}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item name="workInstructionId" hidden>
                  <Input />
                </Form.Item>
                <Row gutter={[10, 10]}>
                  <Col sm={3}>
                    <Form.Item name="level">
                      <InputNumber placeholder="Orderno *" />
                    </Form.Item>
                  </Col>
                  <Col sm={7}>
                    <Form.Item
                      name="taskName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter task",
                        },
                        {
                          validator: validateName,
                        },
                      ]}
                      style={{ flex: "1", minWidth: "100px" }}
                    >
                      <Input placeholder="Enter Task  *" />
                    </Form.Item>
                  </Col>

                  <Col sm={7}>
                    <Form.Item
                      name="cycleTime"
                      rules={[
                        {
                          required: true,
                          message: "Please enter ideal cycle time   ",
                        },
                        {
                          validator: validateNumber,
                        },
                      ]}
                      style={{ flex: "1", minWidth: "100px" }}
                    >
                      <Input
                        placeholder="Ideal cycle time in minutes  *"
                        maxLength={4}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={5}>
                    <Form.Item
                      name="file"
                      rules={[]}
                      style={{ flex: "1", minWidth: "100px" }}
                      // label="upload media"
                    >
                      <Upload
                        maxCount={1}
                        beforeUpload={this.beforeUpload}
                        showUploadList={true}
                        fileList={this.state.fileList}
                        onChange={this.handleChange}
                        accept="image/*, video/*, .gif"
                        title="Click or drag files to this area to upload"
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid  #E8E8E8",
                        }}
                      >
                        <Button
                          style={{
                            boxSizing: "border-box",
                            color: "#bfbfbf",
                          }}
                          icon={<UploadOutlined />}
                        >
                          Upload media
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col sm={2}>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Space>
        </div>

        <br />
        <Divider />

        <Row justify="end">
          <Space>
            <Col>
              <Button
                onClick={() => {
                  this.props.prev();
                }}
              >
                Back
              </Button>
            </Col>

            <Col>
              <Button type="primary" onClick={this.nextStep}>
                Next
              </Button>
            </Col>
          </Space>
        </Row>
      </>
    );
  }
}
export default withRouter(withForm(WorkInstructionTaskFrom));
