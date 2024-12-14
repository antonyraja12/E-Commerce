import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Spin,
  DatePicker,
} from "antd";
import React from "react";
import { message } from "antd";
import AddWarrantyService from "../../../services/add-warranty-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import dayjs from "dayjs";

class WarrantyDetails extends PageForm {
  service = new AddWarrantyService();
  state = {
    isEdit: this.props.mode === "Add",
    commissionedDate: null,
    warrantyPeriod: null,
  };
  handleCommissionedDateChange = (date) => {
    this.setState((state) => ({ ...state, commissionedDate: date }));
  };

  handleWarrantyPeriodChange = (value) => {
    this.setState((state) => ({ ...state, warrantyPeriod: value }));
  };
  handleEditButtonClick = () => {
    this.setState({ isEdit: true });
  };
  closePopup = (id) => {
    this.props.next(id);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(data.data.assetId);
  }
  componentDidMount() {
    this.fetchWarranty(this.props.assetId);
  }
  componentDidUpdate(prevProps, prevState) {
    const { commissionedDate, warrantyPeriod } = this.state;
    if (
      commissionedDate !== prevState.commissionedDate ||
      warrantyPeriod !== prevState.warrantyPeriod
    ) {
      const { form } = this.props;
      if (commissionedDate && warrantyPeriod !== null) {
        const warrantyTillDate = dayjs(commissionedDate).add(
          warrantyPeriod,
          "day"
        );
        form.setFieldsValue({ warrantyTillDate });
      }
    }
  }

  fetchWarranty(id) {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service.list({ assetId: id }).then((response) => {
      this.setState((state) => ({
        ...state,
        initialValues: response.data,
        isLoading: false,
      }));
      this.patchForm(response?.data[0]);
    });
  }
  patchForm(data) {
    if (this.props.form) {
      if (data?.commissionedDate || data?.warrantyTillDate) {
        this.props.form.setFieldsValue({
          ...data,
          assetId: this.props.assetId,
          warrantyPeriod: data.warrantyPeriod,
          commissionedDate: dayjs(data.commissionedDate),
          warrantyTillDate: dayjs(data.warrantyTillDate),
        });
        this.setState((state) => ({
          ...state,
          commissionedDate: data.commissionedDate,
          warrantyPeriod: data.warrantyPeriod,
          warrantyId: data?.warrantyId,
        }));
      } else {
        this.props.form.setFieldsValue({
          ...data,
          assetId: this.props.assetId,
        });
      }
    }
  }
  saveFn(data) {
    if (this.state?.warrantyId) {
      return this.service.update(data, this.state.warrantyId);
    }
    return this.service.add(data);
  }
  render() {
    const { isEdit } = this.state;
    return (
      <Spin spinning={!!this.state.isLoading}>
        <Form
          size="small"
          form={this.props.form}
          colon={false}
          layout="vertical"
          onFinish={this.onFinish}
          preserve={false}
        >
          <Row justify="end">
            <Col>
              <Button onClick={this.handleEditButtonClick}>Edit</Button>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Form.Item name="assetId" hidden>
              <Input />
            </Form.Item>
            <Col sm={8} xs={24}>
              <Form.Item
                name="commissionedDate"
                label="Testing & Commissioned Date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Testing & Commissioned Date",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  disabled={!isEdit}
                  onChange={this.handleCommissionedDateChange}
                />
              </Form.Item>
            </Col>
            <Col sm={8} xs={24}>
              <Form.Item
                name="warrantyPeriod"
                label="Warranty Period (In Days)"
                rules={[
                  {
                    required: true,
                    message: "Please input the  Warranty Period",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="In Days"
                  disabled={!isEdit}
                  onChange={this.handleWarrantyPeriodChange}
                />
              </Form.Item>
            </Col>
            <Col sm={8} xs={24}>
              <Form.Item
                name="warrantyTillDate"
                label="Warranty Period Till"
                rules={[
                  {
                    required: true,
                    message: "Please input the Warranty Period Till",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  // disabled={!isEdit}
                  disabled={true}
                  format="DD-MM-YYYY"
                  // initialValue={dayjs()}
                  // defaultValue={dayjs()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default withForm(WarrantyDetails);
