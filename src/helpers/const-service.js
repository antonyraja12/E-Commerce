import { baseUrl, rootUrl, doc360Url, djcUrl } from "./url";

const _SETTINGS = baseUrl + process.env.REACT_APP_SETTING_API;
const _PM = baseUrl + process.env.REACT_APP_PM_API;
const _QI = baseUrl + process.env.REACT_APP_QI_API;
const _OEE = baseUrl + process.env.REACT_APP_OEE_API;
const _DD = baseUrl + process.env.REACT_APP_DD_API;
const _ENERGY = baseUrl + process.env.REACT_APP_ENERGY_API;

const _IM = baseUrl + process.env.REACT_APP_IM_API;
const _COMMUNICATION = baseUrl + process.env.REACT_APP_COMMUNICATION_API;
const _DOC360 = doc360Url;
const _DWI = baseUrl + process.env.REACT_APP_DWI_API;
const _DJC = baseUrl + process.env.REACT_APP_DJC_API;
const _TAT = baseUrl + process.env.REACT_APP_TAT_API;

const buildApiUrl = (base, ...urls) => {
  return base + "/api/" + urls.join("/");
};

export const LOGIN = buildApiUrl(_SETTINGS, "sign-in");
export const LOGOUT = buildApiUrl(_SETTINGS, "sign-out");
export const CURRENT_USER = buildApiUrl(_SETTINGS, "user", "current-user");
//APP HIERARCHY SERVICE
export const APP_HIERARCHY = buildApiUrl(_SETTINGS, "app-hierarchy");
export const APP_HIERARCHY_STRUCTURE = buildApiUrl(
  _SETTINGS,
  "app-hierarchy-structure"
);
export const INDUSTRIAL_TYPE = buildApiUrl(_SETTINGS, "industrial-type");
export const DYNAMIC_DASHBOARD_CONFIGURATION = buildApiUrl(
  _SETTINGS,
  "dynamic-dashboard-configuration"
);

//DYNAMIC DASHBOARD SERVICE
export const DYNAMIC_DASHBOARD = buildApiUrl(_DD, "dynamic-dashboard");
export const WIDGET_MASTER = buildApiUrl(_DD, "dynamic-dashboard-widget");
export const FILTER_MASTER = buildApiUrl(_DD, "dynamic-dashboard-filter");
//ENERGY SERVICE
export const ENERGY = buildApiUrl(_ENERGY, "energy");
export const ENERGY_CALC = buildApiUrl(_ENERGY, "energy/calc");
export const ENERGY_CALCULATION = buildApiUrl(_COMMUNICATION, "energy-calc");

//IM SERVICE
export const IM_CHECK = buildApiUrl(_IM, "im-check");
export const IM_CHECK_TYPE = buildApiUrl(_IM, "im-check-type");
export const IM_CHECKLIST = buildApiUrl(_IM, "im-check-list");
export const IM_RESOLUTION_WORK_ORDER_TIMELINE = buildApiUrl(
  _IM,
  "im-resolution-status-log"
);
export const IM_CHECKLIST_EXECUTION = buildApiUrl(
  _IM,
  "im-check-list-execution"
);
export const IM_CHECKLIST_EXECUTION_ASSIGN = buildApiUrl(
  _IM,
  "im-check-list-execution",
  "assignUser"
);
export const IM_CHECKLIST_EXECUTION_REPORT = buildApiUrl(
  _IM,
  "im-check-list-execution",
  "reports"
);
export const IM_DASHBOARD = buildApiUrl(_IM, "im-dashboard");
export const IM_CHECKLIST_EXECUTION_IMAGEUPLOAD = buildApiUrl(
  _IM,
  "im-check-list-execution"
);
export const IM_MAINTENANCE = buildApiUrl(_IM, "im-maintenance-type");
export const IM_RESOLUTION_WORK_ORDER = buildApiUrl(
  _IM,
  "im-resolution-work-order"
);
export const IM_PRIORITY = buildApiUrl(_IM, "im-priority");
export const IM_RESOLUTION_WORK_ORDER_REPORT = buildApiUrl(
  _IM,
  "im-resolution-work-order",
  "report"
);
export const IM_SCHEDULAR = buildApiUrl(_IM, "im-scheduler");
export const IM_WORK_FLOW = buildApiUrl(_IM, "im-work-flow");
export const IM_WORK_FLOW_HOME = buildApiUrl(_IM, "report", "over-all");
export const IM_RESOLUTION_WORK_ORDER_CONDUCT = buildApiUrl(
  _IM,
  "im-resolution-work-order",
  "conduct"
);
export const IM_RESOLUTION_WORK_ORDER_RESOLVE = buildApiUrl(
  _IM,
  "im-resolution-work-order",
  "resolve"
);
export const IM_RESOLUTION_WORK_ORDER_VERIFY = buildApiUrl(
  _IM,
  "im-resolution-work-order",
  "verify"
);

