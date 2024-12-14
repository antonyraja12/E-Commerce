import { createContext, useContext, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import LoginService from "../services/login-service";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async ({ userName, password }, path = "") => {
    const service = new LoginService();
    const { data } = await service.login({
      userName,
      password,
    });

    setToken({ token: data.token, userName: userName });
    navigate(path ? path : "/main");
  };

  const logout = async () => {
    const service = new LoginService();
    if (token) {
      await service.logout();
      localStorage.removeItem("token");
    }

    setToken(null);
  };

  // useEffect to navigate after token is set to null
  useEffect(() => {
    if (token === null) {
      if (!pathname.includes("operator")) navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
