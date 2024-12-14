import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Form,
  Menu,
  Select,
  Space,
  Spin,
  Table,
  TreeSelect,
  Typography,
  message,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import "jspdf-autotable";
import { debounce } from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import excelExport from "../../../helpers/excel-export";
import { baseUrl } from "../../../helpers/url";
import ContinentService from "../../../services/continent-service";
import CountryService from "../../../services/country-service";
import ReportService from "../../../services/quality-inspection/report-service";
import UploadDownloadService from "../../../services/upload-download-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import downloadPdf from "./pdf-generator1";

const { Text } = Typography;
const setData = {};

const style = {
  formItem: {
    minWidth: "120px",
  },
};
const statusOptions = [
  { label: "Opened", value: 0 },
  { label: "Assigned", value: 1 },
  { label: "Resolved", value: 2 },
  { label: "Verified", value: 3 },
  { label: "Completed", value: 5 },
  { label: "Approved", value: 6 },
];

const columnPdf = [
  {
    key: "assetIds",
    label: "S.No",
    title: "S.No",
  },
  {
    key: "workOrderNumbe",
    label: "WorkOrderNumbe",
    title: "WorkOrderNumbe",
  },
  {
    key: "date",
    label: "Date",
    title: "Date",
  },
  {
    key: "description",
    label: "Description",
    title: "Description",
  },

  {
    key: "rca",
    label: "RCA",
    title: "RCA",
  },
  {
    key: "pa",
    label: "PA",
    title: "PA",
  },
  {
    key: "resolutionTime",
    label: "Resolution Time",
    title: "Resolution Time",
  },
  {
    key: "resolvedBy",
    label: "Resolved By",
    title: "Resolved By",
  },
];
class Reports extends FilterFunctions {
  constructor(props) {
    super(props);

    this.state = {
      actionNeeded: "-",
      currentMonth: moment().endOf("month").toISOString(),
      isAnyFieldSelected: false,
      fromDate: null,
      toDate: null,
      assetIds: null,
      userId: null,
      value: "",
      userList: [],
      assetList: [],
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
      selectedStatus: [],
      open: false,
      showModal: false,
      isDateTabsOpen: false,
      isFilterApplied: false,
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedFields: {
        userIds: [],
        assetIds: [],
        status: [],
      },
    };
  }
  filterfunctionsservice = new FilterFunctions();
  title = "Resolution Work Order Report";

  continentService = new ContinentService();
  countryService = new CountryService();
  service = new ReportService();
  downloadservice = new UploadDownloadService();
  componentDidMount() {
    this.getUserList();
    this.getAppHierarchyList();
    this.getAssetList();
    this.getCurrentUserList();
    this.props.form.submit();
    setTimeout(() => {
      this.loadShiftNames();
      this.getShiftNamesList(this.props.form.getFieldValue("ahId"));
    }, 5000);
  }
  loadShiftNames = () => {
    const { getFieldValue } = this.props.form;

    const ahId = getFieldValue("ahId");
    const assetId = getFieldValue("assetIds");

    this.shiftAllocationService
      .getShiftNames(ahId, assetId)
      .then(({ data }) => {
        this.setState((state) => ({ ...state, shiftNames: data }));
      });
  };
  search = (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .getShiftResolutionWorkOrder(data)
      .then((response) => {
        this.setState((state) => ({ ...state, data: response.data }));
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };

  columns = [
    {
      title: "S.No",
      key: "assetIds",
      dataIndex: "assetIds",
      fixed: "left",
      align: "center",
      width: 50,
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "workOrderNumber",
      key: "workOrderNumber",
      title: "Work Order No",
      width: 120,
      align: "left",
      fixed: "left",
      render: (value, record) => {
        return (
          <Link
            to={`../resolution-work-order/update/${record.resolutionWorkOrderId}`}
          >
            {value}
          </Link>
        );
      },
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      width: 150,
      align: "center",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "left",
      width: 200,
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      align: "left",
      width: 200,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
      width: 200,
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      align: "center",
      render: (value) => {
        return this.service.status(value);
      },
    },
    {
      dataIndex: "rca",
      key: "rca",
      title: "RCA",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "ca",
      key: "ca",
      title: "CA",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "pa",
      key: "pa",
      title: "PA",
      width: 200,
      align: "left",
    },
    {
      dataIndex: "resolutionTime",
      key: "resolutionTime",
      title: "Resolved Time",
      align: "left",
      width: 150,
    },
    {
      dataIndex: "resolvedBy",
      key: "resolvedBy",
      title: "Resolved By",
      align: "left",
      width: 150,
    },
    {
      dataIndex: "approvedBy",
      key: "approvedBy",
      title: "Initiated By",
      align: "left",
      fixed: "right",
      width: 150,
    },
  ];

  columnsPdf = [
    {
      title: "S.No",
      key: "assetIds",
      dataIndex: "assetIds",
      width: 50,
      fixed: "center",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "workOrderNumber",
      key: "workOrderNumber",
      title: "WO No",
      width: 120,
      align: "center",
    },

    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      width: "200",
      align: "left",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      align: "left",
      width: 50,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "center",
      width: 120,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 100,
      align: "center",
      render: (value) => {
        return this.service.status(value);
      },
    },
    {
      dataIndex: "rca",
      key: "rca",
      title: "RCA",
      width: 100,
      align: "center",
    },
    {
      dataIndex: "ca",
      key: "ca",
      title: "CA",
      width: 100,
      align: "center",
    },
    {
      dataIndex: "pa",
      key: "pa",
      title: "PA",
      width: 100,
      align: "center",
    },

    {
      dataIndex: "resolutionTime",
      key: "resolutionTime",
      title: "Resolved Time",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "resolvedBy",
      key: "resolvedBy",
      title: "Resolved By",
      align: "center",
      width: 100,
    },
  ];
  excelSheet = [
    {
      title: "S.No",
      key: "assetIds",
      dataIndex: "assetIds",
      width: 10,
      fixed: "center",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "workOrderNumber",
      key: "workOrderNumber",
      title: "WO No",
      width: 10,
      align: "center",
    },

    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      width: 15,
      align: "left",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "center",
      width: 40,
    },
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift Name",
      align: "left",
      width: 50,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "center",
      width: 40,
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 15,
      align: "center",
      render: (value) => {
        return this.service.status(value);
      },
    },
    {
      dataIndex: "rca",
      key: "rca",
      title: "RCA",
      width: 30,
      align: "center",
    },
    {
      dataIndex: "ca",
      key: "ca",
      title: "CA",
      width: 30,
      align: "center",
    },
    {
      dataIndex: "pa",
      key: "pa",
      title: "PA",
      width: 30,
      align: "center",
    },

