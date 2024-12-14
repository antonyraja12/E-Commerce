import { Badge, Button, Col, Form, Input, Row, Select, Table } from "antd";
import React, { useState } from "react";

import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import useCrudOperations from "../utils/useCrudOperation";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import DateTabs from "../../../helpers/data";

const Report = (props) => {
  const service = new TatReportService();

  const [dateTabsOpen, setDateTabsOpen] = useState();

  const {
    data,
    isLoading,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
    editingKey,
    setEditingKey,
    form,
    save,
    cancel,
  } = useCrudOperations(service);

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      width: 200,
    },
    {
      dataIndex: "startDate",
      key: "startDate",
      title: "Start Date",
      width: 200,
    },
    {
      dataIndex: "endDate",
      key: "endDate",
      title: "End Date",
      width: 200,
    },
    {
      dataIndex: "targetedPart",
      key: "targetedPart",
      title: "Targeted ",
      width: 200,
    },

    {
      dataIndex: "totalPart",
      key: "totalPart",
      title: "Total",
      width: 200,
    },
    {
      dataIndex: "rejectedPart",
      key: "rejectedPart",
      title: "Rejected",
      width: 200,
    },
    {
      dataIndex: "completedPart",
      key: "completedPart",
      title: "Completed",
      width: 200,
    },
    {
      dataIndex: "pendingPart",
      key: "pendingPart",
      title: "Pending ",
      width: 200,
    },
    {
      dataIndex: "inProgressPart",
      key: "inProgressPart",
      title: "InProgress",
      width: 200,
    },
    {
      dataIndex: "shiftStatus",
      key: "shiftStatus",
      title: "Status",
      width: 200,
    },
  ];
  const handleDateTabsOpen = () => {
    setDateTabsOpen((state) => ({
      ...state,
      dateTabsOpen: !dateTabsOpen,
    }));
  };
  const setDatefield = (v) => {
    form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
  };

  return (
    <Page title="Report">
      <Form layout="vertical" size="small">
        <Row gutter={[10, 10]}>
          <Col>
            <Form.Item name="startDate" hidden></Form.Item>
            <Form.Item name="endDate" hidden></Form.Item>
            <Form.Item label="">
              <DateTabs
                open={dateTabsOpen}
                setOpen={handleDateTabsOpen}
                change={(data) => setDatefield(data)}
              />
            </Form.Item>
          </Col>
          {/* <Col md={4} lg={4} xl={4}>
                <Form.Item label="J.O.No">
                  <Input />
                </Form.Item>
              </Col>
              <Col md={4} lg={2} xl={2}>
                <Form.Item label="Status">
                  <Select
                    options={[
                      "Completed",
                      "Rejected",
                      "Rework",
                      "Pending",
                      "InProgress",
                    ]?.map((e) => {
                      return {
                        value: e,
                        label: e,
                      };
                    })}
                  />
                </Form.Item>
              </Col> */}
          <Col>
            <Form.Item label="">
              <Button htmlType="submit" type="primary">
                Go
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        size="small"
        rowKey="shiftAllocationId"
        columns={columns}
        dataSource={data}
      />
    </Page>
  );
};

export default withRouter(withAuthorization(Report));
