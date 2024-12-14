import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserAccessService from "../services/user-access-service";
import { useAuth } from "./useAuth";
const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      setLoading(true);
      const userAccessService = new UserAccessService();
      userAccessService
        .retrieveByPath(pathname)
        .then(({ data }) => {
          if (data) {
            setAccess(data.map((e) => e.toLowerCase()));
          } else setAccess(null);
        })
        .catch((e) => {
          setAccess(["view"]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pathname, token]);

  const value = useMemo(() => [access, loading], [access, loading]);
  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
};
export const useAccess = () => {
  return useContext(AccessContext);
};
