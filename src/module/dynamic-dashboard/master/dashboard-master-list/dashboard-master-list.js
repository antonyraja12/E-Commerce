import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tooltip,
  message,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
//import App from "./App.css";
import {
  PlusOutlined,
  SendOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import DashboardMasterService from "../../../../services/dynamic-dashboard/dashboard-master-service";

import { Typography } from "antd";
import { breadcrumbRender } from "../../../../helpers/constants";
import DashboardMasterForm from "../dashboard-master-form.js/dashboard-master-form";

const { Title, Text, Paragraph } = Typography;

function DashboardMasterList() {
  // const menuservice = new MenuService();

  const [model, setModel] = useState({ open: false, title: "" });
  const [list, setList] = useState({ loading: false, data: [] });
  const navigate = useNavigate();
  const ref = useRef(null);
  useEffect(() => {
    onList();
  }, []);
  const onList = () => {
    setList((state) => ({ ...state, loading: true }));
    const service = new DashboardMasterService();

    return service
      .list()
      .then(({ data }) => {
        setList((state) => ({
          ...state,
          data: data.map((e, i) => ({ ...e, sno: i + 1 })),
        }));
      })
      .finally(() => {
        setList((state) => ({ ...state, loading: false }));
      });
  };
  const onSave = (data) => {
    const service = new DashboardMasterService();
    return service.save(data);
  };
  const onAfterSave = ({ dashboardId }) => {
    onClose();
    navigate(`editor/${dashboardId}`);
  };
  const onAdd = () => {
    setModel({ open: true, title: "Add" });
  };
  const onClose = () => {
    setModel({ open: false, title: "" });
  };
  const onSubmit = () => {
    ref.current.submit();
    // console.log(ref.current);
  };
  const onDelete = (id) => {
    const service = new DashboardMasterService();
    return service.delete(id).then(({ data }) => {
      message.success("Deleted Successfully");
      setList((state) => {
        let data = state.data;
        let index = data?.findIndex((e) => e.dashboardId === id);
        data.splice(index, 1);
        return {
          ...state,
          data: data,
        };
      });
    });
  };
  const breadcrumbItem = [
    {
      path: "",
      title: "Dashboard Designer",
    },
  ];
  return (
    <Spin spinning={list.loading}>
      <Card
        style={{}}
        title={
          <Breadcrumb items={breadcrumbItem} itemRender={breadcrumbRender} />
        }
      >
        <Row gutter={[30, 30]}>
          <Col sm={12} xs={24} md={8} lg={8}>
            <Card
              hoverable
              headStyle={{ border: "none" }}
              className="custom-card"
              style={{
                borderRadius: "20px",
              }}
              onClick={onAdd}
            >
              <div
                style={{
                  display: "flex",
                  height: 131,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Title style={{ marginBottom: 10 }} type="secondary">
                  <PlusOutlined />
                </Title>

                <Title level={5} style={{ marginTop: 0 }} type="secondary">
                  Create New Dashboard
                </Title>
              </div>
            </Card>
          </Col>
          {list.data.map((record) => (
            <Col sm={12} xs={24} md={8} lg={8}>
              <Card
                headStyle={{ border: "none" }}
                style={{
                  borderRadius: "20px",
                }}
                key={record.dashboardId}
                title={record.heading}
                extra={
                  <>
                    <Tooltip title="Preview">
                      <Link to={`./editor/${record.dashboardId}/preview`}>
                        <Button type="link" icon={<ExportOutlined />} />
                      </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Delete"
                        description="Are you sure to delete?"
                        onConfirm={() => onDelete(record.dashboardId)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger type="text" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  </>
                }
                bodyStyle={{
                  paddingTop: 0,
                }}
              >
                <div
                  style={{
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Paragraph style={{ flexGrow: 1 }} type="secondary">
                    {record.heading}v {record.version_x}.{record.version_y}.
                    {record.version_z}
                  </Paragraph>
                  <Row justify="space-between" align="middle">
                    <Col>
                      {record.status && (
                        <span
                          style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            strong
                            style={{ fontSize: "1.95em" }}
                            type="success"
                          >
                            <CheckCircleOutlined />
                          </Text>
                          <Text type="secondary">Active</Text>
                        </span>
                      )}
                    </Col>
                    <Col>
                      <Space>
                        {!!!record.status && (
                          <Button
                            type="primary"
                            icon={
                              <SendOutlined
                                style={{
                                  transform:
                                    "rotate(-45deg) translate(4px,2px)",
                                }}
                              />
                            }
                          >
                            Publish
                          </Button>
                        )}

                        <Link to={`./editor/${record.dashboardId}`}>
                          <Button type="default" icon={<EditOutlined />}>
                            Edit
                          </Button>
                        </Link>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal
          // destroyOnClose
          onCancel={onClose}
          open={model.open}
          title={model.title}
          onOk={onSubmit}
        >
          <DashboardMasterForm ref={ref} afterSave={onAfterSave} />
        </Modal>
      </Card>
    </Spin>
  );
}

export default DashboardMasterList;
