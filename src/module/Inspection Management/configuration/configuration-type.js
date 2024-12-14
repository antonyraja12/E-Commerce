import { NavLink } from "react-router-dom";

import { Result, Spin, Tabs } from "antd";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import Priority from "./priority/priority";
import MaintenanceType from "./type-configuration/maintenanceType";

function TypeConfiguration(props) {
  const { access, isLoading } = props;

  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  if (!access[0] || access[0].length === 0) {
    return (
      <Result
        status={"403"}
        title="403"
        subTitle="Sorry You are not authorized to access this page"
      />
    );
  }

  return (
    <Spin spinning={isLoading}>
      <Tabs type="card" defaultActiveKey="entity">
        <Tabs.TabPane
          tab={
            <NavLink style={{ color: "black", textDecoration: "none" }}>
              Priority
            </NavLink>
          }
          key="location"
        >
          <div className="tab-body">
            <Priority />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <NavLink style={{ color: "black", textDecoration: "none" }}>
              IssueType
            </NavLink>
          }
          key="entity"
        >
          <div className="tab-body">
            <MaintenanceType />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Spin>
  );
}

export default withRouter(withAuthorization(TypeConfiguration));
