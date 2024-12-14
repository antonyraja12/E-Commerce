import { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  TreeSelect,
  Select,
  DatePicker,
  Button,
  Result,
  Spin,
} from "antd";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetEngineService from "../../../services/asset-engine-service";
import AssetService from "../../../services/asset-service";
import Page from "../../../utils/page/page";
import ParameterGraph from "./parameter-graph";
import dayjs from "dayjs";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import { useAccess } from "../../../hooks/useAccess";

function ParameterReport(props) {
  const [form] = Form.useForm();
  const [filter, setFilter] = useState(null);
  const [access, loading] = useAccess();
  const [assetOption, setAssetOption] = useState({
    loading: false,
    options: [],
  });
  const [parameterOption, setParameterOption] = useState({
    loading: false,
    options: [],
  });
  const [ahList, setAhList] = useState({
    loading: false,
    parentTreeData: [],
    selected: null,
  });
  const [parameterData, setParameterData] = useState([]);
  const [loadingParameterData, setLoadingParameterData] = useState(false);

  useEffect(() => {
    fetchAppHierarchy();
  }, []);

  const fetchAppHierarchy = () => {
    const appHierarchyService = new AppHierarchyService();
    setAhList((state) => ({ ...state, loading: true }));
    appHierarchyService
      .list({ active: true })
      .then((response) => {
        const parentTreeData = appHierarchyService.convertToSelectTree(
          response.data
        );
        form.setFieldValue("ahId", parentTreeData[0].value);
        assetList(parentTreeData[0].value);
        setAhList((state) => ({ ...state, parentTreeData }));
      })
      .finally(() => {
        setAhList((state) => ({ ...state, loading: false }));
      });
  };

  const assetList = (ahId) => {
    if (ahId) {
      const service = new AssetService();
      setAssetOption((state) => ({ ...state, loading: true }));
      service
        .list({ active: true, aHId: ahId, assetCategory: 1 })
        .then(({ data }) => {
          form.setFieldValue("assetId", data[0]?.assetId);
          fetchParameters(data[0]?.assetId);
          setAssetOption((state) => ({
            ...state,
            options: data.map((e) => ({
              label: e.assetName,
              value: e.assetId,
            })),
          }));
        })
        .finally(() => {
          setAssetOption((state) => ({ ...state, loading: false }));
        });
    }
  };

  const fetchParameters = (assetId) => {
    const service = new AssetEngineService();
    setParameterOption((state) => ({ ...state, loading: true }));
    service
      .getAsset(assetId)
      .then(({ data }) => {
        let parameterList = Object.values(data?.parameterDefinition)?.filter(
          (e) => ["number", "boolean"].includes(e.dataType?.toLowerCase())
        );
        // form.setFieldValue("parameterName", parameterList[0].parameterName);
        // onValuesChange(parameterList[0].parameterName);
        setParameterOption((state) => ({
          ...state,
          options: parameterList.map((e) => ({
            label: e.parameterName,
            value: e.parameterName,
          })),
        }));
      })
      .finally(() => {
        setParameterOption((state) => ({ ...state, loading: false }));
      });
  };

  const fetchParameterData = (assetId) => {
    const service = new AssetEngineService();
    setLoadingParameterData(true);

    service
      .getAsset(assetId)
      .then(({ data }) => {
        const parameterData = data.parameterData;
        if (parameterData.length > 100) {
          setParameterData(parameterData.slice(-100));
        } else {
          setParameterData(parameterData);
        }
      })
      .catch((error) => {
        console.error("Error fetching parameter data:", error);
      })
      .finally(() => {
        setLoadingParameterData(false);
      });
  };

  const onAssetChange = (assetId) => {
    form.setFieldValue("parameterName", null);
    fetchParameters(assetId);
    fetchParameterData(assetId);
  };

  const onValuesChange = (changedValues, allValues) => {
    setFilter(() => {
      const { fromDate, toDate, ...restValues } = allValues;

      const validFromDate = dayjs(fromDate).isValid()
        ? dayjs(fromDate).startOf("day").toISOString()
        : null;
      const validToDate = dayjs(toDate).isValid()
        ? dayjs(toDate).endOf("day").toISOString()
        : null;

      return {
        ...restValues,
        fromDate: validFromDate,
        toDate: validToDate,
      };
    });
  };

  // if (!access[0] || access[0].length === 0) {
  //   return (
  //     <Result
  //       status={"403"}
  //       title="403"
  //       subTitle="Sorry You are not authorized to access this page"
  //     />
  //   );
  // }
  return (
    <Page>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        initialValues={{ fromDate: dayjs().startOf("D"), toDate: dayjs() }}
      >
        <Row gutter={[10, 10]}>
          <Col lg={24}>
            <Row gutter={[10, 10]}>
              <Col lg={4}>
                <Form.Item label="Entity" name="ahId">
                  <TreeSelect
                    onChange={(val) => assetList(val)}
                    treeData={ahList.parentTreeData}
                    loading={ahList.loading}
                  />
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="Asset" name="assetId">
                  <Select
                    options={assetOption?.options}
                    loading={assetOption?.loading}
                    onChange={onAssetChange}
                  />
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="Parameter" name="parameterName">
                  <Select
                    options={parameterOption?.options}
                    loading={parameterOption?.loading}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="From Date" name="fromDate">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="To Date" name="toDate">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Spin spinning={loadingParameterData}>
              <ParameterGraph data={parameterData} {...filter} />
            </Spin>
          </Col>
        </Row>
      </Form>
    </Page>
  );
}

export default withRouter(ParameterReport);
