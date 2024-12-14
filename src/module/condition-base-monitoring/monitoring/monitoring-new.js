// import { Col, Form, Input, Row, Select, TreeSelect } from "antd";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import AssetService from "../../../services/asset-service";
// // import AssetParametersValueService from "../../../services/asset-parameter-value-service";
// import { SearchOutlined } from "@ant-design/icons";
// import AssetParametersValueService from "../../../services/asset-parameter- value-service";

// import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
// import { withForm } from "../../../utils/with-form";
// import { withRouter } from "../../../utils/with-router";

// function MonitoringNew(props) {
//   console.log("propssssnew", props);
//   // const [ahid, setAhid] = useState(props.ahid);
//   // const [selectedAssetId, setSelectedAssetId] = useState(props.selectedAssetId);
//   const [id, setId] = useState(null);
//   // const formRef = useRef();
//   const [intr, setIntr] = useState(null);
//   //  const [selectedAssetId, setSelectedAssetId] = useState(null,props.selectedAssetId);
//   const [parameterValue, setParameterValue] = useState({});
//   const [parameters, setParameters] = useState({ loading: false, data: [] });
//   const [filtered, setFiltered] = useState([]);
//   const [assetName, setAssetName] = useState(null);
//   const [assets, setAssets] = useState({ loading: false, options: [] });
//   const [selectedAssetId, setSelectedAssetId] = useState(props.selectedAssetId);
//   const [ahid, setAhid] = useState({
//     loading: false,
//     parentTreeData: props.ahid ? props.ahid.parentTreeData : [], // Ensure it's not null
//     selected: null,
//   });
//   const fetchAppHierarchy = () => {
//     const appHierarchyService = new AppHierarchyService();
//     setAhid((state) => ({ ...state, loading: true }));
//     appHierarchyService.list({ active: true }).then((response) => {
//       console.log("response123", response.data);
//       const parentTreeData = appHierarchyService.convertToSelectTree(
//         response.data
//       );
//       console.log("parentTreeData", parentTreeData);
//       setAhid(
//         (state) => ({
//           ...state,
//           parentTreeData,
//         })
//         // () => {
//         //   // Log the value here
//         //   console.log("title", parentTreeData[0]?.title);
//         //   props.form?.setFieldValue("site", parentTreeData[0]?.title);
//         // }
//       );

//       setAhid((state) => ({
//         ...state,
//         appHierarchy: response.data,
//       }));

//       setAhid((state) => ({ ...state, loading: false }));
//     });
//   };
//   // console.log("ahid", ahid.parentTreeData[0]?.value);
//   useEffect(() => {
//     console.log("ahid.parentTreeData", ahid.parentTreeData); // Check if this logs the expected data
//     if (ahid.parentTreeData.length > 0) {
//       props.form?.setFieldsValue({
//         site: ahid.parentTreeData[0]?.value,
//       });
//     }
//   }, [props.form, ahid.parentTreeData]);
//   useEffect(() => {
//     fetchParameter(props.selectedAssetId);
//   }, [props.selectedAssetId]);

//   // useEffect(() => {
//   //   assetList(props.ahid);
//   //   fetchAppHierarchy();
//   // }, [props.ahid]);

//   // useEffect(() => {
//   //   if (props?.selectedAssetId) {
//   //     fetchParameter(props?.selectedAssetId);
//   //   }
//   // }, [props?.selectedAssetId]);
//   useEffect(() => {
//     setSelectedAssetId(props.selectedAssetId);
//     setAhid({
//       loading: false,
//       parentTreeData: props.ahid ? props.ahid.parentTreeData : [],
//       selected: null,
//     });
//   }, [props.selectedAssetId, props.ahid]);

//   const handleAppHierarchyChange = (ahId) => {
//     // props.ahid(ahId);
//     setAhid((state) => ({ ...state, selected: ahId }));
//   };
//   const assetList = (ahId) => {
//     const service = new AssetService();
//     setAssets((state) => ({ ...state, loading: true }));
//     service
//       .list({
//         active: true,
//         aHId: ahId,
//       })
//       .then(({ data }) => {
//         setAssets((state) => ({
//           ...state,
//           options: data.map((e) => ({
//             label: e.assetName,
//             value: e.assetId,
//           })),
//         }));
//       })
//       .finally(() => {
//         setAssets((state) => ({ ...state, loading: false }));
//       });
//   };
//   useEffect(() => {
//     console.log("ahid.parentTreeData", ahid.parentTreeData); // Check if this logs the expected data
//     if (assets.options.length > 0) {
//       props.form?.setFieldsValue({
//         assetId: assets.options[0]?.value,
//       });
//     }
//   }, [props.form, assets.options]);
//   useEffect(() => {
//     if (props?.selectedAssetId) {
//       fetchParameter(props?.selectedAssetId);
//     }
//   }, [props?.selectedAssetId]);

