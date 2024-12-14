import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import AssemblyService from "../../../services/track-and-trace-service/assembly-service";
import useCrudOperations from "../utils/useCrudOperation";
import { MdOutlinePrint } from "react-icons/md";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Page from "../../../utils/page/page";
import { ConfirmationNumberRounded } from "@material-ui/icons";
import _ from "lodash";
import New from "./new";

const Reprint = () => {
  const service = new AssemblyService();
  const assemblyService = new AssemblyService();

  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState({
    dataSource: [],
    loading: false,
    size: "small",
    bordered: true,
  });

  const ConfirmModal = (label, id) => {
    Modal.confirm({
      title: ` Are you sure? Do you want to reprint this ${label}`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        ReprintCall(label, id);
      },
      onCancel() {
        // Optionally handle cancel event
      },
    });
  };

  const ReprintCall = (label, id) => {
    assemblyService.labelRePrint(id, label).then(({ data }) => {});
  };
  const columns = [
    {
      dataIndex: "assemblyId",
      title: "S.No.",
      render: (value, row, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "buildLabel",
      title: "Build Label",
    },
    {
      dataIndex: "fgNo",
      title: "FG.No",
    },
    {
      dataIndex: "productCode",
      title: "Product Code",
    },
    {
      dataIndex: "model",
      title: "Model",
    },

    {
      dataIndex: "status",
      title: "Status",
    },
    {
      title: "Action",
      children: [
        {
          title: "Build Label",
          dataIndex: "assemblyId",
          width: 100,
          align: "center",
          render: (value, rec) => (
            <Tooltip title="Print">
              <Button
                onClick={() => ConfirmModal(rec.buildLabel, value)}
                htmlType="submit"
                size="small"
                icon={<MdOutlinePrint style={{ fontSize: "15px" }} />}
              />
            </Tooltip>
          ),
        },
        {
          title: "FG.No",
          dataIndex: "assemblyId",
          width: 100,
          align: "center",
          render: (value, rec) => (
            <Tooltip title="Print">
              <Button
                onClick={() => ConfirmModal(rec.fgNo, value)}
                htmlType="submit"
                size="small"
                icon={<MdOutlinePrint style={{ fontSize: "15px" }} />}
              />
            </Tooltip>
          ),
        },
      ],
    },
  ];

  const fetchData = async () => {
    try {
      setData((state) => ({ ...state, loading: true }));

      const { data } = await service.getLastEntryList();

      const buildLabel = data
        ?.filter((e) => e.buildLabel !== null && e.buildLabel !== undefined)
        ?.map((e) => ({
          label: e.buildLabel,
          value: e.buildLabel,
        }));
      const fgNo = data
        ?.filter((e) => e.fgNo !== null && e.fgNo !== undefined)
        ?.map((e) => ({
          label: e.fgNo,
          value: e.fgNo,
        }));

      setData((state) => ({
        ...state,
        dataSource: data,
        buildLabelOption: buildLabel,
        fgOption: fgNo,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setData((state) => ({ ...state, loading: false }));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const filter = (v) => {
    let s = v.target.value.toLowerCase();
    setSearchValue(s);
  };

  const filteredData = useMemo(() => {
    let str = searchValue?.toLowerCase();

    return data.dataSource?.filter((val) => {
      if (!searchValue) return true;
      return (
        val.buildLabel?.toLowerCase().includes(str) ||
        val.fgNo?.toLowerCase().includes(str)
      );
    });
  }, [data, searchValue]);

  return (
    <Page>
      <New />
      <Row justify="space-between">
        <Col span={7}>
          <Form>
            <Form.Item>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                value={searchValue}
                onChange={filter}
                placeholder={"Search Fg or Buildlabel"}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Table
        columns={columns}
        bordered
        size="small"
        pagination={false}
        dataSource={filteredData}
        loading={data.loading}
      />
    </Page>
  );
};
export default Reprint;
