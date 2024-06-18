import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./mainLayout/main-layout";
import { Suspense, lazy } from "react";
import LoginPage from "./Users/Login";
import RegisterPage from "./Users/RegisterPage";

const AppRoutes = () => {
  const Component = lazy(() => import("./Component"));
  return (
    <>
      <Suspense>
        <Router>
          <Routes>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route path="home/*" element={<Component />} />
            </Route>
          </Routes>
        </Router>
      </Suspense>
    </>
  );
};
export default AppRoutes;
