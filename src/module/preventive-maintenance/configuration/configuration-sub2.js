import { Col, Row } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import UserAccessService from "../../../services/user-access-service";
import {
    userPageId,
    rolePageId,
    appHierarchyPageId,
    smsandmailConfigurationId,
  useraccessPageId,
} from "../../../helpers/page-ids";
import { useState, useEffect } from "react";
export default function ConfigurationSub2() {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    const userAccessService = new UserAccessService();
    userAccessService.authorization().then(({ data }) => {
      setMenu(data);
    });
  }, []);
  const checkIfExist = (pageId) => {
    let i = menu.findIndex((e) => e.pageId === pageId);
    return i !== -1;
  };
  return (
    <>
      <div className="tab tab-h">
        <div className="tab-link">
       
          {(checkIfExist(appHierarchyPageId) &&checkIfExist(rolePageId) ||
            checkIfExist(userPageId) ||
            checkIfExist(smsandmailConfigurationId) ||
            checkIfExist(useraccessPageId)) (
              <NavLink to="general">General</NavLink>
          )}
          {/* {( && (
           
          )} */}
        </div>
        <div className="tab-body">
          <Outlet />
        </div>
      </div>
    </>
  );
}
