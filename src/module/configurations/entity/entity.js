import { NavLink } from "react-router-dom";

import { Result, Spin, Tabs } from "antd";
import AppHierarchy from "../app-hierarchy/app-hierarchy";
import Location from "../location/location";
import LogoUpload from "../logo/logo";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import { useState, useEffect } from "react";

function Entity(props) {
  console.log("prop", props);
  const { access, isLoading } = props;
  // console.log("access", access[0].length);

  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Tabs type="card" defaultActiveKey="entity">
        <Tabs.TabPane
          tab={
            <NavLink
              // to="location"
              style={{ color: "black", textDecoration: "none" }}
            >
              Location
            </NavLink>
          }
          key="location"
        >
          <div className="tab-body">
            <Location />
            {/* <Outlet /> */}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <NavLink
              // to="entity"
              style={{ color: "black", textDecoration: "none" }}
            >
              Entity
            </NavLink>
          }
          key="entity"
        >
          <div className="tab-body">
            <AppHierarchy />
            {/* <Outlet /> */}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Spin>
  );
}

export default withRouter(withAuthorization(Entity));
