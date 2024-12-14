import { DownloadOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx/xlsx.mjs";
import { DateFormat, TimeFormat, filterOption } from "../../utils/helper";
import { SaleOrderService } from "../../services/sale-order-service";
import { ProductService } from "../../services/product-services";
import { AssemblyPlanningDetailService } from "../../services/assembly-planning-detail-service";
import AssemblyPlanningDetailChart from "../assembly-planning-detail-chart";
import { JobOrderDetailService } from "../../services/jobOrderDetailService";
import { MdOutlineDatasetLinked } from "react-icons/md";
import AssetService from "../../../../../services/asset-service";
import Page from "../../../../../utils/page/page";

const style = {
  select: {
    // minWidth: "300px",
  },
};
function JobOrderDetail() {
  const [itemPopup, setItemPopup] = useState(false);
  const [itemData, setItemData] = useState([]);
  const tableRef = useRef();
  const [form] = useForm();
  const modelColumn = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "50px",
      // fixed: this.isMobile ? undefined : "left",
      render: (s, a, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "itemName",
      key: "itemName",
      title: "Item Name",
      // fixed: this.isMobile ? undefined : "left",
      width: "100px",
    },
    {
      dataIndex: "itemCode",
      key: "itemCode",
      title: "Item Code",
      width: "100px",
    },
    {
      dataIndex: "barCode",
      key: "barCode",
      title: "Bar Code",
      width: "100px",
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      width: "50px",
      align: "right",
    },
    {
      dataIndex: "location",
      key: "location",
      title: "Location",
      width: "100px",
    },
  ];
  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "right",
      width: "50px",
      fixed: "left",
    },
    {
      dataIndex: "productMaster",
      key: "productMaster",
      title: "Product Name",
      width: "250px",
      render: (value) => {
        return value?.productName;
      },
    },
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Seq No",
      align: "right",
      width: "100px",
      sorter: (a, b) => a.sequenceNumber - b.sequenceNumber,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Seq Description",

      width: "200px",
      sorter: (a, b) => a.description?.localeCompare(b.description),
    },
    {
      dataIndex: "asset",
      key: "asset",
      title: "Machine Name",
      width: "150px",
      render: (value) => {
        return value.assetName;
      },
    },
    {
      key: "saleOrderId",
      title: "Quantity",
      align: "center",
      children: [
        {
          dataIndex: "acceptedQuantity",
          key: "acceptedQuantity",
          title: "Ok",
          align: "right",
          width: "50px",
        },
        {
          dataIndex: "rejectedQuantity",
          key: "rejectedQuantity",
          title: "Not Ok",
          align: "right",
          width: "70px",
        },
        {
          dataIndex: "producedQuantity",
          key: "producedQuantity",
          title: "Total",
          align: "right",
          width: "60px",
        },
      ],
    },
    {
      dataIndex: "productMaster",
      key: "productMaster",
      title: "Planned Duration",
      width: "200px",
      render: (value, row, index) => {
        return (
          <>
            <Typography.Text strong>{row.duration} min</Typography.Text>
            <Space style={{ width: "100%" }}>
              <Flex vertical justify="center" align="" gap={5}>
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.startTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                  small
                >
                  {TimeFormat(row.startTime)}
                </Typography.Text>
              </Flex>
              <Typography.Text type="secondary">-</Typography.Text>
              <Flex vertical justify="center" align="" gap={5}>
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.endTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                  small
                >
                  {TimeFormat(row.endTime)}
                </Typography.Text>
              </Flex>
            </Space>
          </>
        );
      },
    },
    {
      dataIndex: "productMaster",
      key: "productMaster",
      title: "Actual Duration",
      width: "200px",
      render: (value, row, index) => {
        return (
          <>
            <Typography.Text strong>{row.actualDuration} min</Typography.Text>
            <Space style={{ width: "100%" }}>
              <Flex vertical justify="center" align="" gap={5}>
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.actualStartTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                  small
                >
                  {TimeFormat(row.actualStartTime)}
                </Typography.Text>
              </Flex>
              <Typography.Text type="secondary">-</Typography.Text>
              <Flex vertical justify="center" align="" gap={5}>
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.actualEndTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                  small
                >
                  {TimeFormat(row.actualEndTime)}
                </Typography.Text>
              </Flex>
            </Space>
          </>
        );
      },
    },
    {
      dataIndex: "assemblyPlanningItems",
      key: "assemblyPlanningItems",
      title: "Item Trace",
      align: "center",
      width: "150px",
      render: (value, row) => {
        return (
          <Space>
            {/* <Link
              to={`/digital-job-card/embedd/job-order/assembly-planning-item/${value}`}
            > */}
            <Tooltip title="Track">
              <Button
                type="text"
                onClick={() => {
                  setItemPopup(true);
                  setItemData(value);
                }}
              >
                <MdOutlineDatasetLinked fontSize={"20px"} />
              </Button>
            </Tooltip>
            {/* </Link> */}
          </Space>
        );
      },
    },
  ];
  const [assetList, setAssetList] = useState([]);
  const [saleOrderList, setSaleOrderList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [jobOrderList, setJobOrderList] = useState([]);
  const [componentHash, setComponentHash] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartDataMachine, setChartDataMachine] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const service = new AssemblyPlanningDetailService();
  const saleOrderService = new SaleOrderService();
  const jobOrderDetailService = new JobOrderDetailService();
  const assetService = new AssetService();
  const productService = new ProductService();

  const setChartDataFn = (data) => {
    const uniqueComponent = new Set(data.map((e) => e.productId));
    let resultData = [];
    uniqueComponent.forEach((productId) => {
      let filteredData = data.filter((e) => e.productId === productId);
      resultData.push({
        // name: componentHash[productId]?.productName,
        name: "Planned",
        data: filteredData.map((e) => ({
          meta: e,
          x: e.asset?.assetName,
          y: [new Date(e.startTime).getTime(), new Date(e.endTime).getTime()],
          // y: [0, e.actualDuration],
        })),
      });
      let actualFilteredData = filteredData.filter(
        (e) => e.actualStartTime != null
      );
      resultData.push({
        // name: componentHash[productId]?.productName,
        name: "Actual",
        data: actualFilteredData.map((e) => ({
          meta: e,
          label: "label",
          description: e.sequenceNumber,
          x: e.asset?.assetName,
          y: [
            new Date(e.actualStartTime).getTime(),
            new Date(e.actualEndTime).getTime(),
          ],
          // y: [0, e.duration],
        })),
      });
    });
    setChartData(resultData);

    const uniqueMachine = new Set(data.map((e) => e.assetId));
    resultData = [];
    uniqueMachine.forEach((assetId) => {
      let filteredData = data.filter((e) => e.assetId === assetId);
      resultData.push({
        name: filteredData[0]?.asset.assetName,
        data: filteredData.map((e) => ({
          meta: e,
          x: componentHash[e.productId]?.productName,
          y: [new Date(e.startTime).getTime(), new Date(e.endTime).getTime()],
        })),
      });
    });
    setChartDataMachine(resultData);

    // setGanttChartData(
    //   data.map((e) => ({
    //     start: new Date(e.startTime),
    //     end: new Date(e.endTime),
    //     name: e.machineMaster?.machineName,
    //     type: "task",
    //     id: e.id,
    //     progress: 100,
    //   }))
    // );
  };
  const list = (filter = {}) => {
    setLoading(true);
    service
      .list(filter)
      .then(({ data }) => {
        let res = data.map((e, i) => ({
          ...e,
          sno: i + 1,
          component: componentHash[e.componentId],
        }));

        setData(res);

        setChartDataFn(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onValuesChange = (change, allValue) => {
    list(allValue);
  };
  useEffect(() => {
    // if (params.id) form.setFieldValue("shiftPlanningId", [Number(params.id)]);
    setLoading(true);
    Promise.all([
      saleOrderService.list(),
      productService.list({ status: true }),
      assetService.list({ status: true }),
      jobOrderDetailService.list(),
    ])
      .then((response) => {
        setSaleOrderList(
          response[0].data.map((e) => ({
            label: e.saleOrderNumber,
            value: e.saleOrderId,
          }))
        );
        let obj = {};
        for (let x of response[1].data) {
          obj[x.productId] = x;
        }
        setComponentHash(obj);

        setProductList(
          response[1].data.map((e) => ({
            label: e.productName,
            value: e.productId,
          }))
        );

        setAssetList(
          response[2].data.map((e) => ({
            label: e.assetName,
            value: e.assetId,
          }))
        );
        setJobOrderList(
          response[3].data.map((e) => {
            return { value: e.jobOrderId, label: e.jobOrderNumber };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    form.submit();
  }, [componentHash]);
  const items = [
    {
      key: "1",
      label: `Table`,
      children: (
        <Card
          size="small"
          extra={
            <Tooltip title="Download Data">
              <Button
                size="small"
                // shape="circle"
                type="default"
                onClick={() => exportXLS()}
                icon={<DownloadOutlined />}
                // icon={<Avatar shape="square" size={30} src="/download.png" />}
              >
                Download Data
              </Button>
            </Tooltip>
          }
        >
          <Table
            ref={tableRef}
            id="table"
            scroll={{ x: 900, y: 500 }}
            bordered
            tableLayout="fixed"
            loading={isLoading}
            dataSource={data}
            columns={columns}
            size="small"
            pagination={{
              defaultPageSize: 100,
            }}
            rowKey="id"
          />
        </Card>
      ),
    },
    {
      key: "2",
      label: `Product Wise Chart`,
      children: (
        <Card size="small">
          <AssemblyPlanningDetailChart data={chartDataMachine} />
        </Card>
      ),
    },
    {
      key: "3",
      label: `Resource Wise Chart`,
      children: (
        <Card size="small">
          <AssemblyPlanningDetailChart data={chartData} />
        </Card>
      ),
    },
  ];

  const exportXLS = () => {
    const workSheet = XLSX.utils.table_to_sheet(
      document.querySelector("#table")
    );
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Report");
    XLSX.writeFile(workBook, "Report.xlsx");
  };
  return (
    <Page title="Job Order Details">
      <Row gutter={[10, 5]}>
        <Col span={24}>
          <Form
            layout="vertical"
            form={form}
            onValuesChange={onValuesChange}
            onFinish={list}
            // size="small"
          >
            <Row gutter={[10, 10]}>
              <Col sm={4}>
                <Form.Item name="saleOrderId">
                  {/* <AutoComplete
                    style={style.select}
                    options={saleOrderList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  /> */}
                  <Select
                    placeholder="SO No"
                    style={style.select}
                    options={saleOrderList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    // filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
                <Form.Item name="jobOrderId">
                  {/* <AutoComplete
                    style={style.select}
                    options={jobOrderList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  /> */}
                  <Select
                    placeholder="JO No"
                    style={style.select}
                    options={jobOrderList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    // filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
                <Form.Item name="assetId">
                  <Select
                    placeholder="Machine"
                    style={style.select}
                    options={assetList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
                <Form.Item name="productId">
                  <Select
                    placeholder="Product"
                    style={style.select}
                    options={productList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Tabs type="card" defaultActiveKey="1" items={items} />
        </Col>
      </Row>

      <Modal
        maskClosable={false}
        onCancel={() => {
          setItemPopup(false);
          setItemData([]);
        }}
        open={itemPopup}
        title="Item Details"
        destroyOnClose
        footer={null}
        width={1000}
      >
        <Table
          bordered
          dataSource={itemData}
          columns={modelColumn}
          // columns={itemColumn}
          size="small"
          rowKey="id"
        />
      </Modal>
    </Page>
  );
}

export default JobOrderDetail;
