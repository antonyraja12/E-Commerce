import { RetweetOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Row, Spin, Timeline } from "antd";
import React from "react";
import WorkOrderTimelineService from "../../../services/preventive-maintenance-services/workorder-timeline-service";
import PageList from "../../../utils/page/page-list";
import Popups from "../../../utils/page/popups";
class TimelineList extends PageList {
  state = {
    timelineData: [],
  };
  service = new WorkOrderTimelineService();
  closePopup = () => {
    this.setState((state) => ({ ...state, timelineData: [] }));
    this.props.close();
  };
  componentDidMount() {
    this.setState((state) => ({ ...state, isLoading: false }));

    this.service
      .list({ resolutionWorkOrderId: this.props.id })
      .then((response) => {
        const items = response.data?.map((item) => {
          const { color, label, children, dot } = this.getStatusLabel(item);
          return {
            color,
            label,
            dot,
            children: (
              <>
                {children}{" "}
                {item.status !== 6 && (
                  <p style={{ color: "#50727B" }}>
                    {new Date(item.createdOn).toLocaleString()}
                  </p>
                )}
              </>
            ),
          };
        });

        this.setState((state) => ({
          ...state,
          timelineData: items,
          isLoading: false,
        }));
      });
  }
  getStatusLabel = (item) => {
    switch (item.status) {
      case 0:
        return { color: "#2196F3", children: "Opened", label: " " };
      case 1:
        return {
          color: "#87D068",
          label: item.user?.userName,
          children: "Assigned",
        };
      case 2:
        return {
          color: "#800080",
          label: item.user?.userName,
          children: "Resolved",
        };
      case 4:
        return {
          color: "#FFA500",
          label: item.user?.userName,
          children: `Rejected (${item.rejectedReason})`,
        };
      case 5:
        return {
          color: "#008000",
          dot: <SmileOutlined />,
          label: item.user?.userName,
          children: "Completed",
        };
      case 6:
        return {
          color: "#00CCFF",
          dot: <RetweetOutlined />,
          label: item.user?.userName,
          children: "Reopen",
        };
      default:
        return null;
    }
  };
  render() {
    return (
      <>
        <Popups
          title={this.props?.title}
          open={this.props?.open}
          onCancel={this.closePopup}
          footer={[
            <Row justify="space-between">
              <Col>
                {(this.props.mode == "Add" || this.props.mode == "Update") && (
                  <Button key="close" onClick={this.closePopup}>
                    Cancel
                  </Button>
                )}
              </Col>
            </Row>,
          ]}
        >
          <Spin spinning={!!this.state.isLoading}>
            {this.state.timelineData.length > 0 ? (
              <div
                style={{
                  paddingTop: "20px",
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              >
                <Timeline mode="right" items={this.state.timelineData} />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Spin>
        </Popups>
      </>
    );
  }
}

export default TimelineList;