//   // useEffect(() => {
//   //   if (assets.options.length > 0 && selectedAssetId === null) {
//   //     setSelectedAssetId(assets.options[0].value);
//   //   }
//   // }, [assets.options, selectedAssetId]);

//   const fetchParameter = (id) => {
//     setSelectedAssetId(id);
//     // props.setAssetId(id);
//     const service = new AssetService();
//     setParameters((state) => ({ ...state, loading: true }));
//     service
//       .retrieve(id)
//       .then(({ data }) => {
//         let parameters = data.assetParameters.sort((a, b) =>
//           a.displayName.localeCompare(b.displayName)
//         );

//         setAssetName(data.assetName);
//         setParameters((state) => ({ ...state, data: parameters }));
//         setFiltered(parameters);
//         props.form?.setFieldsValue({ assetId: id });
//       })
//       .finally(() => {
//         setParameters((state) => ({ ...state, loading: false }));
//       });
//   };

//   useEffect(() => {
//     assetList(ahid.selected);
//     fetchAppHierarchy();
//   }, []);

//   useEffect(() => {
//     if (intr) clearInterval(intr);
//     if (assetName) {
//       fetchValue();
//       let i = setInterval(() => {
//         fetchValue();
//       }, 5000);
//       setIntr(i);
//     }
//   }, [assetName]);

//   const fetchValue = () => {
//     const service = new AssetParametersValueService();
//     service.getAssetName(assetName).then(({ data }) => {
//       let value = {};
//       for (let x of data) {
//         value[x.name] = x;
//       }
//       setParameterValue(value);
//     });
//   };

//   const getQuality = (name) => {
//     return parameterValue[name] ? parameterValue[name].quality : "";
//   };

//   const getValue = (name, type) => {
//     let value = parameterValue[name] ? parameterValue[name].value : "";
//     return new String(value);
//   };

//   const getTime = (name) => {
//     if (parameterValue[name]) {
//       const timestamp = parameterValue[name].time;
//       const formattedTime = moment(timestamp).format(" HH:mm:ss");

//       return formattedTime;
//     }

//     return "";
//   };

//   const filter = (e) => {
//     let str = e.target.value;
//     if (str) {
//       let search = str.toLowerCase();
//       let res = parameters.data.filter((e) =>
//         e.displayName.toLowerCase().includes(search)
//       );
//       setFiltered(res);
//     } else setFiltered(parameters.data);
//   };

//   return (
//     <div>
//       <Form layout="vertical" form={props.form}>
//         <Row gutter={10}>
//           <Col sm={6}>
//             <Form.Item name="site">
//               <TreeSelect
//                 placeholder="Entity"
//                 onChange={handleAppHierarchyChange}
//                 treeData={ahid.parentTreeData}
//               />
//             </Form.Item>
//           </Col>
//           <Col sm={6}>
//             <Form.Item name="assetId">
//               <Select
//                 onChange={fetchParameter}
//                 placeholder="Asset"
//                 loading={assets.loading}
//                 options={assets.options}
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//       <Row justify="space-between">
//         <Col span={24}>
//           <Input
//             prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
//             onInput={filter}
//             placeholder="Search..."
//           />
//         </Col>
//       </Row>
//       <br />
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Parameter</th>
//             <th>Quality</th>
//             <th>Time</th>
//             <th>Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered?.map((e) => (
//             <tr>
//               <td>{e.displayName}</td>
//               <td>{getQuality(e.parameterName)}</td>
//               <td>{getTime(e.parameterName)}</td>
//               <td>{getValue(e.parameterName, e.dataType)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default withRouter(withForm(MonitoringNew));

import { Col, Form, Input, Row, Select, TreeSelect } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import AssetService from "../../../services/asset-service";
// import AssetParametersValueService from "../../../services/asset-parameter-value-service";
import { SearchOutlined } from "@ant-design/icons";
import AssetParametersValueService from "../../../services/asset-parameter- value-service";

import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

