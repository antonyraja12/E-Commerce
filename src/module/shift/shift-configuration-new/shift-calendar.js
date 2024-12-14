import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card, Col, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import AssetService from "../../../services/asset-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";

moment.updateLocale("en", {
  week: {
    dow: 1, // Sunday is the start of the week
  },
});
const localizer = momentLocalizer(moment);
function ShiftCalendar() {
  const [loading, setLoading] = useState(false);
  const [assetId, setAssetId] = useState(null);
  const [startDate, setStartDate] = useState(moment().startOf("W"));
  const [endDate, setEndDate] = useState(moment().endOf("W"));
  const [event, setEvent] = useState([]);
  const [assetOptions, setAssetOptions] = useState({
    options: [],
    loading: false,
  });
  useEffect(() => {
    fetchData({ assetId, startDate, endDate });
  }, [assetId, startDate, endDate]);
  const fetchData = ({ assetId, startDate, endDate }) => {
    setLoading(true);
    const service = new ShiftAllocationService();
    service
      .list({
        assetId,
        startDate: moment(startDate).toISOString(),
        endDate: moment(endDate).toISOString(),
      })
      .then(({ data }) => {
        const ids = Array.from(new Set(data.map((e) => e.assetId)));
        let color = {};
        for (let index in ids) {
          let i = index;
          if (i > 3) {
            i = index % 4;
          }

          switch (i.toString()) {
            case "0":
              color[ids[index]] = {
                backgroundColor: "#add8e687",
                borderColor: "#add8e6",
              };
              break;
            case "1":
              color[ids[index]] = {
                backgroundColor: "#ff98005e",
                borderColor: "#FF9800",
              };
              break;
            case "2":
              color[ids[index]] = {
                backgroundColor: "#8bc34a78",
                borderColor: "#8bc34a",
              };
              break;
            case "3":
              color[ids[index]] = {
                backgroundColor: "#e91e6370",
                borderColor: "#e91e63",
              };
              break;
            default:
              color[ids[index]] = {
                backgroundColor: "#9c27b054",
                borderColor: "#9c27b0",
              };
              break;
          }
        }

        setEvent(
          data.map((e) => ({
            title: e.asset?.assetName + " - " + e.shiftName,
            start: new Date(moment(e.startDate)),
            end: new Date(moment(e.endDate)),
            backgroundColor: color[e.assetId]?.backgroundColor,
            borderColor: color[e.assetId]?.borderColor,
            assetId: e.assetId,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const eventPropGetter = (event) => {
    let backgroundColor = event.backgroundColor || "lightgray";
    let borderColor = event.borderColor || "lightgray";

    return {
      style: {
        color: "#000000",
        backgroundColor,
        borderColor,
      },
    };
  };
  // useEffect(() => {
  //   setAssetOptions((state) => ({ ...state, loading: true }));
  //   const service = new AssetService();
  //   service
  //     .list({ active: true })
  //     .then(({ data }) => {
  //       let options = data.map((e) => ({
  //         value: e.assetId,
  //         label: e.assetName,
  //       }));
  //       setAssetOptions((state) => ({ ...state, options: options }));
  //     })
  //     .finally(() => {
  //       setAssetOptions((state) => ({ ...state, loading: false }));
  //     });
  // }, []);
  const handleSelectEvent = (event) => {
    console.log(event);
  };
  const onNavigate = (newDate, view, action) => {
    let start = moment(newDate).startOf("W");
    let end = moment(newDate).endOf("W");
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <Card title="Shift Calendar">
      <Row gutter={[10, 10]}>
        {/* <Col md={4}>
          <Select
            mode="tags"
            onChange={(val) => {
              setAssetId(val);
            }}
            {...assetOptions}
            style={{ width: "100%" }}
          />
        </Col> */}
        <Col span={24}>
          <Spin spinning={loading}>
            <Calendar
              localizer={localizer}
              events={event}
              startAccessor="start"
              endAccessor="end"
              // style={{ height: 500 }}
              view="week"
              views={["week"]}
              eventPropGetter={eventPropGetter}
              onNavigate={onNavigate}
              onSelectEvent={handleSelectEvent}
            />
          </Spin>
        </Col>
      </Row>
    </Card>
  );
}

export default ShiftCalendar;
