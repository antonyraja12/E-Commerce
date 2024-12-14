import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx/xlsx.mjs";
import { MachineMasterService } from "../../services/machine-master-service";
import { ShiftPlanningDetailService } from "../../services/shift-planning-detail-service";
import { ShiftPlanningService } from "../../services/shift-planning-service";
import { DateTimeFormat, filterOption } from "../../utils/helper";
import ShiftPlanningDetailChart from "../shift-planning-detail-chart";
import ShiftPlanningProduction from "../shift-planning-production/shift-planning-production";
import { ComponentMasterService } from "../../services/component-master-service";

const style = {
  select: {
    // minWidth: "300px",
  },
};
function SaleOrderDetail() {
  const machineMasterService = new MachineMasterService();
  const [isSaving, setSaving] = useState(false);
  const [popup, setPopup] = useState({ open: false, id: undefined });
  const ref = useRef();
  const tableRef = useRef();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [form] = useForm();
  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "right",
      width: "100px",
      fixed: "left",
    },
    {
      dataIndex: "component",
      key: "componentName",
      title: "Item Name",
      width: "250px",
      render: (value) => {
        return value?.componentName;
      },
      sorter: (a, b) =>
        a.component?.componentName.localeCompare(b.component?.componentName),
      // onFilter: (value, record) => record.componentId === value,
    },
    {
      dataIndex: "component",
      key: "componentNumber",
      title: "Item No",
      width: "150px",
      render: (value) => {
        return value?.componentNumber;
      },
      sorter: (a, b) =>
        a.component?.componentNumber.localeCompare(
          b.component?.componentNumber
        ),
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
      dataIndex: "machineMaster",
      key: "machineMaster",
      title: "Machine Name",
      width: "150px",
      render: (value) => {
        return value.machineName;
      },
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      align: "right",
      width: "100px",
    },
    {
      dataIndex: "duration",
      key: "duration",
      title: "Duration",
      align: "right",
      width: "100px",
    },

    {
      dataIndex: "startTime",
      key: "startTime",
      title: "Seq Start Time",
      width: "190px",
      render: (value) => {
        return DateTimeFormat(value);
      },
      sorter: (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    },
    {
      dataIndex: "endTime",
      key: "endTime",
      title: "Seq End Time",
      width: "190px",
      render: (value) => {
        return DateTimeFormat(value);
      },
      sorter: (a, b) =>
        new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    },
    {
      dataIndex: "shiftMaster",
      key: "shiftMaster",
      title: "Shift",
      width: "100px",
      fixed: "right",
      render: (value) => {
        return value.shiftName;
      },
    },
  ];
  const [machineList, setMachineList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [shiftPlanningList, setShiftPlanningList] = useState([]);
  const [componentHash, setComponentHash] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ganttChartData, setGanttChartData] = useState([]);
  const [chartDataMachine, setChartDataMachine] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const service = new ShiftPlanningDetailService();
  const componentService = new ComponentMasterService();
  const shiftPlanningService = new ShiftPlanningService();

  const openPopup = (id) => {
    setPopup({ id: id, open: true });
    service
      .retrieve(id)
      .then(({ data }) => {
        patchForm(data);
      })
      .finally(() => {});
  };
  const closePopup = () => {
    setPopup({ id: undefined, open: false });
  };

  const setChartDataFn = (data) => {
    const uniqueComponent = new Set(data.map((e) => e.componentId));
    let resultData = [];
    uniqueComponent.forEach((componentId) => {
      let filteredData = data.filter((e) => e.componentId === componentId);
      resultData.push({
        name: componentHash[componentId]?.componentName,
        data: filteredData.map((e) => ({
          meta: e,
          x: e.machineMaster?.machineName,
          y: [new Date(e.startTime).getTime(), new Date(e.endTime).getTime()],
        })),
      });
    });
    setChartData(resultData);

    const uniqueMachine = new Set(data.map((e) => e.machineId));
    resultData = [];
    uniqueMachine.forEach((machineId) => {
      let filteredData = data.filter((e) => e.machineId === machineId);
      resultData.push({
        name: filteredData[0]?.machineMaster.machineName,
        data: filteredData.map((e) => ({
          meta: e,
          x: componentHash[e.componentId]?.componentName,
          y: [new Date(e.startTime).getTime(), new Date(e.endTime).getTime()],
        })),
      });
    });
    setChartDataMachine(resultData);

    setGanttChartData(
      data.map((e) => ({
        start: new Date(e.startTime),
        end: new Date(e.endTime),
        name: e.machineMaster?.machineName,
        type: "task",
        id: e.id,
        progress: 100,
      }))
    );
  };
  const getFormInstance = () => {
    return ref.current?.ref.current;
  };
  const submitForm = () => {
    let form = getFormInstance();
    form.submit();
  };
  const patchForm = (data) => {
    let form = getFormInstance();
    form.setFieldsValue({
      ...data,
      actualStartTime: data?.actualStartTime
        ? dayjs(data.actualStartTime)
        : null,
      actualEndTime: data?.actualEndTime ? dayjs(data.actualEndTime) : null,
    });
  };
  const submit = (value, id) => {
    setSaving(true);
    service
      .production(value, id)
      .then(({ data }) => {
        message.success("Saved Successfully");
      })
      .finally(() => {
        setSaving(false);
      });
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
    if (params.id) form.setFieldValue("shiftPlanningId", [Number(params.id)]);
    setLoading(true);
    Promise.all([
      componentService.list(),
      shiftPlanningService.list(),
      machineMasterService.list({ status: true }),
    ])
      .then((response) => {
        setComponentList(
          response[0].data.map((e) => ({
            label: e.componentName,
            value: e.componentId,
          }))
        );
        let obj = {};
        for (let x of response[0].data) {
          obj[x.componentId] = x;
        }
        setComponentHash(obj);

        setShiftPlanningList(
          response[1].data.map((e) => ({
            label: e.salesOrderNo,
            value: e.shiftPlanningId,
          }))
        );

        setMachineList(
          response[2].data.map((e) => ({
            label: e.machineName,
            value: e.machineId,
          }))
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
      label: `Component Wise Chart`,
      children: (
        <Card size="small">
          <ShiftPlanningDetailChart data={chartData} />
        </Card>
      ),
    },
    {
      key: "3",
      label: `Machine Wise Chart`,
      children: (
        <Card size="small">
          <ShiftPlanningDetailChart data={chartDataMachine} />
        </Card>
      ),
    },
    // {
    //   key: "4",
    //   label: `Gantt Chart`,
    //   children: (
    //     <Card>
    //       <ShiftPlanningDetailGanttChart data={ganttChartData} />
    //     </Card>
    //   ),
    // },
    // {
    //   key: "5",
    //   label: `Production Chart`,
    //   children: (
    //     <Card>
    //       <ShiftPlanningProductionChart data={data} />
    //     </Card>
    //   ),
    // },
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
    <Card title="Sales Order Details">
      <Row gutter={[10, 5]}>
        <Col span={24}>
          <Form
            layout="vertical"
            form={form}
            onValuesChange={onValuesChange}
            onFinish={list}
            size="small"
          >
            <Row gutter={[10, 10]}>
              <Col sm={4}>
                <Form.Item name="shiftPlanningId" label="JO No">
                  <Select
                    style={style.select}
                    options={shiftPlanningList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
                <Form.Item name="componentId" label="Item Name">
                  <Select
                    style={style.select}
                    options={componentList}
                    loading={isLoading}
                    showSearch
                    allowClear
                    filterOption={filterOption}
                    mode="multiple"
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
                <Form.Item name="machineId" label="Machine">
                  <Select
                    style={style.select}
                    options={machineList}
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
          <Tabs
            // tabBarStyle={{
            //   marginBottom: -1,
            // }}
            type="card"
            defaultActiveKey="1"
            items={items}
          />
        </Col>
      </Row>

      <Modal
        maskClosable={false}
        confirmLoading={isSaving}
        onOk={submitForm}
        onCancel={closePopup}
        open={popup.open}
        title="Production"
        destroyOnClose
      >
        <ShiftPlanningProduction ref={ref} submit={submit} id={popup.id} />
      </Modal>
    </Card>
  );
}

export default SaleOrderDetail;
