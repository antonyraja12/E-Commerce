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
  Typography,
  message,
} from "antd";
import { useWatch } from "antd/es/form/Form";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router";
import AssetService from "../../../services/asset-service";
import MqttService from "../../../services/mqtt-service";
import KepwareService from "../../../services/kepware-service ";
function GatewayIntegration(props) {
  const { assetId } = useParams();
  const [mqttOption, setMqttOption] = useState({ loading: false, data: [] });
  const [kepwareOption, setKepwareOption] = useState({
    loading: false,
    data: [],
  });
  const [parameterOptions, setParameterOptions] = useState([]);
  const [selectedIP, setSelectedIP] = useState(null);
  const [port, setPort] = useState(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState(null);
  const connectivityProtocol = useWatch("connectivityProtocol", form);
  const loadOption = () => {
    const service = new MqttService();
    setMqttOption((state) => ({ ...state, loading: true }));
    service
      .list({ status: true })
      .then(({ data }) => {
        setMqttOption((state) => ({
          ...state,
          data: data?.map((e) => ({ value: e.mqttId, label: e.serverName })),
        }));
      })
      .finally(() => {
        setMqttOption((state) => ({ ...state, loading: false }));
      });
  };
  const loadKepwareOptions = () => {
    const service = new KepwareService();
    setKepwareOption((state) => ({ ...state, loading: true }));

    service
      .list({ status: true })
      .then(({ data }) => {
        const options = data.map((e) => ({ value: e.ip, label: e.kepware }));
        setKepwareOption((state) => ({
          ...state,
          data: options,
          loading: false,
        }));
      })
      .catch((error) => {
        console.error("Failed to load Kepware options:", error);
        setKepwareOption((state) => ({ ...state, loading: false }));
      });
  };

  useEffect(() => {
    if (selectedIP !== null) {
      const filteredPort = kepwareOption.data
        .filter((option) => option.value === selectedIP)
        .map((option) => option.port)[0];

      setPort(filteredPort);
    } else {
      setPort(null);
    }
  }, [selectedIP, kepwareOption.data]);

  useEffect(() => {
    if (connectivityProtocol === "MQTT") {
      loadOption();
    } else if (connectivityProtocol === "KEPWARE") {
      loadKepwareOptions();
      loadParameter();
    }
  }, [connectivityProtocol]);
  const loadParameter = () => {
    const { gatewayIntegration, parameters } = asset;
    let parameterNames = Object.keys(parameters);
    let propertyTagMappings = {};
    for (let x of parameterNames) {
      propertyTagMappings[x] = { propertyKey: x, tagName: null };
    }

    if (gatewayIntegration?.connectivityProtocol === "KEPWARE") {
      for (let x of gatewayIntegration.kepware.propertyTagMappings) {
        if (propertyTagMappings[x.propertyKey]) {
          propertyTagMappings[x.propertyKey] = {
            ...propertyTagMappings[x.propertyKey],
            tagName: x.tagName,
          };
        }
      }
    }

    form.setFieldValue(
      ["kepware", "propertyTagMappings"],
      Object.values(propertyTagMappings)
    );
  };
  useEffect(() => {
    setLoading(true);
    const service = new AssetService();
    service
      .retrieve(assetId)
      .then(({ data }) => {
        setAsset(data);
        const { gatewayIntegration } = data;

        form.setFieldsValue(gatewayIntegration);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assetId]);

  useMemo(() => {
    const service = new AssetService();
    service.listParameterAll(assetId).then(({ data }) => {
      const parameters = data ? Object.values(data) : [];
      setParameterOptions(
        parameters
          .map((e) => ({
            value: e.parameterName,
            label: e.parameterName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, [assetId]);
  const onFinish = (value) => {
    setSaving(true);
    const service = new AssetService();
    service
      .gatewayIntegration(assetId, value)
      .then(({ data }) => {
        message.success("Saved successfully");
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const options = [
    { label: "Mqtt", value: "MQTT" },
    { label: "Thingworx", value: "THINGWORX" },

    { label: "Kepware", value: "KEPWARE" },
    { label: "Azure", value: "AZURE", disabled: true },
    // { label: "Thingworx", value: "THINGWORX", disabled: true },
    // { label: "OPC UA", value: "OPC_UA", disabled: true },
    // { label: "TCP", value: "TCP", disabled: true },
  ];
  return (
    <div>
      <Spin spinning={loading}>
        <Form
          // size="small"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          labelAlign="left"
          initialValues={{ connectivityProtocol: "MQTT" }}
        >
          <Form.Item name="connectivityProtocol" label="Connectivity Protocol">
            <Radio.Group
              optionType="button"
              // buttonStyle="solid"
              options={options}
            />
          </Form.Item>
          {connectivityProtocol === "MQTT" && (
            <Row gutter={[10, 10]}>
              <Col md={4} lg={4} sm={24}>
                <Form.Item name={["mqtt", "topic"]} label="Topic">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={8} lg={8} sm={24}>
                <Form.Item name={["mqtt", "mqttId"]} label="Server">
                  <Select
                    options={mqttOption?.data}
                    loading={mqttOption?.loading}
                  />
                </Form.Item>
              </Col>
              <Col md={6} lg={6} sm={24}>
                <Form.Item
                  name={["mqtt", "parameterName"]}
                  label="Property Name"
                >
                  <Select options={parameterOptions} showSearch />
                </Form.Item>
              </Col>
            </Row>
          )}
          {connectivityProtocol === "THINGWORX" && (
            <Row gutter={[10, 10]}>
              <Col md={8} lg={8} sm={24}>
                <Form.Item name={["thingworx", "url"]} label="Url">
                  <Input />
                </Form.Item>
              </Col>

              <Col md={8} lg={8} sm={24}>
                <Form.Item name={["thingworx", "appKey"]} label="App key">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={4} lg={4} sm={24}>
                <Form.Item name={["thingworx", "thingName"]} label="ThingName">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={6} lg={6} sm={24}>
                <Form.Item
                  name={["thingworx", "parameterName"]}
                  label="Property Name"
                >
                  <Select options={parameterOptions} showSearch />
                </Form.Item>
              </Col>
            </Row>
          )}
          {connectivityProtocol === "KEPWARE" && (
            <>
              <Row gutter={[10, 10]}>
                <Col md={6} lg={6} sm={24}>
                  <Form.Item name={["kepware", "ip"]} label="IP">
                    {/* <Select
                      options={kepwareOption?.data}
                      loading={kepwareOption?.loading}
                    /> */}
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} lg={6} sm={24}>
                  <Form.Item name={["kepware", "port"]} label="Port">
                    {/* <Select
                      options={kepwareOption?.data}
                      loading={kepwareOption?.loading}
                    /> */}
                    <InputNumber />
                  </Form.Item>
                </Col>

                <Col md={24} lg={24} sm={24}>
                  <Row>
                    <Col md={12} lg={12} sm={24}>
                      <Form.List name={["kepware", "propertyTagMappings"]}>
                        {(fields, { add, remove }) => (
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Property</th>
                                <th>Tag Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fields?.map((field, i) => (
                                <tr>
                                  <td>
                                    <Form.Item
                                      style={{ margin: 0 }}
                                      {...field}
                                      // label="Value"
                                      name={[field.name, "propertyKey"]}
                                    >
                                      <Input readOnly />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      style={{ margin: 0 }}
                                      {...field}
                                      name={[field.name, "tagName"]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </Form.List>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          )}

          <Form.Item>
            <Button loading={saving} htmlType="submit" type="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}
export default GatewayIntegration;
