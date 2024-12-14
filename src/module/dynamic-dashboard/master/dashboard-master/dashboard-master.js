import {
  ApiOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Modal,
  Typography,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import ResizePanel from "react-resize-panel";
import { Link, useNavigate, useParams } from "react-router-dom";
import { breadcrumbRender } from "../../../../helpers/constants";
import DashboardMasterService from "../../../../services/dynamic-dashboard/dashboard-master-service";
import WidgetMasterService from "../../../../services/dynamic-dashboard/widget-master-service";
import FilterElementPanel from "../../filter/filter-element-panel";
import { DashboardContext, WidgetContext } from "../../helper/helper";
import FilterService from "../../services/filter-service";
import DashboardMasterForm from "../dashboard-master-form.js/dashboard-master-form";
import WidgetPanel from "../widget-master-form/widget-panel";
import Editor from "./Editor";

function DashboardMaster() {
  const breadcrumbItem = [
    {
      path: "../",
      title: "Dashboard Designer",
    },
    {
      path: "./editor/20",
      title: "Editor",
    },
  ];
  const navigate = useNavigate();
  const params = useParams();
  const [model, setModel] = useState({ open: false, title: "" });
  const [apiData, setApiData] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [style, setStyle] = useState({
    maxWidth: "1100px",
    margin: "auto",
    overflow: "auto",
  });
  const [fullScreen, setFullScreen] = useState(false);

  const [selected, setSelected] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [filters, setFilters] = useState([]);
  const [dashboardId, setDashboardId] = useState(null);
  const [over, setOver] = useState(false);
  const [overStates, setOverStates] = useState({
    overApiIntergation: false,
    overPreview: false,
    overPublish: false,
    overDelete: false,
    overFullscreen: false,
    overExitFullScreen: false,
  });
  const ref = useRef(null);

  useEffect(() => {
    setDashboardId(params.id);
    if (dashboardId) {
      list();
    }
  }, [params, dashboardId]);

  useEffect(() => {
    loadData();
  }, [apiUrl]);
  const list = () => {
    const service = new DashboardMasterService();
    service.getById(dashboardId).then(({ data }) => {
      setApiUrl(data.apiUrl);
      setWidgets(
        data.widgets?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
      );

      setFilters(
        data.filters?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
      );
    });
  };

  const onFilterAdd = (element) => {
    const service = new FilterService();
    service
      .add({
        element: element,
        dashboardId: dashboardId,
        width: "150px",
        label: "<<Label>>",
      })
      .then(({ data }) => {
        list();
        message.success("Added Successfully");
      });
  };
  const onAdd = (widgetType) => {
    const service = new WidgetMasterService();
    service
      .add({
        dashboardId: dashboardId,
        widgetType: widgetType,
        height: 300,
        col: 8,
        title: "<<Title>>",
      })
      .then(({ data }) => {
        setSelected(data.widgetId);
        setWidgets((state) => {
          let list = [...state, data];
          return list;
        });
        message.success("Added Successfully");
      });
  };
  const onAfterSave = ({ dashboardId }) => {
    onClose();
  };
  const onDashboardDelete = () => {
    Modal.confirm({
      title: "Delete Dashboard",
      content: "Are you sure to delete this dashboard ?",
      okText: "Yes",
      cancelText: "No",

      onOk: () => {
        const service = new DashboardMasterService();
        return service
          .delete(dashboardId)
          .then(({ data }) => {
            message.success("Deleted successfully");
            navigate("..");
          })
          .catch((err) => {
            message.error(err.message);
          });
      },
    });
  };
  const onClose = () => {
    setModel({ open: false, title: "" });
  };
  const apiPanel = () => {
    setModel({ open: true, title: "API" });
  };
  const onSubmit = () => {
    ref.current.submit();
  };

  const handleOverStateChange = (key, value) => {
    setOverStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    fullScreen
      ? setStyle({
          position: "fixed",
          top: 0,
          height: "100%",
          width: "100%",
          left: 0,
          zIndex: 99,

          maxWidth: "none",
        })
      : setStyle({
          margin: "auto",
          overflow: "auto",
        });
  }, [fullScreen]);

  const loadData = async () => {
    const service = new DashboardMasterService();
    service.fetchAllData(apiUrl, { params: {} }).then((response) => {
      setApiData(response);
    });
  };

  return (
    <>
      <DashboardContext.Provider value={{ dashboardId, apiData }}>
        <WidgetContext.Provider
          value={{ selected, setSelected, widgets, setWidgets }}
        >
          <div style={{ padding: "20px", backgroundColor: "#FFFFFF" }}>
            <Breadcrumb items={breadcrumbItem} itemRender={breadcrumbRender} />
            <br />
            <Card
              style={style}
              styles={{
                body: {
                  backgroundColor: "rgba(244, 247, 253, 1)",
                  padding: "0 10px 10px 10px",
                },
              }}
              title={
                <Flex justify="space-between">
                  <span>Dashboard designer</span>
                  <div
                    style={{
                      display: "flex",
                      rowGap: "10px",
                      columnGap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className="dashboard-button"
                      size="small"
                      onClick={apiPanel}
                      icon={<ApiOutlined />}
                      onMouseEnter={() =>
                        handleOverStateChange("overApiIntergation", true)
                      }
                      onMouseLeave={() =>
                        handleOverStateChange("overApiIntergation", false)
                      }
                    >
                      <span
                        style={{
                          display: overStates.overApiIntergation
                            ? "inline"
                            : "none",
                        }}
                      >
                        Api Integration
                      </span>
                    </Button>

                    <Link to="preview">
                      <Button
                        className="dashboard-button"
                        size="small"
                        icon={<EyeOutlined />}
                        onMouseEnter={() =>
                          handleOverStateChange("overPreview", true)
                        }
                        onMouseLeave={() =>
                          handleOverStateChange("overPreview", false)
                        }
                      >
                        <span
                          style={{
                            display: overStates.overPreview ? "inline" : "none",
                          }}
                        >
                          Preview
                        </span>
                      </Button>
                    </Link>

                    <Link to="preview">
                      <Button
                        className="dashboard-button"
                        size="small"
                        icon={<ExportOutlined />}
                        onMouseEnter={() =>
                          handleOverStateChange("overPublish", true)
                        }
                        onMouseLeave={() =>
                          handleOverStateChange("overPublish", false)
                        }
                      >
                        <span
                          style={{
                            display: overStates.overPublish ? "inline" : "none",
                          }}
                        >
                          Publish
                        </span>
                      </Button>
                    </Link>

                    <Button
                      className="dashboard-button"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={onDashboardDelete}
                      onMouseEnter={() =>
                        handleOverStateChange("overDelete", true)
                      }
                      onMouseLeave={() =>
                        handleOverStateChange("overDelete", false)
                      }
                    >
                      <span
                        style={{
                          display: overStates.overDelete ? "inline" : "none",
                        }}
                      >
                        Delete
                      </span>
                    </Button>

                    {fullScreen ? (
                      <Button
                        className="dashboard-button"
                        size="small"
                        onClick={() => setFullScreen(false)}
                        icon={<FullscreenExitOutlined />}
                        onMouseEnter={() =>
                          handleOverStateChange("overFullscreen", true)
                        }
                        onMouseLeave={() =>
                          handleOverStateChange("overFullscreen", false)
                        }
                      >
                        <span
                          style={{
                            display: overStates.overFullscreen
                              ? "inline"
                              : "none",
                          }}
                        >
                          Exit Full Screen
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className="dashboard-button"
                        size="small"
                        onClick={() => setFullScreen(true)}
                        icon={<FullscreenOutlined />}
                        onMouseEnter={() =>
                          handleOverStateChange("overExitFullScreen", true)
                        }
                        onMouseLeave={() =>
                          handleOverStateChange("overExitFullScreen", false)
                        }
                      >
                        <span
                          style={{
                            display: overStates.overExitFullScreen
                              ? "inline"
                              : "none",
                          }}
                        >
                          Full Screen
                        </span>
                      </Button>
                    )}
                  </div>
                </Flex>
              }
            >
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gap: "10px",
                  display: "flex",
                  paddingTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    width: "calc(100% - 250px)",
                    height: "calc(100vh - 165px)",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: "#ffffff",
                      borderRadius: 10,
                      // flex: "1 1 80px",
                      minHeight: 130,
                      overflowY: "scroll",
                    }}
                    onDrop={(e) => {
                      let field = e.dataTransfer.getData("droppablefield");
                      if (field) {
                        onFilterAdd(field);
                      }
                    }}
                    onDragEnter={(e) => {
                      setOver(true);
                      e.preventDefault();
                    }}
                    onDragLeave={(e) => {
                      setOver(false);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Typography.Title
                      level={3}
                      type="secondary"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        opacity: 0.3,
                      }}
                    >
                      Filter
                    </Typography.Title>
                    <Form layout="vertical" size="small">
                      <Flex
                        gap={10}
                        wrap="wrap"
                        align="baseline"
                        style={{ padding: "10px" }}
                      >
                        {filters?.map((e) => (
                          <FilterElementPanel
                            {...e}
                            refresh={() => {
                              list();
                            }}
                          />
                        ))}
                      </Flex>
                    </Form>
                  </div>
                  <div
                    onDrop={(e) => {
                      let widget = e.dataTransfer.getData("droppableWidget");
                      if (widget) {
                        onAdd(widget);
                      }
                    }}
                    onDragEnter={(e) => {
                      setOver(true);
                      e.preventDefault();
                    }}
                    onDragLeave={(e) => {
                      setOver(false);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    style={{
                      boxSizing: "border-box",
                      flex: "1 1 auto",
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid #dddddd",
                      overflow: `${over ? "auto" : "auto"}`,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }}
                  >
                    <Editor />
                  </div>
                </div>
                <ResizePanel
                  direction="w"
                  style={{ width: "250px", flex: "1 0 250px" }}
                >
                  <div
                    style={{
                      height: "calc(100vh - 165px)",
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    <WidgetPanel />
                  </div>
                </ResizePanel>
              </div>
            </Card>
          </div>

          <Modal
            destroyOnClose
            onCancel={onClose}
            open={model.open}
            title={model.title}
            onOk={onSubmit}
          >
            <DashboardMasterForm
              id={dashboardId}
              ref={ref}
              afterSave={onAfterSave}
            />
          </Modal>
        </WidgetContext.Provider>
      </DashboardContext.Provider>
    </>
  );
}

export default DashboardMaster;
