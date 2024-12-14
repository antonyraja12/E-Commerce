import {
  Button,
  Col,
  Form,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PageForm from "../../../utils/page/page-form";
//import CustomCollapsePanel from "../../helpers/collapse";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AssetService from "../../../services/asset-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import { active } from "d3";
const { Option } = Select;
const localizer = momentLocalizer(moment);
const style = {
  formItem: {
    minWidth: "120px",
  },
};
const { Text, Title } = Typography;
const cardActionsStyle = {
  display: "flex",
  justifyContent: "space-between",
};
const actionButtonStyle = {
  marginLeft: "auto",
};
const color = [
  { backgroundColor: "#FF7F50", color: "#81002c" },
  { backgroundColor: "#03a9f494", color: "#07405a" },
  { backgroundColor: "#bc59cc78", color: "#530561" },
  { backgroundColor: "#8bc34ad6", color: "#2e5402" },
  { backgroundColor: "#ff9800b0", color: "#6c4101" },
  { backgroundColor: "#f44336bd", color: "#770b03" },
];

class ShiftAllocationcalender extends PageForm {
  assetService = new AssetService();
  shiftAllocationService = new ShiftAllocationService();

  eventsRef = React.createRef([]);

  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      open: false,
      mainModalOpen: false,
      modalOpen: false,
      shiftDetails: [],
      assetList: [],
      open: false,
      showModal: false,
      selectedFields: {
        assetId: [],
      },
    };
  }

  componentDidMount() {
    super.componentDidMount();

    // console.log("Starting componentDidMount");

    this.setState({
      loading: true,
    });

    this.assetService
      .list({ active: true })
      .then((response) => {
        this.setState((state) => ({ ...state, asset: response.data }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });

    this.shiftAllocationService
      .list(this.state.selectedFields.assetId, this.state.time)
      .then(({ data }) => {
        // console.log("Shift details fetched:", data);
        this.setState({
          shiftDetails: data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching shift details:", error);
        this.setState({
          loading: false,
        });
      });

    // console.log("Ending componentDidMount");
  }

  getShiftAllocationData2 = (assetId, time) => {
    this.setState((state) => ({ ...state, loading: true }));
    this.service
      .postShiftAllocation(assetId, dayjs(time))
      .then(({ data }) => {
        // console.log("demo", data);
        this.setState((state) => ({
          ...state,
          shiftAllocationData: data,
          shiftAllocationData2: data.filter((e) => e.active === true),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });
  };
  onFinish = (values) => {
    // console.log("val", values);
    this.setState((state) => ({ ...state, loading: true }));
    this.shiftAllocationService
      .getCalenderView(values.asset, dayjs(values.time))
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          selectedAssetId: values.asset,
          loading: true,
          shiftAllocationData: data,
          shiftAllocationData2: data.filter((e) => e.active === true),
          assetId: values.asset,
          time: values.time,
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });
  };
  onFinish2 = (active, id) => {
    // console.log("active", active, id);
    this.setState((state) => ({ ...state, loading: true }));
    this.service
      .update({ active: active, assetId: this.state.assetId }, id)
      .then(({ data }) => {
        // console.log("data", data);
        if (data.success) {
          this.getShiftAllocationData2(this.state.assetId, this.state.time);
        } else {
          message.error(data.message);
        }
      })
      .finally(() => {
        this.setState((state) => ({ ...state, loading: false }));
      });
  };

  popupOpen = () => {
    this.setState((state) => ({ ...state, modalOpen: true }));
  };

  closeModal = () => {
    this.setState((state) => ({ ...state, modalOpen: false }));
  };

  closeMainModal = () => {
    this.setState((state) => ({ ...state, mainModalOpen: false }));
  };

  onSearchAsset = (value) => {
    const filteredAssetList = this.state.assetList.filter((asset) =>
      asset.label.toLowerCase().includes(value.toLowerCase())
    );
    this.setState({ filteredAssetList, assetSearchValue: value });
  };

  onOk = () => {
    this.setState({ mainModalOpen: true });
    this.closeModal();
  };

  handlePopover = () => {
    this.setState({ popoverOpen: false });
  };

  reset = () => {
    this.list({ value: [] });
    this.props.form.resetFields();
    this.setState({
      filteredAssetList: [],

      assetSearchValue: "",
    });
  };

  submitForm = (value) => {
    this.list(value);
  };

  showDrawer = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  EventComponent = ({ event }) => {
    const shiftDetail = this.state.shiftDetails.find(
      (detail) => detail.shiftAllocationId === event.id
    );

    const formattedStartTime = moment(event.start).format("HH:mm");
    const formattedEndTime = moment(event.end).format("HH:mm");
    const formattedStartDate = moment(event.start).format("YYYY-MM-DD");
    const formattedEndDate = moment(event.end).format("YYYY-MM-DD");

    return (
      <div>
        <h3 style={{ fontWeight: "normal" }}>{event.title}</h3>
        <p style={{ fontWeight: "normal" }}>
          {formattedStartTime} - {formattedEndTime} ({formattedStartDate} to{" "}
          {formattedEndDate})
        </p>
      </div>
    );
  };

  handleData(data) {
    const { selectedAssetId } = this.state;

    const filteredShifts = data.filter(
      (shift) => shift.assetId === selectedAssetId
    );
    // console.log("Filtered shift details:", filteredShifts);

    const shiftColors = {};

    const events = filteredShifts.map((e) => {
      const start = moment(e.startDate); // Use e.startDate here
      const end = moment(e.endDate);

      if (!shiftColors[e.shiftName]) {
        // Generate a unique color for each shiftName
        shiftColors[e.shiftName] = `#${Math.floor(
          Math.random() * 16777215
        ).toString(16)}`;
      }

      const formattedStartTime = start.format("HH:mm");
      const formattedEndTime = end.format("HH:mm");

      const eventTitle = `${e.shiftName} (${formattedStartTime} - ${formattedEndTime})`;

      const eventBreaks = e.shiftBreakDetails.map((breakDetail) => {
        return {
          startTime: moment(breakDetail.startTime),
          endTime: moment(breakDetail.endTime),
          description: breakDetail.description,
        };
      });

      return {
        id: e.shiftAllocationId,
        title: eventTitle,
        start: start.toDate(),
        end: end.toDate(),
        backgroundColor: shiftColors[e.shiftName], // Use the unique color for each shiftName
        breaks: eventBreaks,
      };
    });

    return events;
  }

  handleNavigate = (action) => {
    const { date } = this.state;
    let newDate = date;
    switch (action) {
      case "TODAY":
        newDate = new Date();
        break;
      case "PREV":
        newDate = moment(date).subtract(1, "months").toDate();
        break;
      case "NEXT":
        newDate = moment(date).add(1, "months").toDate();
        break;
      default:
        break;
    }
    this.setState({ date: newDate });
  };

  handleView = (view) => {
    this.setState({ view });
  };
  render() {
    const Toolbar = ({
      label,
      onNavigate,
      onView,
      view,
      views,
      date,
      assetList,
      shiftDetails,
      loading,
    }) => (
      <Row justify="space-between" style={{ marginBottom: "10px" }} align="">
        <Col>
          <Space>
            <Button
              type="text"
              icon={<CalendarOutlined />}
              onClick={() => onNavigate("TODAY")}
            >
              Today
            </Button>
            <Button
              type="text"
              icon={<LeftOutlined />}
              shape="circle"
              onClick={() => onNavigate("PREV")}
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              shape="circle"
              onClick={() => onNavigate("NEXT")}
            />
            <Typography.Text strong>{label}</Typography.Text>
          </Space>
        </Col>
        <Col>
          <Radio.Group
            buttonStyle="solid"
            value={view}
            onChange={(e) => onView(e.target.value)}
            optionType="button"
            // str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
            options={views?.map((e) => ({
              label: e?.charAt(0).toUpperCase() + e?.slice(1).toLowerCase(),
              value: e,
            }))}
          />
        </Col>
      </Row>
    );

    const eventStyleGetter = (event, start, end, isSelected) => {
      var backgroundColor = event.backgroundColor;
      var style = {
        backgroundColor: backgroundColor,
        borderRadius: "5px",
        fontSize: "12px",
        padding: "5px",
        color: event.color,
        border: "0px",
        display: "block",
      };
      return {
        style: style,
      };
    };
    return (
      <Page
        title="Shift Allocation Calender"
        filter={
          <Form
            form={this.props.form}
            layout="inline"
            onFinish={this.submitForm}
          ></Form>
        }
      >
        <Form onFinish={this.onFinish}>
          <Row gutter={10}>
            <Col sm={4}>
              <Form.Item name="asset">
                <Select placeholder="Asset">
                  {this.state.asset?.map((e) => (
                    <Option key={`asset${e.assetId}`} value={e.assetId}>
                      {e.assetName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Calendar
          showAllEvents={false}
          showMultiDayTimes={true}
          localizer={localizer}
          //events={this.state.rows}
          events={this.handleData(this.state.shiftDetails)}
          startAccessor="start"
          endAccessor="end"
          style={{ minHeight: 850 }}
          components={{
            toolbar: Toolbar,
            event: this.EventComponent,
          }}
          // disabledDate={(current) => {
          //   return current && current < moment().add(0, "days");
          // }}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          selectable={true}
          eventPropGetter={eventStyleGetter}
          doShowMoreDrillDown={true}
          drilldownView="week"
          views={["month", "week"]}
          // views={["month", "week"].map((view) => view.toLowerCase())}
          onNavigate={(date, view, nav) => {
            console.log(moment(date).weekday());
            console.log(date, view, nav);
          }}
        />
      </Page>
    );
  }
}

export default withRouter(withAuthorization(ShiftAllocationcalender));
