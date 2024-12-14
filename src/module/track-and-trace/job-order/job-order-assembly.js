import {
  Col,
  Form,
  Input,
  Row,
  Table,
  Button,
  Select,
  Modal,
  Descriptions,
  Tag,
} from "antd";
import AssemblyService from "../../../services/track-and-trace-service/assembly-service";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Page from "../../../utils/page/page";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import { dateFormat } from "../../../helpers/date-format";
function JobOrderAssembly() {
  const [jobOrder, setJobOrder] = useState([]);
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [data, setData] = useState({
    dataSource: [],
    loading: false,
    size: "small",
    bordered: true,
  });
  const fetchData = (value) => {
    const service = new AssemblyService();
    setData((state) => ({ ...state, loading: true }));
    service
      .list({
        ...value,
        jobOrderId: id,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: "assemblyId,asc",
      })
      .then(({ data }) => {
        setData((state) => ({ ...state, dataSource: data.content }));
        setTotal(data.totalElements);
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  useEffect(() => {
    fetchData();
  }, [pagination]);
  useEffect(() => {
    const service = new TatJobOrderService();
    service.retrieve(id).then(({ data }) => {
      setJobOrder([
        {
          key: "code",
          label: "Code",
          children: (
            <>
              {data?.productMasters?.map((product, index) => (
                <Tag key={index}>{product?.code}</Tag>
              ))}
            </>
          ),
          span: 2,
        },
        {
          key: "jobOrderNo",
          label: "Job Order No.",
          children: data["jobOrderNo"],
        },
        {
          key: "date",
          label: "Date",
          children: dateFormat(data["date"]),
        },

        {
          key: "quantity",
          label: "Quantity",
          children: data["quantity"],
        },
        {
          key: "model",
          label: "Model",
          children: data["model"],
        },
        {
          key: "variant",
          label: "Variant",
          children: data["variant"],
        },
        {
          key: "category",
          label: "Type",
          children: (
            <>
              {data?.productMasters?.map((product, index) => (
                <Tag key={index}>{product?.category}</Tag>
              ))}
            </>
          ),
        },
      ]);
    });
  }, [id]);

  const onPageChange = (page, pageSize) => {
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize: pageSize,
    }));
  };
  const columns = [
    {
      dataIndex: "assemblyId",
      title: "S.No.",
      render: (value, row, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      dataIndex: "buildLabel",
      title: "Build Label",
    },
    {
      dataIndex: "start",
      title: "Start",
      render: (value) => {
        return value ? dayjs(value).format("DD-MM-YYYY hh:mm A") : " ";
      },
    },
    {
      dataIndex: "end",
      title: "End",
      render: (value) => {
        return value ? dayjs(value).format("DD-MM-YYYY hh:mm A") : " ";
      },
    },
    {
      dataIndex: "workStationName",
      title: "Workstation",
    },
    {
      dataIndex: "status",
      title: "Status",
    },
  ];

  return (
    <Page>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Descriptions
            column={4}
            bordered
            items={jobOrder}
            layout="horizontal"
          />
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            pagination={{
              ...pagination,
              total: total,
              onChange: onPageChange,
            }}
            {...data}
          />
        </Col>
      </Row>
    </Page>
  );
}

export default JobOrderAssembly;
