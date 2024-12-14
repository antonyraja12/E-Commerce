// import { Tabs } from "antd";
// import { useEffect, useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import UserAccessService from "../../../services/user-access-service";
// import {
//   appHierarchyPageId,
//   assetPageId,
//   checklistPageId,
//   rolePageId,
//   smsConfigurationId,
//   userPageId,
//   useraccessPageId,
// } from "../../../helpers/page-ids";

// function Configuration() {
//   const [menu, setMenu] = useState([]);
//   useEffect(() => {
//     const userAccessService = new UserAccessService();
//     userAccessService.authorization().then(({ data }) => {
//       setMenu(data);
//     });
//   }, []);
//   const checkIfExist = (pageId) => {
//     let i = menu.findIndex((e) => e.pageId === pageId);
//     return i !== -1;
//   };

//   return (
//     <>
//       <div className="tab">
//         <div className="tab-link">
//           {/* <NavLink to="check-type">Check Type</NavLink>
//           <NavLink to="check">Checks</NavLink> */}

//           {(checkIfExist(rolePageId) ||
//             checkIfExist(userPageId) ||
//             checkIfExist(smsConfigurationId) ||
//             checkIfExist(useraccessPageId)) && (
//             <NavLink to="general">General</NavLink>
//           )}

//           {(checkIfExist(appHierarchyPageId) ) && (
//             <NavLink to="app-hierarchy"> Hierarchy</NavLink>
//           )}
//           {checkIfExist(assetPageId) && <NavLink to="asset">Asset</NavLink>}
//           {checkIfExist(checklistPageId) && (
//             <NavLink to="checklist">Check List</NavLink>
//           )}
//         </div>
//         <div className="tab-body" style={{ paddingTop: "5px" }}>
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Configuration;

// import { useEffect, useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import UserAccessService from "../../../services/user-access-service";
// import {
//   appHierarchyPageId,
//   rolePageId,
//   userPageId,
//   smsandmailConfigurationId,
//   useraccessPageId,
//   assetPageId,
//   checklistPageId
// } from "../../../helpers/page-ids";
// import { Tabs } from "antd";

// function Configuration() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     const userAccessService = new UserAccessService();
//     userAccessService.authorization().then(({ data }) => {
//       setMenu(data);
//     });
//   }, []);

//   const checkIfExist = (pageId) => {
//     let i = menu.findIndex((e) => e.pageId === pageId);
//     return i !== -1;
//   };

//   return (
//     <Tabs type="card">
//       {/* Master Tab */}
//       {(checkIfExist(rolePageId) || checkIfExist(userPageId) || checkIfExist(smsandmailConfigurationId) || checkIfExist(useraccessPageId) || checkIfExist(appHierarchyPageId)) ? (
//         <Tabs.TabPane tab={<span style={{ color: 'black', textDecoration: 'none' }}>Master</span>} key="master">
//           <Tabs type="card" tabPosition="left" style={{ color: 'black', textDecoration: 'none' }} defaultActiveKey="general">
//             {/* General Tab */}
//             {(checkIfExist(rolePageId) || checkIfExist(userPageId) || checkIfExist(smsandmailConfigurationId) || checkIfExist(useraccessPageId)) ? (
//               <Tabs.TabPane tab={<NavLink style={{ color: 'black', textDecoration: 'none' }} to="general">General</NavLink>} key="general">
//                 <div className="tab-body">
//                   <Outlet />
//                 </div>
//               </Tabs.TabPane>
//             ) : null}

//             {checkIfExist(appHierarchyPageId) ? (
//               <Tabs.TabPane tab={<NavLink to="app-hierarchy" style={{ color: 'black', textDecoration: 'none' }}>Hierarchy</NavLink>} key="hierarchy">
//                 <div className="tab-body">
//                   <Outlet />
//                 </div>
//               </Tabs.TabPane>
//             ) : null}
//           </Tabs>
//         </Tabs.TabPane>
//       ) : null}

