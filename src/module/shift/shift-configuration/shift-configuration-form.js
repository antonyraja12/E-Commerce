import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Steps,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AssetService from "../../../services/asset-service";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import ShiftConfigurationPreview from "./shift-configuration-preview";
import ShiftConfigureTime from "./shift-configureTime-form";
const { Step } = Steps;
const { Option } = Select;

function ShiftConfigurationForm(props) {
  const navigate = useNavigate();
  const assetService = new AssetService();
  const service = new ShiftMasterAssetWiseService();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState();
  const [asset, setAsset] = useState();
  const [mode, setMode] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (params.id) {
      service.retrieve(params.id).then((res) => {
        props.form.setFieldsValue({
          name: res.data.name,
          assetIds: res.data.shiftAssetMappingList.map((e) => e.assetId),
        });
      });
    }
    if (params.id) {
      setId(Number(params.id));
    }
    setCurrent(Number(searchParams.get("c")) ?? 0);
    setMode(props.mode);
    getAssetData();
  }, [searchParams]);

  const next = (i) => {
    if (id) {
      navigate({
        search: `?${createSearchParams({
          c: current + 1,
        })}`,
      });
    } else {
      navigate({
        pathname: `${i}`,
        search: `?${createSearchParams({
          c: current + 1,
        })}`,
      });
    }
  };

  const prevPage = () => {
    navigate({
      search: `?${createSearchParams({
        c: current - 1,
      })}`,
    });
  };

  const nextStage = () => {
    if (current < 2) {
      navigate({
        search: `?${createSearchParams({
          c: current + 1,
        })}`,
      });
    } else {
      navigate("..");
    }
  };

  const prev = () => {
    navigate("..");
  };

  const getAssetData = () => {
    assetService.list().then((response) => {
      setAsset(response.data);
    });
  };

  const postData = (v) => {
    // console.log(props.mode);
    switch (props.mode) {
      case "Add":
        setLoading(true);
        if (!params.id) {
          return service
            .add(v)
            .then((response) => {
              if (response.data.success == true) {
                message.success(response.data.message);
                next(response.data.data.shiftMasterAssetWiseId);
              } else {
                message.error(response.data.message);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      case "Edit":
        return service.update(v, id).then((response) => {
          if (response.data.success == true) {
            message.success(response.data.message);
            next(response.data.data.shiftMasterAssetWiseId);
          } else {
            message.error(response.data.message);
          }
        });
    }
  };

  const stepperContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Spin spinning={loading}>
              <Form
                form={props.form}
                labelAlign="center"
                labelCol={{ sm: 7, xs: 18 }}
                onFinish={postData}
                wrapperCol={{ sm: 16, xs: 24 }}
              >
                <Row justify="center">
                  <Col lg={13}>
                    <Form.Item
                      label={"Set Name"}
                      name={"name"}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the Set Name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  {/* <Divider/> */}
                  <Col lg={13}>
                    <Form.Item
                      label={"Asset"}
                      name={"assetIds"}
                      rules={[
                        { required: true, message: "Please select Asset" },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select Asset"
                        showSearch
                      >
                        {asset?.map((e) => (
                          <Option key={e.assetId} value={e.assetId}>
                            {e.assetName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col lg={22}>
                    <Button onClick={prev}>Cancel</Button>
                  </Col>
                  <Col lg={1}>
                    <Button htmlType="submit" type="primary">
                      Next
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Spin>
          </>
        );
        break;
      case 1:
        return (
          <ShiftConfigureTime
            mode={mode}
            id={id}
            prevPage={prevPage}
            next={nextStage}
          />
        );
      case 2:
        return (
          <ShiftConfigurationPreview
            prevPage={prevPage}
            id={id}
            next={nextStage}
          />
        );
    }
  };

  return (
    <Page
      title={
        <span>
          {"Shift "}
          <Tooltip
            title="Configure the Shifts here for a weekly basis!"
            placement="right"
          >
            <InfoCircleOutlined style={{ color: "black" }} />
          </Tooltip>
        </span>
      }
    >
      <Row justify="center" gutter={[20, 20]}>
        <Col sm={16}>
          <Steps
            progressDot
            size="small"
            current={current}
            // onChange={onChange}
            labelPlacement="vertical"
          >
            <Step title="Create Shift" />
            <Step title="Configure Time" />
            <Step title="Preview" />
          </Steps>
        </Col>
        <Col span={24}>{stepperContent()}</Col>
      </Row>
    </Page>
  );
}
export default withForm(ShiftConfigurationForm);