//OEE SERVICE
export const OEE_MACHINE_STATUS = buildApiUrl(_OEE, "machine-status");
export const OEE_AVAILABILITY = buildApiUrl(_OEE, "availability-calculation");
export const OEE_DOWNTIMEREASON = buildApiUrl(_OEE, `downtime-reason`);
export const OEE_DOWNTIME = buildApiUrl(_OEE, `downtime`);
export const OEE_CALCULATION = buildApiUrl(_OEE, `oee-calculation`);
export const OEE_MODEL_MASTER = buildApiUrl(_OEE, `model-master`);
export const OEE_MODEL_CONFIGURATION = buildApiUrl(_OEE, `model-configuration`);
export const OEE_MODEL_TARGETED_PART_COUNT = buildApiUrl(_OEE, `targeted-part`);
export const OEE_PERFORMANCE_CALCULATION = buildApiUrl(
  _OEE,
  `performance-calculation`
);
export const OEE_REPORT = buildApiUrl(_OEE, `oee-report`);
export const OEE_EXCEL = buildApiUrl(_OEE, `oee-excel`);
export const OEE_QUALITY_CONFIGURATION = buildApiUrl(
  _OEE,
  `quality-configuration`
);
export const OEE_QUALITY_REJECTION = buildApiUrl(_OEE, `quality-rejection`);
export const OEE_QUALITY_REJECTION_REASON = buildApiUrl(
  _OEE,
  `quality-Rejection-Reason`
);

//SHIFT SERVICE
export const SHIFT_ALLOCATION = buildApiUrl(_SETTINGS, "shift-allocation");
export const SHIFT_DETAIL_ASSETWISE = buildApiUrl(
  _SETTINGS,
  "shift-detail-assetwise"
);
export const SHIFT_MASTER_ASSETWISE = buildApiUrl(
  _SETTINGS,
  "shift-master-assetwise"
);
export const SHIFT_MASTER = buildApiUrl(_SETTINGS, "shift-master");

//PM SERVICE
export const PM_CHECK = buildApiUrl(_PM, "check");
export const PM_CHECK_TYPE = buildApiUrl(_PM, "check-type");
export const PM_CHECKLIST = buildApiUrl(_PM, "check-list");
export const PM_CHECKLIST_EXECUTION = buildApiUrl(_PM, "check-list-execution");
export const PM_CHECKLIST_EXECUTION_ASSIGN = buildApiUrl(
  _PM,
  "check-list-execution/assignUser"
);
export const PM_CHECKLIST_EXECUTION_REPORT = buildApiUrl(
  _PM,
  "check-list-execution/reports"
);
export const PM_DASHBOARD = buildApiUrl(_PM, "dashboard");
export const PM_LOCATION = buildApiUrl(_PM, "location");
export const PM_CHECKLIST_EXECUTION_IMAGEUPLOAD = buildApiUrl(
  _PM,
  "check-list-execution"
);
export const PM_MAINTENANCE = buildApiUrl(_PM, "pm-maintenance-type");
export const PM_MODULE_SELECTION = buildApiUrl(_PM, "module-selection");
export const PM_RESOLUTION_WORK_ORDER = buildApiUrl(
  _PM,
  "resolution-work-order"
);
export const PM_RESOLUTION_WORK_ORDER_TIMELINE = buildApiUrl(
  _PM,
  "pm-resolution-status-log"
);
export const PM_PRIORITY = buildApiUrl(_PM, "pm-priority");
export const PM_RESOLUTION_WORK_ORDER_REPORT = buildApiUrl(
  _PM,
  "resolution-work-order/report"
);
export const PM_RESOLUTION_WORK_ORDER_SHIFT_REPORT = buildApiUrl(
  _PM,
  "resolution-work-order/shift-report"
);
export const PM_SCHEDULAR = buildApiUrl(_PM, "scheduler");
export const PM_WORK_FLOW = buildApiUrl(_PM, "work-flow");
export const PM_WORK_FLOW_HOME = buildApiUrl(_PM, "report", "over-all");
export const PM_RESOLUTION_WORK_ORDER_CONDUCT = buildApiUrl(
  _PM,
  "resolution-work-order",
  "conduct"
);
export const PM_RESOLUTION_WORK_ORDER_RESOLVE = buildApiUrl(
  _PM,
  "resolution-work-order",
  "resolve"
);
export const PM_RESOLUTION_WORK_ORDER_VERIFY = buildApiUrl(
  _PM,
  "resolution-work-order",
  "verify"
);
export const PM_CHECK_ASSET_FILE_MAPPING = buildApiUrl(
  _PM,
  "pm-check-assets-file-mapping"
);
export const PM_TICKET_GENERATION = buildApiUrl(_PM, "ticket-generation-list");

