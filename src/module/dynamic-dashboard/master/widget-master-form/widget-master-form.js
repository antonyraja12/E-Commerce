import { ArrowsAltOutlined, DeleteFilled } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import { useContext, useEffect, useState } from "react";
import ResizePanel from "react-resize-panel";
import WidgetMasterService from "../../../../services/dynamic-dashboard/widget-master-service";
import {
  DashboardContext,
  WidgetContext,
  widgetTypeOption,
} from "../../helper/helper";
import SelectKey from "../../helper/select-key";
import WidgetCollection from "../widget-collection/widget-collection";
import BarChartProperties from "./bar-chart-properties";
import CardProperties from "./card-properties";
import ChartProperties from "./chart-properties";
import GaugeProperties from "./gauge-properties";
import GraphProperties from "./graph-properties";
import TableProperties from "./table-properties";

function WidgetMasterForm(props) {
  const { dashboardId, apiData } = useContext(DashboardContext);
  const { selected, setWidgets } = useContext(WidgetContext);

  const [openKeySelect, setOpenKeySelect] = useState({
    open: false,
    selectedKey: null,
  });

  const [form] = Form.useForm();
  const { widgetId } = props;
  const widgetType = Form.useWatch("widgetType", form);
  const propertyKey = Form.useWatch("propertyKey", form);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const onFinish = (value) => {
    setSaving(true);
    const service = new WidgetMasterService();
    let req;
    if (!selected) {
      req = service.add({ ...value, dashboardId: dashboardId });
    } else {
      req = service.update({ ...value, dashboardId: dashboardId }, selected);
    }
    req
      .then(({ data }) => {
        message.success("Updated Successfully");
        setWidgets((state) => {
          let list = [...state];
          let index = list.findIndex((e) => e.widgetId === data.widgetId);
          list[index] = data;
          return list;
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const handleClick = () => {
    form.resetFields();
  };

  const onRetrieve = (id) => {
    const service = new WidgetMasterService();
    service.retrieve(id).then(({ data }) => {
      form.setFieldsValue(data);
      setData(data);
    });
  };

  useEffect(() => {
    switch (widgetType?.toLowerCase()) {
      case "chart":
        form.setFieldsValue({
          chartProperty: {
            legend: {
              fontSize: 14,
              fontWeight: 400,
              position: "right",
              horizontalAlign: "CENTER",
              show: true,
              showForNullSeries: true,
              showForZeroSeries: true,
              showForSingleSeries: false,
              floating: false,
            },
          },
        });
        break;
      case "gauge":
        form.setFieldsValue({
          gaugeProperty: {
            type: "grafana",
            min: 0,
            max: 100,
          },
        });
        break;

      default:
        break;
    }
  }, [widgetType]);
  const openKeySelectFn = (key) => {
    setOpenKeySelect({
      open: true,
      selectedKey: key,
    });
  };
  useEffect(() => {
    form.resetFields();
    if (selected) {
      onRetrieve(selected);

      // onCancelEdit();
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selected]);
  const onSelectKeyOk = (value) => {
    form.setFieldValue(openKeySelect.selectedKey, value);
    onSelectKeyClose();
  };
  const onSelectKeyClose = () => {
    setOpenKeySelect({
      open: false,
      selectedKey: null,
    });
  };
  return (
    <>
      <SelectKey
        data={apiData}
        open={openKeySelect?.open}
        onClose={() => onSelectKeyClose()}
        onOk={(value) => {
          onSelectKeyOk(value);
        }}
      />
      <Spin spinning={saving}>
        <Form
          disabled={disabled}
          className="widget-form"
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          size="small"
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          // requiredMark="optional"
          initialValues={data}
          style={{ padding: "5px", color: "#6C706F" }}
        >
          <h5>Basic Property</h5>
          <Form.Item
            name="widgetId"
            label="Widget Id"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="widgetType"
            label="Widget Type"
            rules={[{ required: true }]}
          >
            <Select options={widgetTypeOption} />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>

          <Form.Item name="height" label="Height" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>

          <Form.Item name="col" label="Column" rules={[{ required: true }]}>
            <InputNumber max={24} />
          </Form.Item>

          <Form.Item
            name="orderNo"
            label="Order No"
            rules={[{ required: true }]}
            hidden
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="propertyKey"
            label="Property Key"

            // rules={[{ required: true }]}
          >
            <Input
              suffix={
                <ArrowsAltOutlined
                  onClick={() => {
                    openKeySelectFn("propertyKey");
                  }}
                />
              }
            />
          </Form.Item>
          <h5>Widget Property</h5>
          {widgetType === "Card" && (
            <CardProperties propertyKey={propertyKey} data={apiData} />
          )}
          {widgetType === "Gauge" && (
            <GaugeProperties propertyKey={propertyKey} data={apiData} />
          )}
          {widgetType === "Graph" && (
            <GraphProperties propertyKey={propertyKey} data={apiData} />
          )}
          {(widgetType === "PieChart" || widgetType === "DonutChart") && (
            <ChartProperties propertyKey={propertyKey} data={apiData} />
          )}
          {widgetType === "Table" && (
            <TableProperties propertyKey={propertyKey} data={apiData} />
          )}
          {(widgetType === "BarChart" ||
            widgetType === "AreaChart" ||
            widgetType === "LineChart" ||
            widgetType === "RadarChart") && (
            <BarChartProperties
              widgetType={widgetType}
              propertyKey={propertyKey}
              data={apiData}
            />
          )}

          <Divider />
          <Row justify="space-between">
            <Col>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button type="default" htmlType="button" onClick={handleClick}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
      {/* <Card size="small">{renderProperties()}</Card> */}
    </>
  );
}

export default WidgetMasterForm;
