import { Button, Col, Row, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";

const { Text } = Typography;

function ShiftConfigurationPreview(props) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const [hide, setHide] = useState(false);
  const service = new ShiftMasterAssetWiseService();
  useEffect(() => {
    if (params.id) {
      service.retrieve(params.id).then((response) => {
        setData(response?.data);
      });
    } else {
      service.retrieve(props.id).then((response) => {
        setData(response?.data);
      });
    }

    hidden();
  }, [props.id]);
  const hidden = () => {
    if (props.mode == "View") {
      setHide(true);
    } else {
      setHide(false);
    }
  };
  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 80,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      width: 250,
    },
    {
      dataIndex: "shiftMaster",
      key: "shiftMaster",
      title: "Shift Type",
      width: 250,
      render: (text, record, index) => {
        return record.shiftMaster?.shiftName;
      },
    },
    {
      dataIndex: "dayStart",
      key: "dayStart",
      title: "Day Start",
      width: 100,
      sorter: (a, b) => {
        const daysOfWeek = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        return (
          ((daysOfWeek.indexOf(a.dayStart) + 7) % 7) -
          ((daysOfWeek.indexOf(b.dayStart) + 7) % 7)
        );
      },
    },
    {
      dataIndex: "startTime",
      key: "startTime",
      title: "Start Time",
      width: 150,
      render: (value, record, index) => {
        return dayjs(value).format("HH:mm:ss");
      },
    },
    {
      dataIndex: "dayEnd",
      key: "dayEnd",
      title: "Day End",
      width: 100,
      sorter: (a, b) => {
        const daysOfWeek = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        return (
          ((daysOfWeek.indexOf(a.dayEnd) + 7) % 7) -
          ((daysOfWeek.indexOf(b.dayEnd) + 7) % 7)
        );
      },
    },
    {
      dataIndex: "endTime",
      key: "endTime",
      title: "End Time",
      width: 150,
      render: (value, record, index) => {
        return dayjs(value).format("HH:mm:ss");
      },
    },
  ];

  const finish = () => {
    navigate("/settings/shift/shift-allocation/shift-configuration");
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col lg={8}>
          <table className="table no-border">
            <tr>
              <td>Set Name</td>
              <td>:</td>
              <td>{data?.name}</td>
            </tr>
            <tr>
              <td>Asset</td>
              <td>:</td>
              <td>
                {data?.shiftAssetMappingList.map((e) => (
                  <Tag color="blue">{e.assetName}</Tag>
                ))}
              </td>
            </tr>
          </table>
        </Col>

        <Col lg={24}>
          <Table
            size="small"
            bordered
            rowKey="shiftDetailId"
            pagination={false}
            scroll={{ x: 980 }}
            dataSource={data?.shiftDetailAssetWises}
            columns={columns}
          />
        </Col>

        <Col sm={20}>
          {hide ? (
            <Button
              onClick={() =>
                navigate("/settings/shift/shift-allocation/shift-configuration")
              }
            >
              Back
            </Button>
          ) : (
            <Button onClick={() => props.prevPage()}>Back</Button>
          )}
        </Col>
        <Col>
          {!hide && (
            <Button type="primary" hidden={hide} onClick={finish}>
              Finish
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default ShiftConfigurationPreview;