//QI SERVICE
export const QI_CHECK = buildApiUrl(_QI, "qi-check");
export const QI_CHECK_TYPE = buildApiUrl(_QI, "qi-check-type");
export const QI_CHECKLIST = buildApiUrl(_QI, "qi-check-list");
export const QI_RESOLUTION_WORK_ORDER_TIMELINE = buildApiUrl(
  _QI,
  "qi-resolution-status-log"
);
export const QI_CHECKLIST_EXECUTION = buildApiUrl(
  _QI,
  "qi-check-list-execution"
);
export const QI_CHECKLIST_EXECUTION_ASSIGN = buildApiUrl(
  _QI,
  "qi-check-list-execution",
  "assignUser"
);
export const QI_CHECKLIST_EXECUTION_REPORT = buildApiUrl(
  _QI,
  "qi-check-list-execution",
  "reports"
);
export const QI_DASHBOARD = buildApiUrl(_QI, "qi-dashboard");
export const QI_CHECKLIST_EXECUTION_IMAGEUPLOAD = buildApiUrl(
  _QI,
  "qi-check-list-execution"
);
export const QI_MAINTENANCE = buildApiUrl(_QI, "qi-maintenance-type");
export const QI_RESOLUTION_WORK_ORDER = buildApiUrl(
  _QI,
  "qi-resolution-work-order"
);
export const QI_PRIORITY = buildApiUrl(_QI, "qi-priority");
export const QI_RESOLUTION_WORK_ORDER_REPORT = buildApiUrl(
  _QI,
  "qi-resolution-work-order",
  "report"
);
export const QI_SCHEDULAR = buildApiUrl(_QI, "qi-scheduler");
export const QI_WORK_FLOW = buildApiUrl(_QI, "qi-work-flow");
export const QI_WORK_FLOW_HOME = buildApiUrl(_QI, "report", "over-all");
export const QI_RESOLUTION_WORK_ORDER_CONDUCT = buildApiUrl(
  _QI,
  "qi-resolution-work-order",
  "conduct"
);
export const QI_RESOLUTION_WORK_ORDER_RESOLVE = buildApiUrl(
  _QI,
  "qi-resolution-work-order",
  "resolve"
);
export const QI_RESOLUTION_WORK_ORDER_VERIFY = buildApiUrl(
  _QI,
  "qi-resolution-work-order",
  "verify"
);

//INVENTORY SERVICE
export const SUGGESTION_CONFIGURATION = buildApiUrl(
  _PM,
  `suggestion-configuration`
);

