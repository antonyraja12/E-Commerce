import NotificationService from "../../module/notification/service/notification-service";
import AlertsService from "../../services/alerts-service";
import FireAlertService from "../../services/fire-alert-service";
import MenuService from "../../services/menu-service";
import RemoteMonitoringHomeService from "../../services/remote-monitoring-home-service";

export const menuList = () => {
  const menuService = new MenuService();
  return (dispatch) => {
    return menuService
      .userMenu()
      .then(({ data }) => {
        dispatch({ type: "MENU_LIST_", data: data.filter((e) => e.status) });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
export const menuRefresh = (data) => {
  return (dispatch) => {
    return dispatch({ type: "MENU_REFRESH_", data: data });
  };
};

export const notificationList = () => {
  const service = new NotificationService();
  return (dispatch) => {
    return service
      .list()
      .then(({ data }) => {
        dispatch({ type: "NOTIFICATION_LIST_", data: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
export const setMainDashboard = (type, data) => {
  switch (type) {
    case "SET_AHID":
      return (dispatch) => {
        dispatch({ type: "SET_AHID", data: data });
      };
    case "SET_ASSETID":
      return (dispatch) => {
        dispatch({ type: "SET_ASSETID", data: data });
      };
  }
};
export const setAlertData = (data) => {
  const alertList = data.filter((e) => !e.closed);
  const fireAlarmList = alertList.filter((e) => e.alertTypes == "Fire");
  return (dispatch) => {
    dispatch({ type: "ALERTS_LIST_", data: alertList });
    dispatch({
      type: "FIRE_ALERTS_LIST_",
      data: fireAlarmList.filter((e) => Number(e.confirmation ?? 0) != 2),
    });
    dispatch({
      type: "PUMP_ALERTS_LIST_",
      data: alertList.filter((e) => e.alertTypes != "Fire"),
    });
    dispatch({
      type: "FIRE_ALERTS_ALARM_",
      data: fireAlarmList.filter((e) => !e.acknowledgement && !e.confirmation),
    });
    dispatch({
      type: "ACKNOWLEDGEMENT_LIST_",
      data: fireAlarmList.filter((e) => !e.confirmation),
    });
  };
};

export const alertsList = () => {
  const service = new AlertsService();
  // return (dispatch) => {
  return service
    .alerts()
    .then(({ data }) => {
      setAlertData(data);
    })
    .catch((error) => {
      console.error(error);
    });
  // };
};
