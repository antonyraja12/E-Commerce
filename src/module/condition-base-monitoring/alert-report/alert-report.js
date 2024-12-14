import {
  Form,
  Row,
  Select,
  Table,
  Col,
  Button,
  DatePicker,
  Checkbox,
  Result,
  Spin,
  Menu,
  Dropdown,
  TreeSelect,
} from "antd";

//import WorkFlowHomeService from "../../../services/preventive-maintenance-services/workflow-home-service";
import moment from "moment";
import Page from "../../../utils/page/page";

import { useEffect, useState } from "react";
import AlertReportService from "../../../services/alert-report-cbm-services";
import AssetService from "../../../services/asset-service";
import AssetEngineService from "../../../services/asset-engine-service";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import downloadPdf from "./pdf-generator";
import excelExport from "./excel-export";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";

function AlertReport(props) {
  const [form] = Form.useForm();
  const assetId = Form.useWatch("assetId", form);
  const [data, setData] = useState({ rows: [], loading: false });
  const [ahIdList, setAhIdList] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [parameterList, setParameterList] = useState([]);
  const [assetHash, setAssetHash] = useState({});
  const assetService = new AssetService();

  useEffect(() => {
    form.setFieldValue("parameterName", null);
    if (assetId) {
      const service = new AssetEngineService();
      service.getAsset(assetId).then(({ data }) => {
        setParameterList(Object.values(data.parameterDefinition));
      });
    }
  }, [assetId]);

  const list = (filter = {}) => {
    let obj = { ...filter };
    if (filter.fromDate)
      obj.fromDate = filter.fromDate?.startOf("D")?.toISOString();
    if (filter.toDate) obj.toDate = filter.toDate?.endOf("D")?.toISOString();
    const service = new AlertReportService();
    setData((state) => ({ ...state, loading: true }));

    service
      .getAlertReport(obj)
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          rows: data.map((e, i) => ({ ...e, sno: i + 1 })),
        }));
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      dataIndex: "sno",
      width: "80px",
      fixed: "left",
    },
    {
      title: "Asset Name",
      key: "asset",
      dataIndex: "assetId",
      render: (value) => {
        return assetHash[value];
      },
      width: "200px",
      fixed: "left",
      sorter: (a, b) => {
        return assetHash[a.assetId].localeCompare(assetHash[b.assetId]);
      },
    },
    {
      title: "Parameter Name",
      key: "parameterName",
      dataIndex: "parameterName",
      width: "200px",
      sorter: (a, b) => {
        return a.parameterName.localeCompare(b.parameterName);
      },
    },
    {
      title: "Alert Name",
      key: "alertName",
      dataIndex: "alertName",
      width: "200px",
      sorter: (a, b) => {
        return a.alertName.localeCompare(b.alertName);
      },
    },
    {
      title: "Date",
      key: "timestamp",
      dataIndex: "timestamp",
      width: "180px",
      align: "left",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY hh:mm:ss A") : "-";
      },
    },

    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
      width: "500px",
    },
    {
      dataIndex: "value",
      key: "value",
      title: "Value",
      // align: "left",
      width: "200px",
      // fixed: "right",
    },

    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      width: "100px",
      sorter: (a, b) => {
        return a.priority - b.priority;
      },
    },
    {
      dataIndex: "acknowledged",
      key: "acknowledged",
      title: "Ack",
      width: "100px",
      render: (value) => {
        return value ? "True" : "False";
      },
    },
  ];
  const excelSheet = [
    {
      title: "S.No",
      key: "sno",
      dataIndex: "sno",
      width: 10,
      fixed: "left",
    },
    {
      title: "Asset Name",
      key: "asset",
      dataIndex: "assetId",
      render: (value) => {
        return assetHash[value];
      },
      width: 40,
      fixed: "left",
      sorter: (a, b) => {
        const assetA = assetHash[a.assetId] || "";
        const assetB = assetHash[b.assetId] || "";
        return assetA.localeCompare(assetB);
      },
    },
    {
      title: "Parameter Name",
      key: "parameterName",
      dataIndex: "parameterName",
      width: 40,
      fixed: "left",
      sorter: (a, b) => a.parameterName.localeCompare(b.parameterName),
    },
    {
      title: "Alert Name",
      key: "alertName",
      dataIndex: "alertName",
      width: 40,
      fixed: "left",
    },
    {
      title: "Date",
      key: "timestamp",
      dataIndex: "timestamp",
      width: 30,
      align: "left",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY hh:mm:ss A") : "-";
      },
    },

    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
      width: 40,
    },
    {
      dataIndex: "value",
      key: "value",
      title: "Value",
      align: "left",
      width: 30,
      // fixed: "right",
    },

    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      align: "left",

      width: 20,
      sorter: (a, b) => {
        return a.priority - b.priority;
      },
    },
    {
      dataIndex: "acknowledged",
      key: "acknowledged",
      title: "Ack",
      width: 20,
      align: "left",

      render: (value) => {
        return value ? "True" : "False";
      },
    },
  ];
  const handlePDFDownload = () => {
    downloadPdf({
      title: "Alert Report",
      columns: columns,
      data: data.rows,
      // currentUser: " ",
      assetHash: assetHash,
    });
  };
  const handleExcelDownload = async () => {
    try {
      const buffer = await excelExport({
        title: "Alert Report",
        columns: excelSheet,
        data: data.rows,
        // currentUser: "",
        assetHash: assetHash,
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Alert Report.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  useEffect(() => {
    list();
    loadAhId();
    setAssetHash({});
    assetService.list({ active: true }).then(({ data }) => {
      setAssetHash({});
      for (let x of data) {
        setAssetHash((state) => ({ ...state, [x.assetId]: x.assetName }));
      }
    });
  }, []);
  // const loadAhId = () => {
  //   const ahIdService = new AppHierarchyService();
  //   ahIdService.list({ active: true }).then(({ data }) => {
  //     setAhIdList(data);
  //   });
  // };
  const loadAhId = () => {
    const appHierarchyService = new AppHierarchyService();
    setAhIdList((state) => ({ ...state, loading: true }));
    appHierarchyService
      .list({ active: true })
      .then((response) => {
        const parentTreeData = appHierarchyService.convertToSelectTree(
          response.data
        );
        form.setFieldValue("ahId", parentTreeData[0].value);
        loadAsset(parentTreeData[0].value);
        setAhIdList((state) => ({ ...state, parentTreeData }));
      })
      .finally(() => {
        setAhIdList((state) => ({ ...state, loading: false }));
      });
  };
  const loadAsset = (ahId) => {
    form.setFieldValue("assetId", null);
    setAssetList([]);
    // setAssetHash({});
    if (ahId) {
      assetService
        .list({ aHId: ahId, active: true, assetCategory: 1 })
        .then(({ data }) => {
          form.setFieldValue("assetId", data[0]?.assetId);
          setAssetList(data);
          // setAssetHash({});
          // for (let x of data) {
          //   setAssetHash((state) => ({ ...state, [x.assetId]: x.assetName }));
          // }
        });
    }
  };
  const menu = (
    <Menu>
      {/* PDF Button */}

      <Menu.Item key="pdf" onClick={handlePDFDownload}>
        {/* <Button  onClick={this.handleDownload}> */}
        <FilePdfOutlined /> PDF
        {/* </Button> */}
      </Menu.Item>

      {/* Excel Button */}
      <Menu.Item key="excel" onClick={handleExcelDownload}>
        {/* <Button  onClick={this.handleDownload1}> */}
        <FileExcelOutlined /> Excel
        {/* </Button> */}
      </Menu.Item>
    </Menu>
  );
  const { isLoading } = props;
  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Page
        title="Alerts Report"
        filter={
          <div className="filter-panel">
            <Form form={form} onFinish={list} layout="vertical">
              <Row gutter={[10, 10]} align="bottom">
                <Col sm={4}>
                  {/* <Form.Item label="Entity" name="ahId">
                    <Select
                      allowClear
                      onChange={(v) => loadAsset(v)}
                      options={ahIdList.map((e) => ({
                        value: e.ahid,
                        label: e.ahname,
                      }))}
                    />
                  </Form.Item> */}
                  <Form.Item label="Entity" name="ahId">
                    <TreeSelect
                      onChange={(val) => loadAsset(val)}
                      treeData={ahIdList.parentTreeData}
                      loading={ahIdList.loading}
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item label="Asset" name="assetId">
                    <Select
                      allowClear
                      options={assetList.map((e) => ({
                        value: e.assetId,
                        label: e.assetName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item label="Parameter" name="parameterName">
                    <Select
                      allowClear
                      options={parameterList.map((e) => ({
                        value: e.parameterName,
                        label: e.parameterName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <Form.Item label="From Date" name="fromDate">
                    <DatePicker format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <Form.Item label="To Date" name="toDate">
                    <DatePicker format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="showAll" valuePropName="checked">
                    <Checkbox>Show All</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      Go
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Dropdown overlay={menu} placement="bottom">
                      <Button style={{ width: "120%" }}>
                        <DownloadOutlined />
                      </Button>
                    </Dropdown>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        }
      >
        <Table
          tableLayout="fixed"
          scroll={{ x: 1100, y: 450 }}
          rowKey="alertId"
          loading={data.loading}
          dataSource={data.rows}
          columns={columns}
          size="middle"
          pagination={{
            showSizeChanger: true,

            // //showQuickJumper: true,

            size: "default",
          }}
          bordered
        />
      </Page>
    </Spin>
  );
}

export default withRouter(withAuthorization(AlertReport));