export const INQUIRE = buildApiUrl(_PM, `inquire`);
export const SPARE_PART_TYPE = buildApiUrl(_PM, `spare-part-type`);
export const SPARE_DASHBOARD = buildApiUrl(_PM, `spare-dashboard`);
export const SUPPLIER = buildApiUrl(_PM, `supplier`);
export const PURCHASE_HISTORY = buildApiUrl(_PM, `purchase-request`);
export const SPARE_PART = buildApiUrl(_PM, `spare-part`);
export const SPARE_REQUEST = buildApiUrl(_PM, `spare-request`);
export const PRODUCT_FILE = buildApiUrl(_PM, `product-file`);
export const PRODUCT = buildApiUrl(_PM, `product`);
export const STOCK_JOURNAL = buildApiUrl(_PM, `stock-journal`);
export const DISPATCH = buildApiUrl(_PM, `dispatch`);

// DWI SERVICE
export const EXECUTION_LOG = buildApiUrl(_DWI, `execution-log`);
export const PAUSE_REASON = buildApiUrl(_DWI, `pause-reason`);
export const PROCESS_LIST = buildApiUrl(_DWI, `process`);
export const WI_EXECUTION = buildApiUrl(_DWI, `work-instruction-execution`);
export const TASK_CONFIG = buildApiUrl(_DWI, `task`);
export const WI_CONFIG = buildApiUrl(_DWI, `work-instruction`);
export const WI_EXCEL_UPLOAD = buildApiUrl(_DWI, `wi-upload`);

//CONFIGURATION SERVICE
export const CONFIGURATION_ACCESS_SETTING = buildApiUrl(
  _SETTINGS,
  `access-settings`
);
export const CONFIGURATION_ADD_WARRANTY = buildApiUrl(_SETTINGS, `warranty`);
export const CONFIGURATION_ALERTS = buildApiUrl(_SETTINGS, `alerts`);

export const CONFIGURATION_COMPONENT = buildApiUrl(_SETTINGS, `component`);
export const CONFIGURATION_ASSET_FAMILY = buildApiUrl(
  _SETTINGS,
  `asset-family`
);
export const CONFIGURATION_ASSET_LIBRARY_ALERT = buildApiUrl(
  _SETTINGS,
  `asset-library`
);
export const CONFIGURATION_ASSET_LIBRARY_PARAMETER = buildApiUrl(
  _SETTINGS,
  `asset-library`
);

export const CONFIGURATION_ASSET_LIBRARY = buildApiUrl(
  _COMMUNICATION,
  `asset-library`
);

//CBM SERVICE
export const CBM_PARAMETER_VALUE = buildApiUrl(
  _COMMUNICATION,
  "connect",
  "get-parameter-value"
);
export const CBM_ALERT_LOG = buildApiUrl(_COMMUNICATION, "alert-log");
export const CBM_PARAMETER_GRAPH = buildApiUrl(_COMMUNICATION, "thingworx");
export const ASSET_ENGINE = buildApiUrl(_COMMUNICATION, "asset-engine");
export const CONFIGURATION_ASSET = buildApiUrl(_COMMUNICATION, "asset");
// export const WEB_SOCKET_NOTIFICATION = buildApiUrl(
//   _SETTINGS,
//   "web-socket-notification"
// ); coco-cocal
export const WEB_SOCKET_NOTIFICATION = buildApiUrl(
  _COMMUNICATION,
  "web-socket-notification"
);

export const CONFIGURATION_ASSET_PARAMETER = buildApiUrl(
  _COMMUNICATION,
  "asset",
  "<id>",
  "parameter"
);
export const CONFIGURATION_ASSET_ALERT = buildApiUrl(
  _COMMUNICATION,
  "asset",
  "<id>",
  "alert"
);