//       {checkIfExist(assetPageId) ? (
//         <Tabs.TabPane tab={<NavLink to="asset" style={{ color: 'black', textDecoration: 'none' }}>Asset</NavLink>} key="asset">
//           <div className="tab-body">
//             <Outlet />
//           </div>
//         </Tabs.TabPane>
//       ) : null}

//       {checkIfExist(checklistPageId) ? (
//         <Tabs.TabPane tab={<NavLink to="checklist" style={{ color: 'black', textDecoration: 'none' }}>Checklist</NavLink>} key="checklist">
//           <div className="tab-body">
//             <Outlet />
//           </div>
//         </Tabs.TabPane>
//       ) : null}
//     </Tabs>
//   );
// }

// export default Configuration;

// import { useEffect, useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import UserAccessService from "../../../services/user-access-service";
// import {
//   appHierarchyPageId,
//   rolePageId,
//   userPageId,
//   smsandmailConfigurationId,
//   useraccessPageId,
//   assetPageId,
//   checklistPageId,
// } from "../../../helpers/page-ids";
// import { Tabs } from "antd";

// function Configuration() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     const userAccessService = new UserAccessService();
//     userAccessService.authorization().then(({ data }) => {
//       setMenu(data);
//     });
//   }, []);

//   const checkIfExist = (pageId) => {
//     let i = menu.findIndex((e) => e.pageId === pageId);
//     return i !== -1;
//   };

//   return (
//     <Tabs type="card">
//       {checkIfExist(rolePageId) ||
//       checkIfExist(userPageId) ||
//       checkIfExist(smsandmailConfigurationId) ||
//       checkIfExist(useraccessPageId) ||
//       checkIfExist(appHierarchyPageId) ? (
//         <Tabs.TabPane
//           tab={
//             <NavLink
//               to="general"
//               style={{ color: "black", textDecoration: "none" }}
//             >
//               Master
//             </NavLink>
//           }
//           key="master"
//         >
//           <Tabs
//             type="card"
//             tabPosition="left"
//             style={{ color: "black", textDecoration: "none" }}
//             defaultActiveKey="general"
//           >
//             {checkIfExist(rolePageId) ||
//             checkIfExist(userPageId) ||
//             checkIfExist(smsandmailConfigurationId) ||
//             checkIfExist(useraccessPageId) ? (
//               <Tabs.TabPane
//                 tab={
//                   <NavLink
//                     style={{ color: "black", textDecoration: "none" }}
//                     to="general"
//                   >
//                     General
//                   </NavLink>
//                 }
//                 key="general"
//               >
//                 <div className="tab-body">
//                   <Outlet />
//                 </div>
//               </Tabs.TabPane>
//             ) : null}

//             {checkIfExist(appHierarchyPageId) ? (
//               <Tabs.TabPane
//                 tab={
//                   <NavLink
//                     to="app-hierarchy"
//                     style={{ color: "black", textDecoration: "none" }}
//                   >
//                     Hierarchy
//                   </NavLink>
//                 }
//                 key="hierarchy"
//               >
//                 <div className="tab-body">
//                   <Outlet />
//                 </div>
//               </Tabs.TabPane>
//             ) : null}
//           </Tabs>
//         </Tabs.TabPane>
//       ) : null}

//       {checkIfExist(assetPageId) ? (
//         <Tabs.TabPane
//           tab={
//             <NavLink
//               to="asset"
//               style={{ color: "black", textDecoration: "none" }}
//             >
//               Asset
//             </NavLink>
//           }
//           key="asset"
//         >
//           <div className="tab-body">
//             <Outlet />
//           </div>
//         </Tabs.TabPane>
//       ) : null}

//       {checkIfExist(checklistPageId) ? (
//         <Tabs.TabPane
//           tab={
//             <NavLink
//               to="checklist"
//               style={{ color: "black", textDecoration: "none" }}
//             >
//               Checklist
//             </NavLink>
//           }
//           key="checklist"
//         >
//           <div className="tab-body">
//             <Outlet />
//           </div>
//         </Tabs.TabPane>
//       ) : null}
//     </Tabs>
//   );
// }

// export default Configuration;
