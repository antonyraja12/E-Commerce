import { Form, Input, InputNumber, Col, Row, Select } from "antd";
import React, { Component, createRef } from "react";
import { ComponentRoutingService } from "../../services/component-routing-service";
import { filterOption } from "../../utils/helper";
import { ProductService } from "../../services/product-services";
import { MachineMasterService } from "../../services/machine-master-service";
import List from "../base/list";
import { ComponentMasterService } from "../../services/component-master-service";

class ComponentRoutingForm extends Component {
  state = {
    machineOption: [],
    productOption: [],
    isProductLoading: false,
    isComponentLoading: false,
    componentOption: [],
  };
  service = new ComponentRoutingService();
  componentMasterService = new ComponentMasterService();
  machineMasterService = new MachineMasterService();
  productService = new ProductService();

  constructor(props) {
    super(props);
    this.ref = createRef();
  }
  onFinish = (value) => {
    this.props.submit(value, this.props.id);
  };

  machineTimeCalc() {
    let form = this.ref.current;
    let data = form.getFieldsValue();
    // let componentRoutings = data.componentRoutings;
    // componentRoutings[i].machineTime = Number(
    //   (
    //     componentRoutings[i].machineTimePerLoad /
    //     componentRoutings[i].partsPerLoad
    //   ).toFixed(2)
    // );

    // form.setFieldValue("componentRoutings", componentRoutings);
  }
  labourTimeCalc() {
    let form = this.ref.current;
    let data = form.getFieldsValue();
    // let componentRoutings = data.componentRoutings;
    // let labourTimePerLoad = Number(
    //   (
    //     Number(componentRoutings[i].labourMachineTimePerLoad ?? 0) +
    //     Number(componentRoutings[i].loadUnloadTime ?? 0)
    //   ).toFixed(2)
    // );
    // componentRoutings[i].labourTimePerLoad = labourTimePerLoad;
    // componentRoutings[i].labourTime = Number(
    //   (labourTimePerLoad / componentRoutings[i].partsPerLoad).toFixed(2)
    // );
    // form.setFieldValue("componentRoutings", componentRoutings);
  }
  componentDidMount() {
    Promise.all([
      this.productService.list({ status: true }),
      this.machineMasterService.list({ status: true }),
    ]).then((response) => {
      let machineOption = response[1].data.map((e) => ({
        value: e.machineId,
        label: e.machineName,
      }));
      this.setState((state) => ({
        ...state,
        machineOption: machineOption,
        productOption: response[0].data.map((e) => ({
          value: e.productId,
          label: e.productName,
        })),
      }));
    });
  }
  getComponent = (productId) => {
    this.componentMasterService
      .list({ productId: productId })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          componentOption: data.map((e) => ({
            value: e.componentId,
            label: e.componentName,
          })),
        }));
      });
  };

  render() {
    const {
      isComponentLoading,
      componentOption,
      machineOption,
      productOption,
      isProductLoading,
    } = this.state;

    return (
      <>
        <Form
          labelAlign="left"
          ref={this.ref}
          onFinish={this.onFinish}
          layout="horizontal"
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 14,
          }}
        >
          <Row gutter={[20, 20]}>
            <Col sm={12}>
              <Form.Item
                name="productId"
                label="Product"
                rules={[
                  {
                    required: true,
                    message: "Please select product",
                  },
                ]}
              >
                <Select
                  showSearch
                  onChange={this.getComponent}
                  filterOption={filterOption}
                  loading={isProductLoading}
                  options={productOption}
                />
              </Form.Item>
              <Form.Item
                name="componentId"
                label="Component"
                rules={[
                  {
                    required: true,
                    message: "Please select product",
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={filterOption}
                  loading={isComponentLoading}
                  options={componentOption}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Seq.Desc"
                rules={[
                  {
                    required: true,
                    message: "Please enter description",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="sequenceNumber"
                label="Seq.No"
                rules={[
                  {
                    required: true,
                    message: "Please enter sequence number",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="machineId"
                label="Machine"
                rules={[
                  {
                    required: true,
                    message: "Please select machine",
                  },
                ]}
              >
                <Select
                  loading={isProductLoading}
                  options={machineOption}
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item
                name="labourCode"
                label="Labour Code"
                rules={[
                  {
                    required: true,
                    message: "Please enter Labour Code",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="partsPerLoad"
                label="Parts / Load"
                rules={[
                  {
                    required: true,
                    message: "Please enter Parts / Load",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                name="machineTimePerLoad"
                label="Machine Time / Load"
                rules={[
                  {
                    required: true,
                    message: "Please enter Machine Time / Load",
                  },
                ]}
              >
                <InputNumber onChange={() => this.machineTimeCalc()} />
              </Form.Item>
              <Form.Item
                name="setUpTime"
                label="Setup Time"
                rules={[
                  {
                    required: true,
                    message: "Please enter Setup Time",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="loadUnloadTime"
                label="Load Unload Time"
                rules={[
                  {
                    required: true,
                    message: "Please enter Load Unload Time",
                  },
                ]}
              >
                <InputNumber onInput={() => this.labourTimeCalc()} />
              </Form.Item>
              <Form.Item
                name="labourMachineTimePerLoad"
                label="Lobour Machine Time / Load"
                rules={[
                  {
                    required: true,
                    message: "Please enter Lobour Machine Time / Load",
                  },
                ]}
              >
                <InputNumber onInput={() => this.labourTimeCalc()} />
              </Form.Item>
              <Form.Item
                name="machineTime"
                label="Machine Time"
                rules={[
                  {
                    required: true,
                    message: "Please enter machine time",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="labourTimePerLoad"
                label="Labour Time / Load"
                rules={[
                  {
                    required: true,
                    message: "Please enter labour time / load",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="labourTime"
                label="Labour Time"
                rules={[
                  {
                    required: true,
                    message: "Please enter labour time",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

export default ComponentRoutingForm;