export const CONFIGURATION_CAMERA = buildApiUrl(_SETTINGS, `camera`);
export const CONFIGURATION_CATEGORY = buildApiUrl(_SETTINGS, `category`);
export const CONFIGURATION_COLOR = buildApiUrl(_SETTINGS, `colorMaster`);
export const CONFIGURATION_CONTINENT = buildApiUrl(_SETTINGS, `continent`);
export const CONFIGURATION_COUNTRY = buildApiUrl(_SETTINGS, `country`);
export const USER_LIST = buildApiUrl(_SETTINGS, `userList`);
export const USER = buildApiUrl(_SETTINGS, `user`);
export const CONFIGURATION_USERLIST = buildApiUrl(
  _SETTINGS,
  `userList/current-user`
);
export const CONFIGURATION_FILTER = buildApiUrl(_SETTINGS, `filter`);
export const CONFIGURATION_FIRE_ALERT = buildApiUrl(_SETTINGS, `fire-alerts`);
export const CONFIGURATION_FLOOR = buildApiUrl(_SETTINGS, `floor`);
export const CONFIGURATION_GATEWAY_CONFIG = buildApiUrl(
  _SETTINGS,
  `mqtt-config`
);
export const CONFIGURATION_GATEWAY = buildApiUrl(_SETTINGS, `mqtt`);
export const CONFIGURATION_KEPWARE = buildApiUrl(_SETTINGS, `kepware`);
export const CONFIGURATION_LOCATION = buildApiUrl(_SETTINGS, `location`);
export const CONFIGURATION_LOGO = buildApiUrl(_SETTINGS, `system-settings`);
export const CONFIGURATION_EMAIL = buildApiUrl(_SETTINGS, `email`);
export const CONFIGURATION_ASSET_ICON = buildApiUrl(
  _SETTINGS,
  `asset/icon-count`
);
export const CONFIGURATION_MENULIST = buildApiUrl(
  _SETTINGS,
  `module-selection/menu-list`
);
export const CONFIGURATION_USER_ACCESS_MENULIST = buildApiUrl(
  _SETTINGS,
  `module-selection/user-access-menu-list`
);
export const CONFIGURATION_MENU = buildApiUrl(_SETTINGS, `menu`);
export const CONFIGURATION_MODULE_CONFIG = buildApiUrl(
  _SETTINGS,
  `module_config`
);
export const CONFIGURATION_MODULE = buildApiUrl(_SETTINGS, `module_details`);
export const CONFIGURATION_ORGANISATION = buildApiUrl(
  _SETTINGS,
  `organisation`
);
export const CONFIGURATION_PLANT = buildApiUrl(_SETTINGS, `customer`);
export const CONFIGURATION_ROLE = buildApiUrl(_SETTINGS, `role`);
export const CONFIGURATION_SERVICE_MANAGER = buildApiUrl(
  _SETTINGS,
  `service-manager`
);
export const CONFIGURATION_SMS = buildApiUrl(_SETTINGS, `sms`);
export const CONFIGURATION_STATE = buildApiUrl(_SETTINGS, `state`);
export const CONFIGURATION_SUBSCRIPTION_MANAGER = buildApiUrl(
  _SETTINGS,
  `subscription-manager`
);
export const CONFIGURATION_USER_GROUP = buildApiUrl(_SETTINGS, `user-groups`);
export const CONFIGURATION_USER_ACCESS = buildApiUrl(_SETTINGS, `user-access`);
export const CONFIGURATION_USER_ACCESS_FEATURE = buildApiUrl(
  _SETTINGS,
  `user-access-feature`
);
export const CONFIGURATION_USER_ACCESS_BULK_ADD = buildApiUrl(
  _SETTINGS,
  `user-access/bulk-add`
);
export const CONFIGURATION_UPLOAD = buildApiUrl(_SETTINGS, `upload`);
export const CONFIGURATION_INVENTORY_UPLOAD = buildApiUrl(_SETTINGS, `upload`);

//DOC360 SERVICE
export const DOC_360 = `${doc360Url}/v2`;
// export const DOC_360_ARTICLE = `${doc360Url}/v2/Articles`;

//DJC SERVICE
export const DJC_MATERIAL = buildApiUrl(_DJC, `djc/material`);
export const DJC_ROUTING = buildApiUrl(_DJC, `djc/routing_master`);
export const DJC_PRODUCTION = buildApiUrl(_DJC, `djc/production_master`);
export const DJC_OPERATOR = buildApiUrl(_DJC, `djc/operator`);
export const DJC_JOB_ORDER = buildApiUrl(_DJC, `djc/job_order`);
export const DJC_JOB_ORDER_DETAIL = buildApiUrl(_DJC, `djc/job_order_detail`);
export const DJC_SALE_ORDER = buildApiUrl(_DJC, `djc/sale_order`);

