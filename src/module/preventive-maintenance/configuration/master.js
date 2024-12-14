import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  appHierarchyPageId,
  rolePageId,
  smsandmailConfigurationId,
  userPageId,
  useraccessPageId,
} from "../../../helpers/page-ids";
import UserAccessService from "../../../services/user-access-service";

function Master() {
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
      <div className="tab-link">
        {(checkIfExist(rolePageId) ||
          checkIfExist(userPageId) ||
          checkIfExist(smsandmailConfigurationId) ||
          checkIfExist(useraccessPageId)) && (
          <NavLink to="general">General</NavLink>
        )}

        {checkIfExist(appHierarchyPageId) && (
          <NavLink to="app-hierarchy"> Hierarchy</NavLink>
        )}
      </div>
      <div className="tab-body" style={{ paddingTop: "5px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Master;
