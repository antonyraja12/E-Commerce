import { Card, Col, DatePicker, Flex, Row, Select, Space, Tooltip } from "antd";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import NotificationService from "./service/notification-service";

function NotificationList(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");

  const { toggleModal } = props;
  const service = new NotificationService();
  const list = useSelector((state) => state.notificationReducer.list);
  const dispatch = useDispatch(); // Add this line to access dispatch

  console.log(
    list.map((e) => e.opened),
    "list",
    list
  );
  const [dateDetails, setDateDetails] = useState({
    startDate: "",
    endDate: "",
    type: "",
    status: true,
  });
  const [data, setData] = useState({
    notificationId: 0,
    type: "",
    message: null,
    description: "",
    title: "",
    priority: 0,
    path: "",
    opened: "",
    userId: 0,
    timestamp: "",
  });
  const [loadedItems, setLoadedItems] = useState(10); // Number of initially loaded items
  const [readStatus, setReadStatus] = useState("All");
  const [cardStatus, setCardStatus] = useState(null);

  const containerRef = useRef(null);

  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");

  const handleModalCardClick = (type) => {
    setSelectedTypeFilter(type); // Update selectedTypeFilter
    typeHandleChange(type); // Update the type filter
  };

  const setCardValue = (data) => {
    console.log(data, "dattt");
    setData(data);
    setCardStatus(data.notificationId);
    const updatedList = list.map((item) => {
      if (item.notificationId === data.notificationId) {
        return { ...item, opened: false };
      }
      return item;
    });
    dispatch({ type: "NOTIFICATION_LIST_", data: updatedList });

    service
      .updateStatus(data.notificationId, false)
      .then((response) => {
        console.log("Notification status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating notification status:", error);
      });
  };

  const startOnChange = (date, dateString) => {
    setDateDetails({ ...dateDetails, startDate: dateString });
    resetCard();
  };

  const endOnChange = (date, dateString) => {
    setDateDetails({ ...dateDetails, endDate: dateString });
    resetCard();
  };

  const massageStatusHandleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const typeHandleChange = (value) => {
    setDateDetails({ ...dateDetails, type: value });
    console.log(value, "value");
    setSelectedTypeFilter(value); // Update selectedTypeFilter
    resetCard();
  };

  // ..
  const statusHandleChange = (value) => {
    setDateDetails({ ...dateDetails, status: value });
  };
  const handleReadStatusChange = (value) => {
    setReadStatus(value);
    resetCard();
  };
  const removeDuplicates = (array, key) => {
    return array.filter(
      (item, index, self) =>
        self.findIndex((t) => t[key] === item[key]) === index
    );
  };

  const loadMoreItems = useCallback(() => {
    setLoadedItems((prev) => prev + 10); // Increase the number of loaded items
  }, []);

  const options =
    list.length === 0
      ? [{ label: "All", value: "All" }]
      : [
          { label: "All", value: "All" },
          ...removeDuplicates(list, "type").map(({ type }) => ({
            label: type,
            value: type,
          })),
        ];

  // Attach scroll event listener to the container
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMoreItems();
    }
  };
  console.log(list, "list");
  const filteredList = list.filter((item) => {
    const startDateValid =
      dateDetails.startDate && moment(dateDetails.startDate).isValid();
    const endDateValid =
      dateDetails.endDate && moment(dateDetails.endDate).isValid();
    const typeValid = dateDetails.type !== "All"; // Check if a type is selected
    let startDate = startDateValid ? moment(dateDetails.startDate) : null;
    let endDate = endDateValid ? moment(dateDetails.endDate) : moment();
    if (startDate && endDate && startDate.isSame(endDate, "day")) {
      // If start date and end date are the same, include all data for that date
      return (
        moment(item.timestamp).isSame(startDate, "day") &&
        (!typeValid || item.type === dateDetails.type) // Include type condition
      );
    } else if (startDate && endDate) {
      // Adjust the end date by adding 24 hours
      endDate = endDate.add(1, "day");
      return (
        moment(item.timestamp).isBetween(startDate, endDate) &&
        (!typeValid || item.type === dateDetails.type) // Include type condition
      );
    } else if (startDate) {
      // Return true if the item's timestamp is after or equal to the start date
      return (
        moment(item.timestamp).isSameOrAfter(startDate) &&
        (!typeValid || item.type === dateDetails.type) // Include type condition
      );
    } else if (endDate) {
      // Adjust the end date by adding 24 hours
      endDate = endDate.add(1, "day");
      // Return true if the item's timestamp is before or equal to the end date
      return (
        moment(item.timestamp).isSameOrBefore(endDate) &&
        (!typeValid || item.type === dateDetails.type) // Include type condition
      );
    } else {
      return true; // Include all data if both start and end dates are empty
    }
  });
  console.log(filteredList, "flist");

  const filteredByReadStatus = filteredList.filter((item) => {
    if (readStatus === "All") return true;
    if (readStatus === "read") return !item.opened;
    if (readStatus === "unRead") return item.opened;
  });

  const resetCard = () => {
    setData({
      notificationId: 0,
      type: "All",
      message: null,
      description: "",
      title: "",
      priority: 0,
      path: "",
      opened: "",
      userId: 0,
      timestamp: "",
    });
    setCardStatus(null);
  };
  return (
    <>
      {console.log(type, "type")}

      {
        <div style={{ padding: "1rem" }}>
          <Space direction="horizontal">
            <label>From:</label>
            <DatePicker onChange={startOnChange} />
            <label>To:</label>
            <DatePicker onChange={endOnChange} />
            <label>Type:</label>
            <Select
              defaultValue="All"
              value={selectedTypeFilter}
              onChange={typeHandleChange}
              style={{
                width: 150,
              }}
              options={options}
            />
            <label>Status:</label>
            <Select
              defaultValue="All"
              onChange={handleReadStatusChange}
              style={{
                width: 150,
              }}
              options={[
                {
                  value: "All",
                  label: "All",
                },
                {
                  value: "read",
                  label: "Read",
                },

                {
                  value: "unRead",
                  label: "Unread",
                },
              ]}
            />
          </Space>
          <br />
          <br />
          <Row>
            <Col xs={12} sm={8} md={8} lg={6}>
              <div
                style={{ height: "80vh", overflowY: "scroll" }}
                ref={containerRef}
                onScroll={handleScroll}
              >
                {filteredByReadStatus.slice(0, loadedItems).map((d) => {
                  return (
                    <Card
                      key={d.notificationId}
                      style={{
                        borderRadius: "0px",
                        backgroundColor: d.opened ? "white" : "#F5F5F5",
                      }}
                      onClick={() => {
                        setCardValue(d);
                      }}
                      className={
                        data.notificationId === d.notificationId
                          ? "in-app-notification-message-card in-app-notification-message-card-active"
                          : "in-app-notification-message-card"
                      }
                    >
                      <span>
                        {d.opened ? (
                          <FaCircle
                            style={{
                              position: "absolute",
                              top: "42px",
                              right: "15px",
                              color: "blue",
                            }}
                          />
                        ) : (
                          " "
                        )}
                      </span>

                      <br />
                      <span style={{ color: "blue", fontWeight: "700" }}>
                        {d.title}
                      </span>

                      <br />
                      <span>{d.type}</span>
                      <br />
                      <span>{d.description}</span>
                      <br />
                      <br />

                      <Row>
                        <Col span={12}>
                          <span>
                            {moment(d.timestamp).format("DD-MM-YYYY")}
                          </span>
                        </Col>
                        <Col span={12}>
                          <Flex justify="end">
                            {moment(d.timestamp).format("hh:mm:ss A")}
                          </Flex>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </div>
            </Col>
            <Col xs={12} sm={16} md={16} lg={18}>
              {data.notificationId !== 0 && (
                <Card
                  title={data?.type}
                  extra={moment(data?.timestamp).format(
                    "DD-MM-YYYY hh:mm:ss A"
                  )}
                >
                  <Flex justify="end">
                    <Link to={`${data?.path}`}>
                      <Tooltip title="View">View</Tooltip>
                    </Link>
                  </Flex>
                  {data?.description}
                  {data?.message}
                </Card>
              )}
            </Col>
          </Row>
          <br />
        </div>
      }
    </>
  );
}

export default NotificationList;