    {
      dataIndex: "resolutionTime",
      key: "resolutionTime",
      title: "Resolved Time",
      align: "center",
      width: 30,
    },
    {
      dataIndex: "resolvedBy",
      key: "resolvedBy",
      title: "Resolved By",
      align: "center",
      width: 15,
    },
    {
      dataIndex: "approvedBy",
      key: "approvedBy",
      title: "Initiated By",
      align: "center",
      width: 15,
    },
  ];
  handleDownloadPdf = () => {
    downloadPdf({
      title: "Resolution Work Order Report",
      columns: this.columnsPdf,
      data: this.state.data,
      currentUser: this.state.currentUserList[0].value,
    });
  };
  handleExcelDownload = async () => {
    try {
      const buffer = await excelExport({
        title: "Resolution Work Order Report",
        columns: this.excelSheet,
        data: this.state.data,
        currentUser: this.state.currentUserList[0].value,
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resolution Work Order Report.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };
  getData(assetIds) {
    this.assetService
      .retrieve(assetIds)
      .then((response) => {
        var self = this;
        if (response.data) {
          this.setState(
            (state) => ({
              ...state,
              isLoading: false,
              parameters: response.data.parameters,
              asset: response.data,
            }),
            () => {
              self.timeOut = setTimeout(() => {
                this._getData(assetIds);
              }, 500);
            }
          );
        }
      })
      .catch((err) => {
        clearTimeout(this.timeOut);
      });
  }
  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }
  handleDownload1 = () => {
    let url;
    const startDateFieldValue = this.props.form.getFieldValue("startDate");
    const endDateFieldValue = this.props.form.getFieldValue("endDate");
    const assetIdFieldValue = this.props.form.getFieldValue("assetIds");
    const statusFieldValue = this.props.form.getFieldValue("status");
    const userIdsFieldValue = this.props.form.getFieldValue("userIds");

    const startDateValue = startDateFieldValue
      ? moment(startDateFieldValue).toISOString()
      : undefined;
    const endDateValue = endDateFieldValue
      ? moment(endDateFieldValue).toISOString()
      : undefined;
    const assetIdValue =
      assetIdFieldValue !== undefined ? assetIdFieldValue : "";
    const statusValue = statusFieldValue !== undefined ? statusFieldValue : "";
    const userIdsValue =
      userIdsFieldValue !== undefined ? userIdsFieldValue : "";

    url = `${baseUrl}/pmReport/excel?assetIds=${assetIdValue}&status=${statusValue}&userId=${userIdsValue}${
      startDateValue ? `&startDate=${startDateValue}` : ""
    }${endDateValue ? `&endDate=${endDateValue}` : ""}`;
    this.downloadservice.download(url).then((response) => {
      const urlBlob = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  handleDownload = () => {
    let url;
    const startDateFieldValue = this.props.form.getFieldValue("startDate");
    const endDateFieldValue = this.props.form.getFieldValue("endDate");
    const assetIdFieldValue = this.props.form.getFieldValue("assetIds");
    const statusFieldValue = this.props.form.getFieldValue("status");
    const userIdsFieldValue = this.props.form.getFieldValue("userIds");

    const startDateValue = startDateFieldValue
      ? moment(startDateFieldValue).toISOString()
      : undefined;
    const endDateValue = endDateFieldValue
      ? moment(endDateFieldValue).toISOString()
      : undefined;
    const assetIdValue =
      assetIdFieldValue !== undefined ? assetIdFieldValue : "";
    const statusValue = statusFieldValue !== undefined ? statusFieldValue : "";
    const userIdsValue =
      userIdsFieldValue !== undefined ? userIdsFieldValue : "";

    url = `${baseUrl}/pmReport/pdf?assetIds=${assetIdValue}&status=${statusValue}&userId=${userIdsValue}${
      startDateValue ? `&startDate=${startDateValue}` : ""
    }${endDateValue ? `&endDate=${endDateValue}` : ""}`;
    this.downloadservice.download(url).then((response) => {
      const urlBlob = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };
  submitForm = (value) => {
    this.list(value);
  };
  showDrawer = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false, isDateTabsOpen: false });
  };
  handleDateTabsOpen = () => {
    this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
  };
  handleToggleFieldSelection = (fieldName) => {
    this.setState((prevState) => {
      const updatedSelectedFields = {
        ...prevState.selectedFields,
        [fieldName]: !prevState.selectedFields[fieldName],
      };
      const anyFieldSelected = Object.values(updatedSelectedFields).some(
        (selected) => selected
      );
      return {
        selectedFields: updatedSelectedFields,
        isAnyFieldSelected: anyFieldSelected,
        isFilterApplied: false,
      };
    });
  };

  handleApplyFilter = () => {
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    const selectedUserCount = this.props.form.getFieldValue("userIds")
      ? this.props.form.getFieldValue("userIds").length
      : 0;
    const selectedAssetCount = this.props.form.getFieldValue("assetIds")
      ? this.props.form.getFieldValue("assetIds").length
      : 0;
    const selectedStatusCount = this.props.form.getFieldValue("status")
      ? this.props.form.getFieldValue("status").length
      : 0;

    let selectedPanelCount = 0;
    if (selectedUserCount > 0 || this.state.selectedFields.userIds.length > 0)
      selectedPanelCount++;
    if (selectedAssetCount > 0 || this.state.selectedFields.assetIds.length > 0)
      selectedPanelCount++;
    if (selectedStatusCount > 0 || this.state.selectedFields.status.length > 0)
      selectedPanelCount++;

    this.setState({
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
    });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        userIds: false,
        assetIds: false,
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields();
    this.onClose();
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
    });
  };
  reset = () => {
    this.search();
    this.props.form.resetFields();
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
    });
  };
  onSearchUser = (value) => {
    const filteredUserList = this.state.userList.filter((user) =>
      user.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredUserList, userSearchValue: value });
  };

  onSearchAsset = (value) => {
    const filteredAssetList = this.state.assetList.filter((asset) =>
      asset.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredAssetList, assetSearchValue: value });
  };
  handleUserSearch = debounce((value) => {
    this.setState({ userSearchValue: value }, () => this.onSearchUser(value));
  }, 500);

  handleAssetSearch = debounce((value) => {
    this.setState({ assetSearchValue: value }, () => this.onSearchAsset(value));
  }, 500);

  onChange = (checkedValues) => {
    this.setState({ selectedStatus: checkedValues });
  };
  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };

  render() {
    const {
      open,
      selectedFields,
      isAnyFieldSelected,
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
      selectedPanelCount,
      isFilterApplied,
    } = this.state;
    const {
      filteredUserList,
      filteredAssetList,
      userSearchValue,
      assetSearchValue,
      userList,
      assetList,
      selectedStatus,
    } = this.state;

    const value = this.state.selectedValues || [];
    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount;
    const menu = (
      <Menu>
        {this.props.download || (
          <Menu.Item key="pdf" onClick={this.handleDownloadPdf}>
            <FilePdfOutlined /> PDF
          </Menu.Item>
        )}

        <Menu.Item key="excel" onClick={this.handleExcelDownload}>
          <FileExcelOutlined /> Excel
        </Menu.Item>
      </Menu>
    );
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          filter={
            <Form form={this.props.form} onFinish={this.search} layout="inline">
              <Form.Item name="startDate" hidden></Form.Item>
              <Form.Item name="endDate" hidden></Form.Item>
              <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => {
                    this.getAssetList(v);
                    this.getShiftNamesList(v);
                    this.props.form.setFieldsValue({ shiftName: "All Shift" });
                  }}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeData={this.state.parentTreeList}
                ></TreeSelect>
              </Form.Item>
              <Form.Item name="UserName" hidden style={{ minWidth: "250px" }}>
                <Select
                  showSearch
                  loading={this.state.isCurrentListLoading}
                  placeholder="UserName"
                  allowClear
                  options={this.state.currentUserList}
                ></Select>
              </Form.Item>

              <Space>
                <Badge count={totalCount} color="hwb(205 6% 9%)">
                  <Button
                    onClick={() => this.setState({ open: true })}
                    style={{
                      backgroundColor: isFilterApplied ? "#c9cccf " : "inherit",
                    }}
                  >
                    <FilterFilled />
                  </Button>
                </Badge>
                <Drawer
                  title={<div style={{ fontSize: "20px" }}>Filter</div>}
                  placement="right"
                  onClose={this.onClose}
                  visible={open}
                  type="primary"
                >
                  <Form
                    layout="vertical"
                    form={this.props.form}
                    onFinish={this.search}
                  >
                    <CustomCollapsePanel
                      title="User"
                      style={{
                        backgroundColor:
                          selectedFields.userIds && isFilterApplied
                            ? "inherit"
                            : "inherit",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <Form.Item name="userIds" style={{ minWidth: "250px" }}>
                        <Select
                          showSearch
                          loading={this.state.isUserListLoading}
                          placeholder="UserName"
                          allowClear
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase()) || input === ""
                          }
                          mode="multiple"
                          options={this.state.userList}
                        ></Select>
                      </Form.Item>
                    </CustomCollapsePanel>

                    <CustomCollapsePanel
                      title="Asset"
                      style={{
                        backgroundColor:
                          selectedFields.assetIds && isFilterApplied
                            ? "inherit"
                            : "inherit",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <Form.Item name="assetIds" style={style.formItem}>
                        <Select
                          mode="multiple"
                          showSearch
                          loading={this.state.isAssetListLoading}
                          placeholder="Asset"
                          allowClear
                          options={this.state.assetList}
                          onChange={(v) => {
                            this.getShiftNamesList(
                              this.props.form.getFieldValue("ahId"),
                              v
                            );
                            this.props.form.setFieldsValue({
                              shiftName: "All Shift",
                            });
                          }}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase()) || input === ""
                          }
                        ></Select>
                      </Form.Item>
                    </CustomCollapsePanel>
                    <CustomCollapsePanel title="Shift">
                      <Form.Item name="shiftName">
                        <Select
                          showSearch
                          placeholder="Select Shift"
                          style={{ width: "100%" }}
                          defaultValue="All Shift"
                          options={this.state.shiftNamesList}
                        ></Select>
                      </Form.Item>
                    </CustomCollapsePanel>

                    <CustomCollapsePanel title="Status">
                      <Form.Item name="status" style={style.formItem}>
                        <Checkbox.Group>
                          <Space direction="vertical">
                            <Checkbox value={0}>Opened</Checkbox>
                            <Checkbox value={1}>Assigned</Checkbox>
                            <Checkbox value={2}>Resolved</Checkbox>
                            <Checkbox value={5}>Completed</Checkbox>
                            <Checkbox value={6}>Approved</Checkbox>
                          </Space>
                        </Checkbox.Group>
                      </Form.Item>
                    </CustomCollapsePanel>

                    <CustomCollapsePanel title="Range">
                      <div>
                        <DateTabs
                          open={this.state.isDateTabsOpen}
                          setOpen={this.handleDateTabsOpen}
                          change={(data) => this.setDatefield(data)}
                        />
                      </div>
                    </CustomCollapsePanel>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        onClick={() => {
                          this.handleApplyFilter();
                        }}
                      >
                        <SearchOutlined /> Apply
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={() => {
                          this.reset();
                          this.handleResetFilter();
                        }}
                        style={{ width: "100%" }}
                      >
                        Reset
                      </Button>
                    </Form.Item>
                  </Form>
                </Drawer>

                <Form.Item>
                  {this.props.download || (
                    <Dropdown overlay={menu} placement="bottom">
                      <Button type="primary" style={{ width: "120%" }}>
                        <DownloadOutlined />
                      </Button>
                    </Dropdown>
                  )}
                </Form.Item>
              </Space>
            </Form>
          }
          actions={[]}
        >
          <Table
            scroll={{ x: 1000 }}
            rowKey="assetIds"
            loading={this.state.isLoading}
            dataSource={this.state.data}
            columns={this.columns}
            size="middle"
            pagination={{
              showSizeChanger: true,

              size: "default",
            }}
            bordered
          />
        </Page>
      </Spin>
    );
  }
}

export default withForm(withRouter(withAuthorization(Reports)));