function MonitoringNew(props) {
  // console.log("propsnew", props);
  const [id, setId] = useState(null);
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
  // useEffect(() => {
  //   console.log("ahid.parentTreeData", ahid.parentTreeData);
  //   if (ahid.parentTreeData.length > 0) {
  //     props.form?.setFieldsValue({
  //       site: ahid.parentTreeData[0]?.value,
  //     });
  //   }
  // }, [props.form, ahid.parentTreeData]);

  const handleAppHierarchyChange = (ahId) => {
    // console.log("ahid", props.setAhid());
    props.setAhid(ahId);
    setAhid((state) => ({ ...state, selected: ahId }));
    // assetList(ahId);
    // props.setAhid({ ...props.ahid, selected: ahId });
    assetList(ahId);
  };
  useEffect(() => {
    if (props.ahid) {
      // console.log("props.ahid", props.ahid);
      props.form?.setFieldsValue({
        site: props.ahid,
      });
    } else {
      if (ahid.parentTreeData.length >= 0) {
        props.form?.setFieldsValue({
          site: ahid.parentTreeData[0]?.value,
        });
      }
    }
  }, [props.form, ahid.parentTreeData]);
  const assetList = (ahId) => {
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
    // console.log(id, "data");
    setSelectedAssetId(id);
    props.setAssetId(id);
    const service = new AssetService();
    setParameters((state) => ({ ...state, loading: true }));
    service
      .retrieve(id)
      .then(({ data }) => {
        // console.log(data, "data");
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
  // useEffect(() => {
  //   if (props.selectedAssetId) {
  //     props.form?.setFieldsValue({
  //       assetId: props.selectedAssetId,
  //     });
  //   } else {
  //     if (assets.options.length > 0) {
  //       props.form?.setFieldsValue({
  //         assetId: assets.options[0]?.value,
  //       });
  //       fetchParameter(assets.options[0]?.value);
  //     }
  //   }
  // }, [props.form, assets.options]);

  useEffect(() => {
    assetList(ahid.selected);
    fetchAppHierarchy();
  }, []);

  useEffect(() => {
    if (props.selectedAssetId) {
      fetchParameter(props.selectedAssetId);
    }
  }, [props.selectedAssetId]);
  // useEffect(() => {
  //   if (intr) clearInterval(intr);
  //   if (assetName) {
  //     fetchValue();
  //     let i = setInterval(() => {
  //       fetchValue();
  //     }, 5000);
  //     setIntr(i);
  //   }
  // }, [assetName]);

  const fetchValue = () => {
    const service = new AssetParametersValueService();
    service.getParameterValue(selectedAssetId).then(({ data }) => {
      // let value = {};
      // for (let x of data) {
      //   value[x.name] = x;
      // }
      const parameterData = {};

      data.forEach((item) => {
        parameterData[item.parameterName] = {
          value: item.value,
          quality: item.quality,
          time: item.time,
        };
      });
      setParameterValue(parameterData);
    });
  };
  useEffect(() => {
    if (intr) clearInterval(intr);
    if (selectedAssetId) {
      fetchValue();
      let i = setInterval(() => {
        fetchValue();
      }, 5000);
      setIntr(i);
    }
  }, [selectedAssetId]);

  const getQuality = (name) => {
    // console.log(parameterValue, "parameterValue");
    let value = parameterValue[name] ? parameterValue[name].quality : "false";
    return new String(value);
  };

  const getValue = (name, type) => {
    let value = parameterValue[name] ? parameterValue[name].value : "false";
    return new String(value);
  };

  const getTime = (name) => {
    if (parameterValue[name]) {
      const timestamp = parameterValue[name].time;
      const formattedTime = moment(timestamp).format("DD/MM/YYYY HH:mm A");

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

  return (
    <div>
      <Row justify="space-between">
        <Col span={24}>
          <Input
            prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
            onInput={filter}
            placeholder="Search..."
          />
        </Col>
      </Row>
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Quality</th>
            <th>Time</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {filtered?.map((e) => (
            <tr>
              <td width="30%" align="left">
                {e.displayName}
              </td>
              <td width="15%" align="left">
                {getQuality(e.parameterName)}
              </td>
              <td width="15%" align="left">
                {getTime(e.parameterName)}
              </td>
              <td width="15%" align="left">
                {getValue(e.parameterName)}
              </td>
              {/* <td width="15%">{getValue(e.parameterName, e.dataType)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withRouter(withForm(MonitoringNew));
