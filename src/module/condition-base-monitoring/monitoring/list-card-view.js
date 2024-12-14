import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
// import { Col, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Form, Radio, Row, Select, TreeSelect } from "antd";
import moment from "moment";
// import { useEffect, useState } from "react";
// import AssetService from "../../../services/asset-service";
// import AssetParametersValueService from "../../../services/asset-parameter-value-service";
import { SearchOutlined } from "@ant-design/icons";
import AssetParametersValueService from "../../../services/asset-parameter- value-service";
import Monitoring from "./monitoring";
import AssetService from "../../../services/asset-service";
import MonitoringNew from "./monitoring-new";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import Page from "../../../utils/page/page";
function MonitoringList(props) {
  // console.log("propsnew", props);
  const [layout, setLayout] = useState("Grid");
  const [rows, setRows] = useState([]);
  const [id, setId] = useState();
  const [intr, setIntr] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [parameterValue, setParameterValue] = useState({});
  const [parameters, setParameters] = useState({ loading: false, data: [] });
  const [filtered, setFiltered] = useState([]);
  const [assetName, setAssetName] = useState(null);
  const [assets, setAssets] = useState({ loading: false, options: [] });
  const [ahid, setAhid] = useState({
    loading: false,
    parentTreeData: [],
    selected: null,
  });
  const setAssetId = (id) => {
    // console.log("ddddddddd", id);
    setSelectedAssetId(id);
  };
  const fetchAppHierarchy = () => {
    const appHierarchyService = new AppHierarchyService();
    setAhid((state) => ({ ...state, loading: true }));
    appHierarchyService.list({ active: true }).then((response) => {
      const parentTreeData = appHierarchyService.convertToSelectTree(
        response.data
      );

      setAhid((state) => ({
        ...state,
        parentTreeData,
      }));

      setAhid((state) => ({
        ...state,
        appHierarchy: response.data,
      }));

      setAhid((state) => ({ ...state, loading: false }));
    });
  };

  const handlechange = (value) => {
    setAssets((state) => ({ ...state, selectedAssetId: value }));
  };

  const handleAppHierarchyChange = (ahId) => {
    setAhid((state) => ({ ...state, selected: ahId }));
    props.form?.setFieldsValue({
      assetId: "",
    });

    assetList(ahId);
  };
  useEffect(() => {
    if (props.ahid) {
      // console.log("props.ahid", props.ahid);
      props.form?.setFieldsValue({
        site: props.ahid,
      });
      assetList(props.ahid);
    } else {
      if (ahid.parentTreeData.length >= 0) {
        props.form?.setFieldsValue({
          site: ahid.parentTreeData[0]?.value,
        });
        assetList(ahid.parentTreeData[0]?.value);
      }
    }
  }, [props.form, ahid.parentTreeData]);
  const assetList = (ahId) => {
    if (ahId) {
      const service = new AssetService();
      setAssets((state) => ({ ...state, loading: true }));
      service
        .list({
          active: true,
          aHId: ahId,
        })
        .then(({ data }) => {
          setAssets(
            (state) => ({
              ...state,
              options: data.map((e) => ({
                label: e.assetName,
                value: e.assetId,
              })),
            })
            // () => {
            //   props.form?.setFieldsValue({
            //     assetId: data[0]?.assetId,
            //     asset: data[0]?.assetId,
            //   });
            // }
          );
        })
        .finally(() => {
          setAssets((state) => ({ ...state, loading: false }));
        });
    }
  };

  useEffect(() => {
    if (props?.selectedAssetId) {
      fetchParameter(props?.selectedAssetId);
    }
  }, [props?.selectedAssetId]);

  useEffect(() => {
    if (assets.options.length > 0 && selectedAssetId === null) {
      setSelectedAssetId(assets.options[0].value);
    }
  }, [assets.options, selectedAssetId]);

  const fetchParameter = (id) => {
    setSelectedAssetId(id);
    // props.setAssetId(id);
    const service = new AssetService();
    setParameters((state) => ({ ...state, loading: true }));
    service
      .retrieve(id)
      .then(({ data }) => {
        let parameters = data.assetParameters.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );

        setAssetName(data.assetName);
        setParameters((state) => ({ ...state, data: parameters }));
        setFiltered(parameters);
      })
      .finally(() => {
        setParameters((state) => ({ ...state, loading: false }));
      });
  };
  useEffect(() => {
    if (props.selectedAssetId) {
      props.form?.setFieldsValue({
        assetId: props.selectedAssetId,
      });
    } else {
      if (assets.options.length > 0) {
        props.form?.setFieldsValue({
          assetId: assets.options[0]?.value,
        });
        handlechange(assets.options[0]?.value);
        // fetchParameter(assets.options[0]?.value);
      }
    }
  }, [props.form, assets.options]);

  useEffect(() => {
    // assetList(ahid.selected);
    fetchAppHierarchy();
  }, []);

  useEffect(() => {
    if (intr) clearInterval(intr);
    if (assetName) {
      fetchValue();
      let i = setInterval(() => {
        fetchValue();
      }, 5000);
      setIntr(i);
    }
  }, [assetName]);

  const fetchValue = () => {
    const service = new AssetParametersValueService();
    service.getAssetName(assetName).then(({ data }) => {
      let value = {};
      for (let x of data) {
        value[x.name] = x;
      }
      setParameterValue(value);
    });
  };

  const getQuality = (name) => {
    return parameterValue[name] ? parameterValue[name].quality : "";
  };

  const getValue = (name, type) => {
    let value = parameterValue[name] ? parameterValue[name].value : "";
    return new String(value);
  };

  const getTime = (name) => {
    if (parameterValue[name]) {
      const timestamp = parameterValue[name].time;
      const formattedTime = moment(timestamp).format(" HH:mm:ss");

      return formattedTime;
    }

    return "";
  };

  const filter = (e) => {
    let str = e.target.value;
    if (str) {
      let search = str.toLowerCase();
      let res = parameters.data.filter((e) =>
        e.displayName.toLowerCase().includes(search)
      );
      setFiltered(res);
    } else setFiltered(parameters.data);
  };

  useEffect(() => {
    setRows([
      {
        assetId: 1,
        assetName: "Demo",
        energyMeterReading: 190,
        consumption: 300,
        monthConsumption: 400,
      },
      {
        assetId: 2,
        assetName: "Demo1",
        energyMeterReading: 190,
        consumption: 300,
        monthConsumption: 400,
      },
      {
        assetId: 3,
        assetName: "Demo2",
        energyMeterReading: 190,
        consumption: 300,
        monthConsumption: 400,
      },
      {
        assetId: 4,
        assetName: "Demo3",
        energyMeterReading: 190,
        consumption: 300,
        monthConsumption: 400,
      },
    ]);
  }, []);

  const toggleView = (e) => {
    setLayout(e.target.value);
  };

  return (
    <Page title="Monitoring">
      <Form layout="vertical" form={props.form}>
        <Row gutter={10}>
          <Col sm={6}>
            <Form.Item name="site">
              <TreeSelect
                placeholder="Entity"
                // onChange={(value) => {
                //   handleAppHierarchyChange(value);
                // }}
                onChange={handleAppHierarchyChange}
                treeData={ahid.parentTreeData}
              />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item name="assetId">
              <Select
                // onLoad={() => {
                //   if (assets.options.length > 0 && selectedAssetId === null) {
                //     fetchParameter(assets.options[0].value);
                //   }
                // }}
                onChange={(value) => handlechange(value)}
                // value={selectedAssetId}
                placeholder="Asset"
                loading={assets.loading}
                options={assets.options}
              />
            </Form.Item>
          </Col>
          <Col sm={6} offset={6}>
            <Radio.Group
              value={layout}
              buttonStyle="solid"
              onChange={toggleView}
              style={{ float: "right" }}
            >
              <Radio.Button value="Grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="List">
                <MenuOutlined />
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Form>
      <Row justify="end" gutter={[10, 10]}>
        <Col span={24}>
          {layout === "List" ? (
            <MonitoringNew
              rows={rows}
              setAssetId={setAssetId}
              ahid={ahid}
              setAhid={setAhid}
              selectedAssetId={assets.selectedAssetId}
            />
          ) : (
            <Monitoring
              rows={rows}
              setAssetId={setAssetId}
              ahid={ahid}
              setAhid={setAhid}
              selectedAssetId={assets.selectedAssetId}
            />
          )}
        </Col>
      </Row>
    </Page>
  );
}

export default withRouter(withForm(MonitoringList));
