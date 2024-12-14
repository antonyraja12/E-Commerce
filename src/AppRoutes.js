// export default AppRoutes;
import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import PageLoader from "./utils/loader/page-loader";
import { message, Result } from "antd";
import axios from "axios";
import ChangePassword from "./component/change-password/change-password";
import ForgotPassword from "./component/forgot-password/forgot-password";
import Otp from "./component/otp/otp";
import Adam from "./module/adam/adam";
import Configurations from "./module/configurations";
import ProductVerification from "./module/configurations/product-verification/product-verification";
import DashboardDesigner from "./module/dynamic-dashboard";
import Frame from "./module/dynamic-dashboard/frame/frame";
import DashboardMasterList from "./module/dynamic-dashboard/master/dashboard-master-list/dashboard-master-list";
import DashboardMaster from "./module/dynamic-dashboard/master/dashboard-master/dashboard-master";
import Energy from "./module/energy";
import InspectionManagement from "./module/Inspection Management";
import NotificationList from "./module/notification/notification-list";
import Overall from "./module/overall-dashboard";
import QualityInspection from "./module/quality-inspection";
import ShiftMaster from "./module/shift";
import SparePartsManagement from "./module/spare-parts-management";
import MainContainer from "./utils/main-container/main-container";
import MainContainerOne from "./utils/main-container/main-container-1";
import OverAllDashboard from "./utils/new-design/main-dashboard";
import MainLayout from "./utils/new-design/main-layout";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./utils/protected-route";
import { AccessProvider } from "./hooks/useAccess";
import HmiMaster from "./module/hmi";

const Login = lazy(() => import("./component/login/login"));
const PreventiveMaintenance = lazy(() =>
  import("./module/preventive-maintenance")
);
const Oee = lazy(() => import("./module/OEE"));
const Cbm = lazy(() => import("./module/condition-base-monitoring"));
const Dwi = lazy(() => import("./module/digital-work-instruction"));
const Djc = lazy(() => import("./module/digital-job-card/src/index.js"));
const Tat = lazy(() => import("./module/track-and-trace/index.js"));
const DjcNew = lazy(() => import("./module/djc/index.js"));

axios.interceptors.request.use((config) => {
  config.headers.common["Content-Type"] = "application/json";
  config.headers.common["Accept"] = "application/json";
  return config;
});

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Router basename={process.env.PUBLIC_URL}>
        <AuthProvider>
          <Routes>
            <Route path="tat/*" element={<Tat />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="otp" element={<Otp />} />
            <Route
              path="product-verification/:id"
              element={<ProductVerification />}
            />
            <Route
              path="unauthorized"
              element={
                <Result
                  status={"403"}
                  title="403"
                  subTitle="Sorry You are not authorized to access this page"
                />
              }
            />
            <Route path="/" element={<Navigate to="login" />} />

            {/* Routes that require authentication */}
            <Route
              element={
                <ProtectedRoute>
                  <AccessProvider>
                    <MainContainer />
                  </AccessProvider>
                </ProtectedRoute>
              }
            >
              <Route path="pm/*" element={<PreventiveMaintenance />} />
              <Route path="oee/*" element={<Oee />} />
              <Route path="im/*" element={<InspectionManagement />} />
              <Route path="qi/*" element={<QualityInspection />} />
              <Route path="cbm/*" element={<Cbm />} />
              <Route path="settings/*" element={<Configurations />} />
              <Route path="settings/shift/*" element={<ShiftMaster />} />
              <Route path="energy/*" element={<Energy />} />
              <Route path="hmi/*" element={<HmiMaster />} />
              <Route path="spare-parts/*" element={<SparePartsManagement />} />
              <Route path="notification" element={<NotificationList />} />
              <Route path="frame/:id" element={<Frame />} />
              <Route path="db" element={<DashboardMasterList />} />
              <Route path="db/:id" element={<DashboardMaster />} />
              <Route path="dwi/*" element={<Dwi />} />
              <Route path="digital-job-card/*" element={<Djc />} />

              <Route
                path="dashboard-designer/*"
                element={<DashboardDesigner />}
              />
              <Route path="*" element={<h1>Page Not Found</h1>} />
            </Route>
            <Route
              element={
                <ProtectedRoute>
                  <AccessProvider>
                    <MainContainerOne />
                  </AccessProvider>
                </ProtectedRoute>
              }
            >
              <Route path="main" element={<OverAllDashboard />} />
              <Route path="main/adam" element={<Adam />} />
              <Route path="main/notification" element={<NotificationList />} />
              <Route path="main/machine" element={<MainLayout />}>
                <Route path="*" element={<Overall />} />
              </Route>
              <Route
                path="main/dashboard-designer/*"
                element={<DashboardDesigner />}
              />
            </Route>
            <Route
              element={
                <ProtectedRoute>
                  <AccessProvider>
                    <MainLayout />
                  </AccessProvider>
                </ProtectedRoute>
              }
            >
              <Route path="new" element={<Navigate to="pm" />} />
              <Route path="new/pm/*" element={<PreventiveMaintenance />} />
              <Route path="new/oee/*" element={<Oee />} />
              <Route path="new/im/*" element={<InspectionManagement />} />
              <Route path="new/qi/*" element={<QualityInspection />} />
              <Route path="new/cbm/*" element={<Cbm />} />
              <Route path="new/settings/*" element={<Configurations />} />
              <Route path="new/settings/shift/*" element={<ShiftMaster />} />
              <Route path="new/energy/*" element={<Energy />} />
              <Route
                path="new/spare-parts/*"
                element={<SparePartsManagement />}
              />
              <Route path="new/notification" element={<NotificationList />} />
              <Route path="new/frame/:id" element={<Frame />} />
              <Route path="new/*" element={<h1>Page Not Found</h1>} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
};

export default AppRoutes;