//DJC OLD
export const DJC_ASSEMBLY_PLANNING_DETAIL = buildApiUrl(
  _DJC,
  `master/assembly-planning-detail`
);
export const DJC_ASSEMBLY_PLANNING_ITEM = buildApiUrl(
  _DJC,
  `master/assembly-planning-item`
);
export const DJC_ASSEMBLY_PLANNING_ITEM_TRACKING = buildApiUrl(
  _DJC,
  `master/assembly-planning-item/getJobOrderItemList`
);
export const DJC_COMPONENT = buildApiUrl(_DJC, `master/component`);
export const DJC_COMPONENT_ROUTING = buildApiUrl(
  _DJC,
  `master/component-routing`
);
export const DJC_ITEM = buildApiUrl(_DJC, `master/item`);
export const DJC_JOB_ORDER_DETAIL_MASTER = buildApiUrl(
  _DJC,
  `master/job-order-detail`
);
export const DJC_JOB_ORDER_DETAIL_GET_NUMBER = buildApiUrl(
  _DJC,
  `master/job-order-detail/getJobOrderNumber`
);
export const DJC_MACHINE = buildApiUrl(_DJC, `master/machine`);
export const DJC_MASTER_OPERATOR = buildApiUrl(_DJC, `master/operator`);
export const DJC_PRODUCT_ASSEMBLY_ROUTING = buildApiUrl(
  _DJC,
  `master/product-assembly-routing`
);
export const DJC_PRODUCT = buildApiUrl(_DJC, `master/product`);
export const DJC_MASTER_SALE_ORDER = buildApiUrl(_DJC, `master/saleorder`);
export const DJC_SHIFT_CALENDAR_MASTER = buildApiUrl(
  _DJC,
  `master/shift-calendar-master`
);
export const DJC_SHIFT = buildApiUrl(_DJC, `master/shift`);
export const DJC_SHIFT_PLANNING_DETAIL = buildApiUrl(
  _DJC,
  `master/shift-planning-detail`
);
export const DJC_SHIFT_PLANNING = buildApiUrl(_DJC, `master/shift-planning`);

//Track and Trace
export const TAT_WORK_STATION = buildApiUrl(_TAT, `work-station`);
export const TAT_WORK_STATION_INSTANCE = buildApiUrl(
  _TAT,
  `work-station-instance`
);
export const TAT_PRODUCT = buildApiUrl(_TAT, `product`);
export const TAT_BYPASS = buildApiUrl(_TAT, `bypass`);
export const TAT_LINE_MASTER = buildApiUrl(_TAT, `line`);
export const TAT_DEFECT_CHECKLIST = buildApiUrl(_TAT, `defect-checklist`);
export const TAT_DEVICE = buildApiUrl(_TAT, `device`);
export const TAT_DOWNTIME = buildApiUrl(_TAT, `tat-down-time`);
export const TAT_DEVICE_TYPE = buildApiUrl(_TAT, `device-type`);
export const TAT_JOB_ORDER = buildApiUrl(_TAT, `job-order`);
export const TAT_PART_COUNT = buildApiUrl(_TAT, `shift-wise-targeted-part`);
export const TAT_WORK_INSTRUCTION = buildApiUrl(
  _TAT,
  `work-instruction-master`
);
export const TAT_ASSEMBLY_QUALITY = buildApiUrl(_TAT, `assembly-quality`);
export const TAT_TRACEABILITY_REPORT = buildApiUrl(
  _TAT,
  `reports/traceability`
);
export const TAT_ASSEMBLY = buildApiUrl(_TAT, `assembly`);
export const TAT_ASSEMBLY_REWORK = buildApiUrl(_TAT, `assembly-rework`);
export const TAT_ASSEMBLY_REWORK_SUB = buildApiUrl(
  _TAT,
  `assembly-rework-sub-defect-controller/{assemblyDetailId}`
);
export const TAT_LOSS_REASON = buildApiUrl(_TAT, `loss-reason`);
export const TAT_REPORT = buildApiUrl(_TAT, "tat", "reports");
export const TAT_FILE_UPLOAD = buildApiUrl(_TAT, "file-upload");
export const TAT_CATEGORY = buildApiUrl(_TAT, `category`);
export const TAT_MODEL = buildApiUrl(_TAT, `model`);
export const TAT_VARIANT = buildApiUrl(_TAT, `variant`);
