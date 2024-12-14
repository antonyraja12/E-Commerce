import React from "react";

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { validateName } from "../../../../helpers/validation";
import DigitalWorkInstructionStepper from "./digital-work-instruction-stepper";

import ProcessListService from "../../../../services/digital-work-instruction-service/process-list-service";
import WorkInstructionService from "../../../../services/digital-work-instruction-service/work-order-details-service";
import PageForm from "../../../../utils/page/page-form";
import { withForm } from "../../../../utils/with-form";
import ProcessForm from "../process_config/process-form";

const { TextArea } = Input;

class WorkInstructionFrom extends PageForm {
  constructor(props) {
    super(props);
    this.state = {
      dwiId: null,
    };
  }

  service = new WorkInstructionService();
  processService = new ProcessListService();

  componentDidMount() {
    this.Processlist();
    this.onRetrieve(this.props.id);
  }

  Processlist = () => {
    this.processService.list().then((response) => {
      this.setState((state) => ({
        ...state,
        processData: response.data,
      }));
    });
  };

  save(data) {
    if (this.props.id || this.props.params?.id) {
      if (this.props.id) return this.service.update(data, this.props.id);
      else return this.service.update(data, this.props.params.id);
    }
    return this.service.add(data);
  }
  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: { open: false },
    }));
    this.Processlist();
  };

  onFinish1 = (data) => {
    this.setState({ ...this.state, isLoading: true });

    this.save(data)

      .then(({ data, statuscode }) => {
        if (data.success === true) {
          this.onSuccess(data);

          this.props.next(data.data.workInstructionId);
        } else {
          this.onSuccess({ success: true, message: "Added Successfully" });
          this.props.next();
          localStorage.removeItem("taskIds");
        }
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
        localStorage.removeItem("taskIds");
      });
  };
  addProcess = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add ", mode: "Add", open: true },
    }));
  };

  render() {
    // console.log("this prop", this.props);
    return (
      <>
        <Typography.Title level={5}>Basic details</Typography.Title>
        <Divider />
        <Form
          name="trigger"
          form={this.props.form}
          onFinish={this.onFinish1}
          autoComplete="off"
        >
          <Row gutter={10}>
            <Col flex={1}>
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: "Please enter title" },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input placeholder="Title *" />
              </Form.Item>
            </Col>
            <Col flex={1}>
              <Form.Item name="processId">
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Process / Operation"
                  dropdownRender={(menu) => (
                    <>
                      {menu}

                      <Button
                        // onClick={this.addUser}
                        block
                        icon={<PlusOutlined />}
                        onClick={this.addProcess}
                      >
                        Add Process
                      </Button>
                    </>
                  )}
                >
                  {this.state.processData?.map((e) => (
                    <Option value={e.processId} key={e.processId}>
                      {e.processName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description">
            <TextArea rows={4} maxLength={200} placeholder="Description" />
          </Form.Item>
          <br />

          <br />

          <Divider />

          <div style={{ width: "100%", textAlign: "end" }}>
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </div>
        </Form>

        {this.state.dwiId && (
          <DigitalWorkInstructionStepper id={this.state.dwiId} />
        )}
        <ProcessForm {...this.state.popup} close={this.onClose} />
      </>
    );
  }
}
export default withForm(WorkInstructionFrom);
