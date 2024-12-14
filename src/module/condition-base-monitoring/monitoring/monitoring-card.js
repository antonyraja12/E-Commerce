import { Button, Card, Modal, Space, Table, Typography } from "antd";
import moment from "moment";
import { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { IoMdAlert } from "react-icons/io";
import LiveChart from "./live-chart";
import { AiOutlineLineChart } from "react-icons/ai";
function MonitoringCard(props) {
  const { title, value, alerts, dataType, id } = props;
  const [open, setOpen] = useState(false);
  const [openGraph, setOpenGraph] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const columns = [
    {
      dataIndex: "alertName",
      title: "Alert Name",
      width: 200,
      fixed: "left",
    },
    {
      dataIndex: "timestamp",
      key: "date",
      title: "Date",
      width: 120,
      render: (val) => {
        return moment(val).format("DD-MM-YYYY");
      },
    },
    {
      dataIndex: "timestamp",
      key: "time",
      title: "Time",
      width: 120,
      render: (val) => {
        return moment(val).format("hh:mm:ss A");
      },
    },

    {
      dataIndex: "description",
      title: "Description",
      width: 250,
    },
    {
      dataIndex: "priority",
      title: "Priority",
      align: "right",
      width: 80,
    },
    {
      dataIndex: "value",
      title: "Value",
      width: 150,
    },
    {
      dataIndex: "condition",
      title: "Condition",
      width: 150,
    },
  ];
  return (
    <Card
      className={`monitoring-card ${alerts?.length > 0 && "warning"}`}
      styles={{ body: { padding: 20 } }}
    >
      <div className="warning">
        <Space.Compact size="small">
          {(dataType === "NUMBER" || dataType === "BOOLEAN") && (
            <Button
              icon={<AiOutlineLineChart />}
              type="text"
              onClick={() => {
                setOpenGraph(true);
              }}
            />
          )}
          {alerts?.length > 0 && (
            <Button
              danger
              icon={<IoMdAlert />}
              onClick={openModal}
              type="text"
            />
          )}
        </Space.Compact>
      </div>

      <Typography.Text type="secondary" ellipsis>
        {title}
      </Typography.Text>
      <Typography.Title
        ellipsis
        level={3}
        style={{ marginTop: "1rem", marginBottom: "0", color: "#203874" }}
      >
        {new String(value)}
      </Typography.Title>
      <div className="icon">
        <FiBarChart2 />
      </div>

      <Modal
        width={1000}
        centered
        title="Alerts"
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Close"
      >
        <Table
          tableLayout="fixed"
          scroll={{ x: 800 }}
          bordered
          size="small"
          columns={columns}
          dataSource={alerts}
        />
      </Modal>
      {(dataType === "NUMBER" || dataType === "BOOLEAN") && (
        <Modal
          width={1000}
          centered
          title={title}
          open={openGraph}
          onCancel={() => setOpenGraph(false)}
          okButtonProps={{ hidden: true }}
          cancelText="Close"
        >
          <LiveChart
            id={id}
            dataType={dataType}
            value={dataType === "BOOLEAN" ? (value ? 1 : 0) : Number(value)}
            title={title}
          />
        </Modal>
      )}
    </Card>
  );
}
export default MonitoringCard;
