import { Navigate, useRoutes } from "react-router-dom";
import Color from "../configurations/color/color";
import AppHierarchy from "./app-hierarchy/app-hierarchy";
import Asset from "./asset/asset";
import AssetForm from "../configurations/asset/asset-form";
import Gateway from "./gateway/gateway";
import Menu from "./menu/menu";
import Role from "./role/role";
import AssetFamily from "./asset-family/asset-family";
import User from "./user/user";
import {
  appHierarchyPageId,
  rolePageId,
  userPageId,
  smsandmailConfigurationId,
  assetPageId,
  userGroupPageId,
} from "../../helpers/page-ids";
import SmsMailConfig from "./sms-configuration/sms-mail-config";
import Preview from "./asset/preview";
import ServiceManagerList from "./service-manager/service-manager-list";
import SubscriptionManagerList from "./subscription-manager/subscription-manager-list";
import UserGroup from "./user-group/user-group";
import Entity from "./entity/entity";
import Location from "./location/location";
import EntityHeirarchy from "./entity-heirarchy/entity-heirarchy";
import ModuleSelection from "./module-selection/module-selection";
import BasicDetailsForm from "./asset/basic-details-form";
import AssetParameter from "./asset/asset-parameters";
import Alerts from "./asset/alerts";
import GatewayIntegration from "./asset/gate-way-integration";
import AssetLibrary from "./asset-library/asset-library";
import AssetLibraryForm from "./asset-library/asset-library-form";
import AssetLibraryBasicDetails from "./asset-library/basic-details-form";
import LibraryPreview from "./asset-library/preview";
import AssetParameterLibrary from "./asset-library/parameters";
import LibraryAlerts from "./asset-library/alerts";
import ProductFile from "./asset/product-file";
import AssetLibraryUpload from "./asset-library/asset-library-upload-form";
import LogoUpload from "./logo/logo";
import UserProfile from "./user-profile/user-profile";
import UserAccess from "./user-access/user-access";
import AssetUpload from "./asset/asset-upload-from";
import UserUpload from "./user/user-upload-form";
import Kepware from "./kepware/kepware";
import OeeSettingForm from "./asset/oee-setting-form";
import DynamicDashboardConfiguration from "./dynamic-dashboard-configuration/dynamic-dashboard-configuration";
const Configuration = (props) => {
  const router = useRoutes([
    {
      index: true,
      element: <Navigate to="dashboard" />,
    },
    {
      path: "entity",
      element: <Entity />,
    },
    {
      path: "logo",
      element: <LogoUpload />,
    },
    {
      path: "user-access",
      element: <UserAccess />,
    },
    {
      path: "user-access/:id",
      element: <UserAccess />,
    },
    {
      path: "location",
      element: <Location />,
    },
    {
      path: "user",
      children: [
        {
          index: true,
          element: <User pageId={userPageId} />,
        },
        {
          path: "uploaduser",
          element: <UserUpload />,
        },
      ],
    },
    {
      path: "user-group",
      element: <UserGroup pageId={userGroupPageId} />,
    },
    {
      path: "role",
      element: <Role pageId={rolePageId} />,
    },
    {
      path: "entity-heirarchy",
      element: <EntityHeirarchy />,
    },
    {
      path: "module-selection",
      element: <ModuleSelection />,
    },
    {
      path: "user-profile",
      element: <UserProfile />,
    },
    {
      // path: "gateway",
      path: "gateway-integration",
      element: <Gateway />,
    },
    {
      path: "kepware",
      element: <Kepware />,
    },
    {
      path: "menu",
      element: <Menu />,
    },
    {
      path: "sms-mail-configuration",
      element: <SmsMailConfig pageId={smsandmailConfigurationId} />,
    },
    {
      path: "color/*",
      element: <Color />,
    },
    {
      path: "dynamic-dashboard-configuration",
      element: <DynamicDashboardConfiguration />,
    },
    {
      path: "asset",
      children: [
        {
          index: true,
          element: <Asset pageId={assetPageId} />,
        },
        {
          path: "add",
          element: <AssetForm pageId={assetPageId} mode="Add" />,
          children: [
            {
              index: true,
              element: <BasicDetailsForm />,
            },
            {
              path: ":assetId/basic-details",
              element: <BasicDetailsForm />,
            },
            {
              path: ":assetId/oee-manual",
              element: <OeeSettingForm />,
            },
            {
              path: ":assetId/parameters",
              element: <AssetParameter />,
            },
            {
              path: ":assetId/alerts",
              element: <Alerts />,
            },
            {
              path: ":assetId/gateway-integration",
              element: <GatewayIntegration />,
            },
            {
              path: ":assetId/preview",
              element: <Preview />,
            },
            {
              path: ":assetId/service",
              element: <ServiceManagerList />,
            },
            {
              path: ":assetId/subscription",
              element: <SubscriptionManagerList />,
            },
          ],
        },
        {
          path: "update",
          element: <AssetForm pageId={assetPageId} mode="Edit" />,
          children: [
            {
              path: ":assetId",
              element: <Navigate to="basic-details" />,
            },
            {
              path: ":assetId/basic-details",
              element: <BasicDetailsForm />,
            },
            {
              path: ":assetId/oee-manual",
              element: <OeeSettingForm />,
            },
            {
              path: ":assetId/parameters",
              element: <AssetParameter />,
            },
            {
              path: ":assetId/alerts",
              element: <Alerts />,
            },
            {
              path: ":assetId/gateway-integration",
              element: <GatewayIntegration />,
            },
            {
              path: ":assetId/preview",
              element: <Preview />,
            },
            {
              path: ":assetId/service",
              element: <ServiceManagerList />,
            },
            {
              path: ":assetId/subscription",
              element: <SubscriptionManagerList />,
            },
          ],
        },
        {
          path: "view/:assetId",
          element: <Preview mode="View" pageId={assetPageId} />,
        },
        {
          path: "uploadasset",
          element: <AssetUpload />,
        },
      ],
    },
    {
      path: "asset-family",
      element: <AssetFamily />,
    },
    {
      path: "asset-library",
      children: [
        {
          index: true,
          element: <AssetLibrary />,
        },
        {
          path: "add",
          element: <AssetLibraryForm mode="Add" />,
          children: [
            {
              index: true,
              element: <AssetLibraryBasicDetails />,
            },
            {
              path: ":assetLibraryId/basic-details",
              element: <AssetLibraryBasicDetails />,
            },
            {
              path: ":assetLibraryId/parameters",
              element: <AssetParameterLibrary />,
            },
            {
              path: ":assetLibraryId/alerts",
              element: <LibraryAlerts />,
            },
            {
              path: ":assetLibraryId/preview",
              element: <LibraryPreview />,
            },
            {
              path: ":assetLibraryId/service",
              element: <ServiceManagerList />,
            },
            {
              path: ":assetLibraryId/subscription",
              element: <SubscriptionManagerList />,
            },
          ],
        },
        {
          path: "update",
          element: <AssetLibraryForm mode="Edit" />,
          children: [
            {
              path: ":assetLibraryId",
              element: <Navigate to="basic-details" />,
            },
            {
              path: ":assetLibraryId/basic-details",
              element: <AssetLibraryBasicDetails />,
            },
            {
              path: ":assetLibraryId/parameters",
              element: <AssetParameterLibrary />,
            },
            {
              path: ":assetLibraryId/alerts",
              element: <LibraryAlerts />,
            },
            {
              path: ":assetLibraryId/preview",
              element: <LibraryPreview />,
            },
            {
              path: ":assetLibraryId/service",
              element: <ServiceManagerList />,
            },
            {
              path: ":assetLibraryId/subscription",
              element: <SubscriptionManagerList />,
            },
          ],
        },
        {
          path: "view/:assetLibraryId",
          element: <LibraryPreview mode="View" />,
        },
        {
          path: "uploadLibrary",
          element: <AssetLibraryUpload />,
        },
      ],
    },
  ]);
  return router;
};
export default Configuration;
