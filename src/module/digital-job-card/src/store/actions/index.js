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

export const customerStatus = () => {
  const service = new RemoteMonitoringHomeService();
  return (dispatch) => {
    return service
      .getCustomerStatus()
      .then(({ data }) => {
        dispatch({ type: "CUSTOMER_STATUS_", data: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
