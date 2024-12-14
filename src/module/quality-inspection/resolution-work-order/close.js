import { Col, Row } from "antd";
import React from "react";
import WorkOrderResolutionService from "../../../services/quality-inspection/workorder-resolution-service";
import PageForm from "../../../utils/page/page-form";
const onFinish = (values) => {
  console.log(values);
};
const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

class Close extends PageForm {
  service = new WorkOrderResolutionService();

  render() {
    return (
      <Row gutter={[10, 10]}>
        <Col span={24}></Col>
      </Row>
    );
  }

  onRetrieve(id) {
    this.setState({ ...this.state, isLoading: true });

    Promise.all([this.service.retrieve(id)]).then((response) => {
      this.setState({
        ...this.state,
        data: response[0].data,
        isLoading: false,
      });
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.onRetrieve(825);
  }
}

export default Close;
