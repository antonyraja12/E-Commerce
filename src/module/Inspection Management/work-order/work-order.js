import { Card, Row, Tabs } from "antd";
import React from "react";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import CheckListExecution from "../checklistexecution/checklist-execution";
import ResolutionWorkOrder from "../resolution-work-order/resolution-work-order";
const style = {
  formItem: {
    minWidth: "120px",
  },
};

class WorkOrderList extends PageList {
  items = () => {
    return [
      {
        label: "Checklist",
        key: "1",
        url: "",
        children: (
          <Card>
            <CheckListExecution></CheckListExecution>
          </Card>
        ),
      },
      {
        label: "Tickets",
        key: "2",
        url: "../",
        children: (
          <Card>
            <ResolutionWorkOrder></ResolutionWorkOrder>
          </Card>
        ),
      },
    ];
  };

  render() {
    return (
      <Page title="Work Order Details">
        <Row justify="center" gutter={[10, 10]}>
          <Tabs
            defaultActiveKey="1"
            activeKey={this.state.activeKey}
            items={this.items()}
          ></Tabs>
        </Row>
      </Page>
    );
  }
}

export default WorkOrderList;
