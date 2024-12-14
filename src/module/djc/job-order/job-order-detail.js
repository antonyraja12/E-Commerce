import React, { useEffect, useState } from "react";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import Page from "../../../utils/page/page";
import { Button, Card, Col, Row, Table, Tabs, Tooltip } from "antd";
import * as XLSX from "xlsx/xlsx.mjs";
import { DownloadOutlined } from "@ant-design/icons";
import { JobOrderDetailService } from "../../../services/djc/job-order-detail-service";

function JobOrderDetail() {
  const service = new JobOrderDetailService();

  const columns = [
    {
      dataIndex: "joId",
      key: "joId",
      title: "Job Order",
    },
    {
      dataIndex: "materialId",
      key: "materialId",
      title: "Product Name",
    },
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Sequence No",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },
    {
      dataIndex: "machineTime",
      key: "machineTime",
      title: "Machine Time",
    },
    {
      dataIndex: "labourTime",
      key: "labourTime",
      title: "labour Time",
    },
    {
      dataIndex: "assetId",
      key: "assetId",
      title: "Asset Name",
    },
    {
      dataIndex: "operatorId",
      key: "operatorId",
      title: "Operator",
    },
    {
      dataIndex: "startTime",
      key: "startTime",
      title: "Start Time",
    },
    {
      dataIndex: "endTime",
      key: "endTime",
      title: "End Time",
    },
    {
      dataIndex: "actualQuantity",
      key: "actualQuantity",
      title: "Actual Quantity",
    },
    {
      dataIndex: "plannedQuantity",
      key: "plannedQuantity",
      title: "Planned Quantity",
    },
  ];
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    service
      .list()
      .then(({ data }) => {
        setLoading(true);
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
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
            // ref={tableRef}
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
      <Row>
        <Col span={24}>
          <Tabs type="card" defaultActiveKey="1" items={items} />
        </Col>
      </Row>
    </Page>
  );
}
export default withRouter(withAuthorization(JobOrderDetail));
