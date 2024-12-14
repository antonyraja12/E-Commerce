import React from "react";
// import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons";
import { Card, Carousel, Spin } from "antd";
import moment from "moment";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
// import * as FileSaver from "file-saver";
// import { utils, writeFile } from "xlsx";
// import XLSX from "xlsx";
// import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Drawer,
  Form,
  Radio,
  Row,
  Select,
  Space,
  TreeSelect,
  Typography,
} from "antd";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";
import AssetService from "../../../services/asset-service";
import OeeCalculationService from "../../../services/oee-calculation-service";
import OeeReportsService from "../../../services/oee/oee-reports-service";
import DashboardService from "../../../services/preventive-maintenance-services/dashboard-service";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { rootUrl } from "../../../helpers/url";
import OeeExcelReportService from "../../../services/oee/oee-excel-report-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import DowntimeReport from "./downtime-report";
import QualityReport from "./quality-report";
import { OEE_EXCEL } from "../../../helpers/const-service";
import CurrentUserService from "../../../services/user-list-current-user-service";

const service = new CurrentUserService();
const { Text } = Typography;
const { Option } = Select;
const onSearch = (value) => {};
const Modal = ({ onClose, fileName, fileBlob }) => {
  return (
    <div className="modal">
      <h2>{fileName}</h2>
      <a href={URL.createObjectURL(fileBlob)} download={fileName}>
        <button>Download</button>
      </a>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
const CarouselWrapper = styled(Carousel)`
  .slick-dots li button {
    margin-top: 40px;
    width: 13px;
    height: 13px;
    border-radius: 100%;
    background: #fff;
    border: 4px solid #233e7f;
  }
`;
class MachineReport extends FilterFunctions {
  constructor(props) {
    super(props);

    this.state = {
      startDate: dayjs().startOf("Week"),
      endDate: dayjs().endOf("D"),
      reportWise: "Weekly",
      shiftName: "All Shift",
      size: "default",
      isFilterApplied: false,
      userList: [],
      selectedOrganization: "",
      selectedAsset: "",
      selectedReportWise: "",
      selectedStartDate: "",
      selectedEndDate: "",
      //assets: [],
      filteredUserList: [],
      userSearchValue: "",
      title: props?.title,
      open: props?.open,
      isLoading: false,
      asset: [],
      modelName: [],
      selectedHierarchy: null,
      state: props.state,
      props: props.props,
      mode: "",
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
      isDateTabsOpen: false,
      selectedFields: {
        userIds: [],
        assetId: [],
        status: [],
        priority: [],
      },
      startDateValue: null,
      endDateValue: null,
      showModal: false,
      defaultProductiontrend: 0,
      oeeId: "",
      formattedEndTime: "",
      formattedStartTime: "",
      formattedData: [],
      yourModelWiseProductionData: [],
      Size: "large",
      activeTab: "1",
      displayedComponent: null,
      displayedData: "Production",
      shiftData: [],
      loadingChartData: false,
      showModal: false,
      fileName: "",
      fileBlob: null,
      formattedXAxisDates: [],
      assets: [],
    };
  }
  chartRef = React.createRef();
  oeecalculationservice = new OeeCalculationService();
  service = new DashboardService();
  assetService = new AssetService();
  oeeExcelService = new OeeExcelReportService();
  oeereportservice = new OeeReportsService();
  shiftAllocationService = new ShiftAllocationService();
  componentDidMount(prevProps) {
    this.getUserList();
    this.loadAppHierarchy();
    const currentDate = moment();
    const startDate = currentDate.clone().startOf("week");
    const endDate = currentDate.clone().endOf("week");
    const startDateValue = startDate.toISOString();
    const endDateValue = endDate.toISOString();
    this.setState({
      startDateValue,
      endDateValue,
    });
    this.fetchShiftData();

    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    this.props?.form.setFieldsValue({
      // ahName: this.state.parentTreeList[0],
      // assetId: this.state.asset[0],
      startDate: startOfWeek,
      endDate: endOfWeek,
      // mode:mode,
    });
    setTimeout(() => {
      this.handleGoButtonClick();
    }, 1000);
  }
  loadAppHierarchy() {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));
        this.props.form.setFieldValue(
          "ahName",
          this.appHierarchyService.convertToSelectTree(data)[0]?.value
        );
        this.setHierarchyName(
          this.appHierarchyService.convertToSelectTree(data)[0]?.value
        );
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  }

  fetchShiftData = () => {
    this.shiftAllocationService
      .getShiftAllocation()
      .then((data) => {
        this.setState({ shiftData: data }, () => {});
      })
      .catch((error) => {});
  };

  getUniqueShiftTypes = () => {
    const { shiftData } = this.state;

    if (Array.isArray(shiftData)) {
      const uniqueShiftTypes = [
        ...new Set(shiftData.map((data) => data.shiftType)),
      ];
      return uniqueShiftTypes.filter(
        (type) => type !== null && type !== undefined
      );
    } else {
      return [];
    }
  };

  formatDate = (date) => {
    return date ? date.format("DD-MM-YYYY") : "";
  };
  onFinish = (value = {}) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    let obj = { ...value };
    if (obj.mode === 5) {
      obj.fromDate = moment(value.dateRange[0]).format("YYYY-MM-DD");
      obj.toDate = moment(value.dateRange[1]).format("YYYY-MM-DD");
    }
  };

  handleDateTabsModeChange = (mode) => {
    this.setState({ mode }, () => {
      this.props.form.submit();
    });
  };

  handleApplyFilter = () => {
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.onClose();
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });

    const selectedAppHierarchy = this.props.form.getFieldValue("ahName")
      ? this.props.form.getFieldValue("ahName").length
      : 0;

    const selectedAssetCount = this.props.form.getFieldValue("assetId")
      ? this.props.form.getFieldValue("assetId").length
      : 0;
    const selectedStatusCount = this.props.form.getFieldValue("status")
      ? this.props.form.getFieldValue("status").length
      : 0;
    const selectedPriorityCount = this.props.form.getFieldValue("priority")
      ? this.props.form.getFieldValue("priority").length
      : 0;

    let selectedPanelCount = 0;
    if (selectedAppHierarchy > 0 || this.state.selectedFields.ahName.length > 0)
      selectedPanelCount++;
    if (selectedAssetCount > 0 || this.state.selectedFields.assetId.length > 0)
      selectedPanelCount++;
    if (selectedStatusCount > 0 || this.state.selectedFields.status.length > 0)
      selectedPanelCount++;
    if (
      selectedPriorityCount > 0 ||
      this.state.selectedFields.priority.length > 0
    )
      selectedPanelCount++;

    this.setState({
      // selectedUserCount,
      selectedAppHierarchy,
      selectedAssetCount,
      selectedStatusCount,
      selectedPriorityCount,
      selectedPanelCount,
    });
  };

  handleResetFilter = (shiftValue, dateValue) => {
    this.onClose();
    this.setState({
      selectedFields: {
        userIds: false,
        assetIds: false,
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields(); // Reset form fields to clear selections

    // Reset the selected counts and panel count to zero
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
    });
  };

  reset = () => {
    // Set mode value to 2
    const modeValue = 2;

    // Capture the shift and date values before resetting fields
    const shiftValue = "Week"; // Assuming you want to set the shift to "Week"
    const dateValue = this.state.dateFieldValue;

    // Reset fields and close the drawer
    this.props.form.resetFields();
    this.onClose();

    // Reset other states
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
    });

    this.handleResetFilter(shiftValue, dateValue, modeValue);
  };

  setHierarchyName = (value) => {
    this.setState(
      (state) => ({
        ...state,
        assetId: value,
        ahName: value,
      }),
      () => {
        const { ahName, assetId } = this.state;
        if (ahName && assetId) {
          this.loadShiftNames(assetId);
        }
      }
    );
    this.assetService
      .list({
        active: true,
        ahId: value,
        assetCategory: 1,
      })
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          asset: response.data,
        }));
        // if (!this.props.form.getFieldValue("assetId")) {
        //   // this.props.form.setFieldValue("assetId", response.data[0]?.assetId);
        //   this.handleGoButtonClick();
        // }
      });
  };

  handleBarClick = async (event, chartContext, { dataPointIndex }) => {
    try {
      const { getFieldValue } = this.props.form;
      const assetId = getFieldValue("assetId");
      const selectedDate = this.state.formattedXAxisDates[dataPointIndex];

      // Call the getbyGraphData service using 'assetId' and 'selectedDate'
      const graphDataResponse = await this.oeereportservice.getbyGraphData(
        assetId,
        selectedDate
      );

      // Extract the necessary data from the response, update the state, etc.
      const { data: graphData } = graphDataResponse;
      this.setState({
        graphData: graphData, // Update the state with the received graph data
      });

      // Handle further processing or UI updates based on 'graphData'
    } catch (error) {}
  };

  handleExcelButton = () => {
    this.setState({ loadingChartData: true });

    const { getFieldValue } = this.props.form;
    const { shiftName, reportWise, startDate, endDate, displayedData } =
      this.state;

    const ahId = getFieldValue("ahName");
    const assetId = getFieldValue("assetId");
    this.loadShiftNames(assetId);

    const params = new URLSearchParams({
      ahId,
      assetId,
      shiftName: shiftName,
      reportWise: encodeURIComponent(reportWise),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });

    let url;
    switch (displayedData) {
      case "Production":
        url = `${OEE_EXCEL}/excel?${params.toString()}`;
        break;
      case "Downtime":
        url = `${OEE_EXCEL}/excelDownTime?${params.toString()}`;
        break;
      case "Quality":
        url = `${OEE_EXCEL}/qualityReportExcel?${params.toString()}`;
        break;
      default:
        console.error("Invalid displayedData type");
        this.setState({ loadingChartData: false });
        return;
    }

    fetch(url, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json(); // Assuming the response is JSON
      })
      .then((jsonData) => {
        console.log("Fetched JSON data:", jsonData); // Debugging log
        this.convertJsonToExcel(jsonData);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error.message || error);
      })
      .finally(() => {
        this.setState({ loadingChartData: false });
      });
  };

  generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  getCurrentUser = async () => {
    const { data } = await service.getUser();
    return data?.userName || "Unknown User";
  };
  convertJsonToExcel = async (jsonData) => {
    const { displayedData } = this.state;
    const workbook = new ExcelJS.Workbook();
    let sheetName, headers, rows;

    const headersList = jsonData.headers || [];
    const data = jsonData.data || jsonData;
    const currentUserName = await this.getCurrentUser();
    const currentDate = new Date().toLocaleDateString();
    const title =
      displayedData === "Production"
        ? "Production Report"
        : displayedData === "Downtime"
        ? "Downtime Report"
        : displayedData === "Quality"
        ? "Quality Report"
        : "Report"; // Default title

    switch (displayedData) {
      case "Production":
        sheetName = "Production Reports";
        headers = [
          { header: "S.No", key: "S.No", width: 10 },
          { header: "Machine Name", key: "Machine Name", width: 30 },
          { header: "Department", key: "Department", width: 30 },
          { header: "Start Date", key: "Start Date", width: 15 },
          { header: "Shift Name", key: "Shift Name", width: 15 },
          { header: "Availability", key: "Availability", width: 15 },
          { header: "Performance", key: "Performance", width: 15 },
          { header: "Quality", key: "Quality", width: 15 },
          { header: "OEE", key: "OEE", width: 15 },
          { header: "RunTime", key: "RunTime", width: 15 },
          { header: "DownTime", key: "DownTime", width: 15 },
          { header: "Total Part Count", key: "Total Part Count", width: 20 },
          {
            header: "Accepted Part Count",
            key: "Accepted Part Count",
            width: 20,
          },
          {
            header: "Rejected Part Count",
            key: "Rejected Part Count",
            width: 20,
          },
        ];
        rows = data.map((item, index) => ({
          "S.No": index + 1,
          "Machine Name": item.assetName || "N/A",
          Department: item.ahName || "N/A",
          "Start Date": item.startDate
            ? new Date(item.startDate).toLocaleDateString()
            : "N/A",
          "Shift Name": item.shiftName || "N/A",
          Availability: item.availability || 0,
          Performance: item.performance || 0,
          Quality: item.quality || 0,
          OEE: item.oee || 0,
          RunTime: item.runTime || 0,
          DownTime: item.downTime || 0,
          "Total Part Count": item.totalPartCount || 0,
          "Accepted Part Count": item.acceptedPartCount || 0,
          "Rejected Part Count": item.rejectedPartCount || 0,
        }));
        break;

      case "Downtime":
        sheetName = "Downtime Reports";
        headers = [
          { header: "S.No", key: "S.No", width: 10 },
          { header: "Machine Name", key: "Machine Name", width: 20 },
          { header: "Department", key: "Department", width: 20 },
          { header: "Start Date", key: "Start Date", width: 15 },
          { header: "Shift Name", key: "Shift Name", width: 15 },
          { header: "Start Time", key: "Start Time", width: 15 },
          { header: "End Time", key: "End Time", width: 15 },
          { header: "DownTime(Min)", key: "DownTime(Min)", width: 15 },
          { header: "Main Reason", key: "Main Reason", width: 30 },
        ];
        rows = data.map((item, index) => ({
          "S.No": index + 1,
          "Machine Name": item.assetName || "N/A",
          Department: item.ahName || "N/A",
          "Start Date": item.startDate
            ? new Date(item.startDate).toLocaleDateString()
            : "N/A",
          "Shift Name": item.shiftName || "N/A",
          "Start Time": item.start
            ? new Date(item.start).toLocaleTimeString()
            : "N/A",
          "End Time": item.end
            ? new Date(item.end).toLocaleTimeString()
            : "N/A",
          "DownTime(Min)": item.duration || 0,
          "Main Reason": item.downtimeReason || "N/A",
        }));
        break;

      case "Quality":
        sheetName = "Quality Reports";
        headers = headersList.map((header) => ({
          header: header,
          key: header,
          width: 20,
        }));
        rows = data.map((item, index) => {
          const row = {
            "S.No": index + 1,
            "Machine Name": item.assetName || "N/A",
            Department: item.ahName || "N/A",
            "Start Date": item.startDate
              ? new Date(item.startDate).toLocaleDateString()
              : "N/A",
            "Shift Name": item.shiftName || "N/A",
            "Total Parts Produced": item.totalPartsProduced || 0,
            "Accepted Parts": item.acceptedParts || 0,
            "Rejected Parts": item.rejectedParts || 0,
          };

          headersList.forEach((header) => {
            if (header in item.qualityRejectionReasons) {
              row[header] = item.qualityRejectionReasons[header] || 0;
            } else if (["Asset Name", "Entity Name"].includes(header)) {
              row[header] =
                item[header.toLowerCase().replace(/ /g, "")] || "N/A";
            } else {
              if (!row.hasOwnProperty(header)) {
                row[header] = 0;
              }
            }
          });

          return row;
        });
        break;

      default:
        console.error("Invalid displayedData type");
        return;
    }

    const worksheet = workbook.addWorksheet(sheetName);

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const centerAlignmentStyle = { horizontal: "center", vertical: "middle" };
    const boldFontStyle = { bold: true };

    try {
      // Add logo image
      const logoImage = "/byteFactory.png";
      const logo = await fetch(logoImage).then((response) =>
        response.arrayBuffer()
      );
      const imageId = workbook.addImage({
        buffer: logo,
        extension: "png",
      });

      const cell = worksheet.getCell("A1");
      const cellWidth = worksheet.getColumn(1).width * 8.43;
      const cellHeight = worksheet.getRow(1).height;

      const imageWidth = 180;
      const imageHeight = 55;
      const horizontalOffset = (cellWidth - imageWidth) / 2;
      const verticalOffset = (cellHeight - imageHeight) / 2;

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: imageWidth, height: imageHeight },
        editAs: "oneCell",
      });

      let mergeCellsRange;
      if (displayedData === "Quality") {
        const numColumns = headers.length;
        mergeCellsRange = `A1:${String.fromCharCode(65 + numColumns - 1)}3`;
      } else {
        mergeCellsRange = displayedData === "Downtime" ? "A1:I3" : "A1:N3";
      }

      const titleSpacing = " ".repeat(130);
      const titleSpacing1 = " ".repeat(5);
      const titleText = `${title}`;
      const executedByText = `Executed By: ${currentUserName}`;
      const newDate = `Date: ${currentDate}`;

      worksheet.getCell("A1").value = {
        richText: [
          {
            text: `${titleText}`,
            font: { bold: true, size: 16, name: "Calibri" },
          },
          // {
          //   // text: `${newDate}${titleSpacing1}${executedByText}`,
          //   text: `${executedByText}`,
          //   font: { bold: true, size: 16, name: "Calibri" },
          // },
        ],
      };

      worksheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      worksheet.getColumn(1).width = 100;

      worksheet.mergeCells(mergeCellsRange);

      const headerRowStart = 4;
      headers.forEach((header, index) => {
        const headerCell = worksheet.getCell(headerRowStart, index + 1);
        headerCell.value = header.header;
        headerCell.font = boldFontStyle;
        headerCell.alignment = centerAlignmentStyle;
        worksheet.getColumn(index + 1).width = header.width;
      });

      rows.forEach((row, index) => {
        const dataRow = worksheet.getRow(headerRowStart + 1 + index);
        dataRow.values = Object.values(row);
      });

      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = borderStyle;
          cell.alignment = centerAlignmentStyle;
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${sheetName}.xlsx`
      );
    } catch (error) {
      console.error("Error saving Excel file:", error);
    }
  };

  handleGoButtonClick = (data) => {
    this.setState({ loadingChartData: true });
    const { getFieldValue } = this.props.form;
    const { shiftName, reportWise, startDate, endDate, shiftType } = this.state;

    const ahId = getFieldValue("ahName");
    const assetId = getFieldValue("assetId");
    this.loadShiftNames(assetId);
    //const shiftName = getFieldValue("shiftName")

    this.oeereportservice
      .getbyDowntimeReasons(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      )
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          downtimeReasonsData: data.data,
        }));
      });
    Promise.all([
      this.oeereportservice.getbyReports(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),

      this.oeereportservice.getbyQualityCalculation(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),
      this.oeereportservice.getbyDowntimeOccurence(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),
      this.oeereportservice.getbyDefectCategory(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),
      this.oeereportservice.getbyDowntimeReasons(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),
      this.oeereportservice.getbyModelWiseReport(
        ahId,
        assetId,
        shiftName,
        reportWise,
        startDate,
        endDate
      ),
    ])
      .then(
        ([
          reportsResponse,
          //downtimeResponse,

          qualityCalculationResponse,
          downtimeOccurenceResponse,
          defectCategoryResponse,
          downtimeReasonsResponse,
          modelWiseReportResponse,
        ]) => {
          if (
            !reportsResponse.data ||
            reportsResponse.data.length === 0 ||
            !reportsResponse.data.data ||
            reportsResponse.data.data.length === 0 ||
            !qualityCalculationResponse.data ||
            qualityCalculationResponse.data.length === 0 ||
            !qualityCalculationResponse.data.data ||
            qualityCalculationResponse.data.data.length === 0 ||
            !downtimeOccurenceResponse.data ||
            downtimeOccurenceResponse.data.length === 0 ||
            !downtimeOccurenceResponse.data.data ||
            downtimeOccurenceResponse.data.data.length === 0 ||
            !defectCategoryResponse.data ||
            defectCategoryResponse.data.length === 0 ||
            !defectCategoryResponse.data.data ||
            defectCategoryResponse.data.data.length === 0 ||
            !downtimeReasonsResponse.data ||
            downtimeReasonsResponse.data.length === 0 ||
            !downtimeReasonsResponse.data ||
            downtimeReasonsResponse.data.length === 0 ||
            !modelWiseReportResponse.data ||
            modelWiseReportResponse.data.length === 0 ||
            !modelWiseReportResponse.data.data ||
            modelWiseReportResponse.data.data.length === 0
          ) {
            console.log("Data is empty or improperly formatted");
            return;
          }

          const formattedReportsData = reportsResponse.data.data.map(
            (item) => ({
              d: item.data,
              y: item.oee,
              z: item.totalPartsProduced,
              a: item.availability,
              p: item.performance,
              q: item.quality,
              rt: item.runTime,
              dt: item.downTime,
              m: item.xvalue,
              ap: item.acceptedPartCount,
              rp: item.rejectedPartCount,
              d: item.data,
            })
          );
          // console.log("report", formattedReportsData);

          const formattedDowntimeOccurenceData =
            downtimeOccurenceResponse.data.data.map((item) => ({
              reason: item.reason,
              count: item.count,
              minutes: item.minutes,
              color: item.color,
            }));

          const formattedDowntimeReasonsData = downtimeReasonsResponse.data.map(
            (item) => ({
              m: item.m,
              assetId: assetId,
              startDate: item.startDate,
              shiftAllocationId: item.shiftAllocationId,
              downTimeReasons: item.downTimeReasons?.map((reasonItem) => ({
                reason: reasonItem.reason,
                minutes: reasonItem.minutes,
                color: reasonItem.color,
              })),
            })
          );

          const formattedDefectcatagoryData =
            defectCategoryResponse.data.data.map((item) => ({
              reason: item.reason,
              count: item.count,
            }));

          const formattedXAxisDates = formattedReportsData.map((data) => {
            return data.m;
          });

          const formattedQualityCalculationData = Array.isArray(
            qualityCalculationResponse.data.data
          )
            ? qualityCalculationResponse.data.data.map((item) => ({
                x: item.x,
                y: item.y,
              }))
            : [];

          const formattedModelData = modelWiseReportResponse.data.data.map(
            (item) => ({
              x: item.x,
              y: item.y,
            })
          );

          this.setState((state) => ({
            ...state,
            assets: formattedReportsData,
            formattedReportsData: formattedReportsData,
            formattedXAxisDates: formattedXAxisDates,

            formattedQualityCalculationData: formattedQualityCalculationData,
            formattedDowntimeOccurenceData: formattedDowntimeOccurenceData,
            formattedDefectcatagoryData: formattedDefectcatagoryData,
            formattedDowntimeReasonsData: formattedDowntimeReasonsData,

            formattedModelData: formattedModelData,
          }));
        }
      )
      .catch((error) => {})
      .finally(() => {
        this.setState((state) => ({ ...state, loadingChartData: false }));
      });
  };
  loadShiftNames = () => {
    const { getFieldValue } = this.props.form;

    const ahId = getFieldValue("ahName");
    const assetId = getFieldValue("assetId");

    this.shiftAllocationService
      .getShiftNames(ahId, assetId)
      .then(({ data }) => {
        this.setState((state) => ({ ...state, shiftNames: data }));
      });
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

  setDatefield = (v) => {
    let reportWise;
    switch (v.mode) {
      case 1:
        reportWise = "Day";
        break;
      case 2:
        reportWise = "Weekly";
        break;
      case 3:
        reportWise = "Monthly";
        break;
      case 4:
        reportWise = "Yearly";
        break;
      case 5:
        reportWise = "Custom";
        break;
      default:
        reportWise = "Weekly";
        break;
    }
    this.setState((state) => ({
      ...state,
      startDate: v.startDate,
      endDate: v.endDate,
      reportWise: reportWise,
    }));
  };

  setSize = (value) => {
    this.setState({ size: value });
  };

  render() {
    console.log("shiftName", this.state);
    const { loadingChartData, shiftName } = this.state;
    const { shiftData } = this.state;
    const { displayedComponent } = this.state;
    const { formattedData } = this.state;
    const { activeTab, chartComponent } = this.state;
    const {
      size,
      isFilterApplied,
      open,
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
      selectedPanelCount,
      selectedPriorityCount,
    } = this.state;
    const {
      filteredAssetList,
      userSearchValue,
      assetSearchValue,
      userList,
      assetList,
      mode,
    } = this.state;
    const { getFieldValue } = this.props.form;
    const ahId = getFieldValue("ahName");
    const assetId = getFieldValue("assetId") || 0;

    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount +
      selectedPriorityCount;
    const buttonStyle = { marginRight: "10px" };
    const activeButtonStyle = {
      backgroundColor: "blue",
      color: "white",
    };
    const cardTitleStyle = {
      textAlign: "center",
    };
    const { assets, formattedXAxisDates } = this.state;

    const average =
      assets.length > 0
        ? assets.reduce((sum, data) => sum + data.y, 0) / assets.length
        : 0;
    const average1 =
      assets.length > 0
        ? assets.reduce((sum, data) => sum + data.a, 0) / assets.length
        : 0;
    const average2 =
      assets.length > 0
        ? assets.reduce((sum, data) => sum + data.p, 0) / assets.length
        : 0;
    const average3 =
      assets.length > 0
        ? assets.reduce((sum, data) => sum + data.q, 0) / assets.length
        : 0;
    const average4 =
      assets.length > 0
        ? assets.reduce((sum, data) => sum + data.z, 0) / assets.length
        : 0;
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    // if (!access[0] || access[0].length === 0) {
    //   return (
    //     <Result
    //       status={"403"}
    //       title="403"
    //       subTitle="Sorry You are not authorized to access this page"
    //     />
    //   );
    // }

    return (
      <Spin spinning={isLoading}>
        <Page>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "16px",
                }}
              >
                <span>Reports</span>
              </div>
            }
            bordered={false}
            size="small"
          >
            <Form form={this.props.form}>
              <Row gutter={[16]}>
                <Col span={4}>
                  <Form.Item name="startDate" hidden></Form.Item>
                  <Form.Item name="endDate" hidden></Form.Item>
                  <Form.Item name="ahName" initialValue={ahId}>
                    <TreeSelect
                      showSearch
                      style={{ width: "100%" }}
                      loading={this.state.isparentTreeListLoading}
                      placeholder="Entity"
                      treeDefaultExpandAll={false}
                      treeData={this.state.parentTreeList}
                      onChange={this.setHierarchyName}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="assetId"
                    initialValue={this.props.searchParams.get("assetId") || 0}
                  >
                    <Select
                      style={{
                        width: "100%",
                        marginLeft: "5px",
                      }}
                      showSearch
                      placeholder="Machine"
                      optionFilterProp="children"
                      onChange={(value) => {
                        // console.log("Selected value:", value);
                        this.setHierarchyName(value);
                      }}
                      onSearch={onSearch}
                    >
                      <Option key="all" value={0}>
                        All Machines
                      </Option>
                      {this.state.asset?.map((e) => (
                        <Option key={`asset${e.assetId}`} value={e.assetId}>
                          {e.assetName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item style={{ marginLeft: "1%" }}>
                  <Button type="primary" onClick={this.handleGoButtonClick}>
                    Go
                  </Button>
                </Form.Item>
                <Col span={4}>
                  <Row gutter={[4]}>
                    <Col span={12}>
                      <Form.Item>
                        <Badge color="hwb(205 6% 9%)">
                          <Button
                            onClick={() => this.setState({ open: true })}
                            style={{
                              backgroundColor: isFilterApplied
                                ? "#c9cccf"
                                : "inherit",
                            }}
                          >
                            <FilterFilled />
                          </Button>
                        </Badge>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>

            <Drawer
              title={<div style={{ fontSize: "20px" }}>Filter</div>}
              placement="right"
              onClose={this.onClose}
              open={open}
              //destroyOnClose={true}
            >
              <Form
                onFinish={this.handleApplyFilter}
                layout="vertical"
                preserve={true}
              >
                <CustomCollapsePanel title="Shift">
                  <div>
                    <Form.Item name="shift">
                      <Select
                        showSearch
                        placeholder="Select Shift"
                        style={{ width: "100%" }}
                        defaultValue="All Shift"
                        onChange={(shiftName) => {
                          this.setState((state) => ({
                            ...state,
                            shiftName: shiftName,
                          }));
                        }}
                      >
                        {this.state.shiftNames
                          ?.filter((e) => e !== null) // Filter out null values
                          .map((e) => (
                            <Select.Option key={e} value={e}>
                              {e}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
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
                    onClick={(value) => {
                      this.handleGoButtonClick(value);
                      // this.onClose();
                    }}
                  >
                    <SearchOutlined /> Apply
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button
                    onClick={() => {
                      this.reset();
                      // this.onClose();
                      this.handleResetFilter();
                    }}
                    style={{ width: "100%" }}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Radio.Group
                value={this.state.displayedData}
                onChange={(e) =>
                  this.setState((state) => ({
                    ...state,
                    displayedData: e.target.value,
                  }))
                }
              >
                <Radio.Button value="Production">Production</Radio.Button>
                <Radio.Button value="Downtime">Downtime</Radio.Button>
                <Radio.Button value="Quality">Quality</Radio.Button>
              </Radio.Group>
              <div>
                <Button
                  type="primary"
                  onClick={this.handleExcelButton}
                  icon={<DownloadOutlined />}
                >
                  Excel
                </Button>
              </div>
            </div>

            {/* Render the selected section */}
            {displayedComponent}

            <Space
              direction="vertical"
              style={{
                display: "flex",
              }}
            ></Space>
          </Card>
          <br />
          {this.state.displayedData === "Production" && (
            <>
              {/* <Card style={{ marginTop: "20px" }} hoverable> */}
              <Row gutter={[16, 16]}>
                <Col sm={24} xs={24} md={12} lg={24}>
                  <Card size="small" style={{ height: "300px" }} hoverable>
                    <div style={{ height: "100%" }}>
                      <Typography.Title level={5}>OEE (%)</Typography.Title>
                      <ReactApexChart
                        options={{
                          chart: {
                            type: "area",
                            height: 350,
                            zoom: {
                              enabled: false,
                            },
                          },
                          xaxis: {
                            categories: this.state.formattedXAxisDates,
                            labels: {
                              rotate: -45,
                              trim: true,
                              maxHeight: 50,
                            },
                          },
                          yaxis: {
                            title: {
                              text: "OEE",
                            },
                          },
                          tooltip: {
                            enabled: true,
                            y: {
                              formatter: function (val) {
                                return val + "";
                              },
                            },
                            x: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                          colors: ["#00FF00"],
                          annotations: {
                            yaxis: [
                              {
                                y: average,
                                borderColor: "#FF0000",
                                label: {
                                  borderColor: "#FF0000",
                                  style: {
                                    color: "#fff",
                                    background: "#FF0000",
                                  },
                                  text: "Average: " + average.toFixed(2),
                                },
                              },
                            ],
                          },
                        }}
                        series={[
                          {
                            name: "OEE",
                            data: this.state.assets?.map((data) => data.y),
                          },
                        ]}
                        type="area"
                        height={250}
                      />
                    </div>
                  </Card>
                </Col>
                <Col sm={24} xs={24} md={12} lg={12}>
                  <Card size="small" style={{ height: "300px" }} hoverable>
                    <div style={{ height: "100%" }}>
                      <Typography.Title level={5}>
                        Availability
                      </Typography.Title>

                      <ReactApexChart
                        options={{
                          chart: {
                            type: "area",
                            height: 350,
                            zoom: {
                              enabled: false,
                            },
                          },
                          xaxis: {
                            categories: this.state.formattedXAxisDates,
                            labels: {
                              rotate: -45,
                              trim: true,
                              maxHeight: 50,
                            },
                          },
                          yaxis: {
                            title: {
                              text: "Availability",
                            },
                          },
                          tooltip: {
                            enabled: true,
                            y: {
                              formatter: function (val) {
                                return val + "";
                              },
                            },
                            x: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                          colors: ["#FF5F1F"],
                          annotations: {
                            yaxis: [
                              {
                                y: average1, // Assuming you have calculated the average value
                                borderColor: "#FF0000",
                                label: {
                                  borderColor: "#FF0000",
                                  style: {
                                    color: "#fff",
                                    background: "#FF0000",
                                  },
                                  text: "Average: " + average1.toFixed(2),
                                },
                              },
                            ],
                          },
                        }}
                        series={[
                          {
                            name: "Availability",
                            data: this.state.assets?.map((data) => data.a),
                          },
                        ]}
                        type="area"
                        height={250}
                      />
                    </div>
                  </Card>
                </Col>
                <Col sm={24} xs={24} md={12} lg={12}>
                  <Card size="small" style={{ height: "300px" }} hoverable>
                    <div style={{ height: "100%" }}>
                      <Typography.Title level={5}>Performance</Typography.Title>
                      <ReactApexChart
                        options={{
                          chart: {
                            type: "area",
                            height: 350,
                            zoom: {
                              enabled: false,
                            },
                          },
                          xaxis: {
                            categories: this.state.formattedXAxisDates,
                            labels: {
                              rotate: -45,
                              trim: true,
                              maxHeight: 50,
                            },
                          },
                          yaxis: {
                            title: {
                              text: "Performance",
                            },
                          },
                          tooltip: {
                            enabled: true,
                            y: {
                              formatter: function (val) {
                                return val + "";
                              },
                            },
                            x: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                          colors: ["#7F00FF"],
                          annotations: {
                            yaxis: [
                              {
                                y: average2,
                                borderColor: "#FF0000",
                                label: {
                                  borderColor: "#FF0000",
                                  style: {
                                    color: "#fff",
                                    background: "#FF0000",
                                  },
                                  text: "Average: " + average2.toFixed(2),
                                },
                              },
                            ],
                          },
                        }}
                        series={[
                          {
                            name: "Performance",
                            data: this.state.assets?.map((data) => data.p),
                          },
                        ]}
                        type="area"
                        height={250}
                      />
                    </div>
                  </Card>
                </Col>

                <Col sm={24} xs={24} md={12} lg={12}>
                  <Card size="small" style={{ height: "300px" }} hoverable>
                    <Typography.Title level={5}>Quality</Typography.Title>
                    <ReactApexChart
                      options={{
                        chart: {
                          type: "area",
                          height: 350,
                          zoom: {
                            enabled: false,
                          },
                        },
                        xaxis: {
                          categories: this.state.formattedXAxisDates,
                          labels: {
                            rotate: -45,
                            trim: true,
                            maxHeight: 50,
                          },
                        },
                        yaxis: {
                          title: {
                            text: "Quality",
                          },
                        },
                        tooltip: {
                          enabled: true,
                          y: {
                            formatter: function (val) {
                              return val + "";
                            },
                          },
                          x: {
                            formatter: function (val) {
                              return val;
                            },
                          },
                        },
                        colors: ["#45818e"],
                        annotations: {
                          yaxis: [
                            {
                              y: average3, // Assuming you have calculated the average value
                              borderColor: "#FF0000",
                              label: {
                                borderColor: "#FF0000",
                                style: {
                                  color: "#fff",
                                  background: "#FF0000",
                                },
                                text: "Average: " + average3.toFixed(2),
                              },
                            },
                          ],
                        },
                      }}
                      series={[
                        {
                          name: "Quality",
                          data: this.state.assets?.map((data) => data.q),
                        },
                      ]}
                      type="area"
                      height={250}
                    />
                  </Card>
                </Col>
                <Col sm={24} xs={24} md={12} lg={12}>
                  <Card size="small" style={{ height: "300px" }} hoverable>
                    <div style={{ height: "100%" }}>
                      <Typography.Title level={5}>
                        Production Count
                      </Typography.Title>
                      <ReactApexChart
                        options={{
                          chart: {
                            type: "area",
                            height: 350,
                            zoom: {
                              enabled: false,
                            },
                          },
                          plotOptions: {
                            bar: {
                              onClick: this.handleBarClick,
                            },
                          },
                          xaxis: {
                            categories: this.state.formattedXAxisDates,
                            labels: {
                              rotate: -45,
                              trim: true,
                              maxHeight: 50,
                            },
                          },
                          yaxis: {
                            title: {
                              text: "Product Count",
                            },
                          },
                          tooltip: {
                            enabled: true,
                            y: {
                              formatter: function (val) {
                                return val + "";
                              },
                            },
                            x: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                          annotations: {
                            yaxis: [
                              {
                                y: average4, // Assuming you have calculated the average value
                                borderColor: "#FF0000",
                                label: {
                                  borderColor: "#FF0000",
                                  style: {
                                    color: "#fff",
                                    background: "#FF0000",
                                  },
                                  text: "Average: " + average4.toFixed(2),
                                },
                              },
                            ],
                          },
                        }}
                        series={[
                          {
                            name: "Total PartCount",
                            data: this.state.assets?.map((data) => data.z),
                          },
                        ]}
                        type="area"
                        height={250}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
              {/* </Card> */}
            </>
          )}

          {this.state.displayedData === "Downtime" && (
            <DowntimeReport
              formattedXAxisDates={this.state.formattedXAxisDates}
              assets={this.state.assets}
              assetId={assetId}
              handleGoButtonClick={this.handleGoButtonClick}
              formattedDowntimeOccurenceData={
                this.state.formattedDowntimeOccurenceData
              }
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              ahId={this.state.ahName}
              shiftName={this.state.shiftName}
              formattedDowntimeReasonsData={
                this.state.formattedDowntimeReasonsData
              }
              downtimeReasonsData={this.state.downtimeReasonsData}
            />
          )}

          {this.state.displayedData === "Quality" && (
            <QualityReport
              formattedXAxisDates={this.state.formattedXAxisDates}
              assets={this.state.assets}
              formattedQualityCalculationData={
                this.state.formattedQualityCalculationData
              }
              formattedModel={this.state.formattedModelData}
              formattedDefectcatagoryData={
                this.state.formattedDefectcatagoryData
              }
            />
          )}
        </Page>
      </Spin>
    );
  }
}
export default withRouter(withAuthorization(withForm(MachineReport)));
