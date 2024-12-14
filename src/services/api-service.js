import HttpClient from "./http";
import axios from "axios";
import moment from "moment";
import { START_TIME,END_TIME } from "../helpers/constants";
import AuthService from "./auth-service";
export default class API {
    ip="";
    auth=new AuthService();
  //auditUrl = "http://localhost:4000/audit/";  
  auditUrl="https://autotemp-api.azurewebsites.net/audit/";
  rootUrl = "https://testdemosite.azurewebsites.net/";
  getEnergyMeter(device_id, startTime = START_TIME, endTime = END_TIME) {
    let http = new HttpClient();
    return http.get(
      "https://janaaticsfunctionapp.azurewebsites.net/api/GetTimeSeriesData",
      {
        params: {
          code: "5rUZrumKciSJ7bfhQjR38Qxkk7nUhTNR63phSsDHQOyRCisQ3CeuBA==",
          deviceid: device_id,
          startTime: startTime,
          endTime: endTime,
        },
      }
    );
  }
  getEnergyDaily(devicename, getType, dateRange = {}) {
    let http = new HttpClient();
    let str = "";
    let params = {
      devicename: devicename,
      getType: getType,
    };
    if (getType == "Custom") {
      str = "/byDevice";
      params.From = moment(dateRange.from_date).format("M/D/YYYY");
      params.to = moment(dateRange.to_date).format("M/D/YYYY");
    } else params.dt = moment().format("M/D/YYYY");
    return http.get(`${this.rootUrl}api/EnergyDaily${str}`, {
      params: params,
    });
  }
  getShiftEnergy(devicename, getType, dateRange = {}) {
    let http = new HttpClient();
    let params = {
      devicename: devicename,
      getType: getType,
    };
    let str = "";
    if (getType == "Custom") {
      str = "/byDevice";
      params.From = moment(dateRange.from_date).format("M/D/YYYY");
      params.to = moment(dateRange.to_date).format("M/D/YYYY");
    } else params.dt = moment().format("M/D/YYYY");
    return http.get(`${this.rootUrl}api/ShiftEnergy${str}`, {
      params: params,
    });
  }
  getDeviceList() {
    let http = new HttpClient();
    return http.get(`${this.rootUrl}api/DeviceList`);
  }
  login(email, password) {
    let http = new HttpClient();
    return http.post(`${this.rootUrl}auth`, {
      Email: email,
      password: password,
    });
  }
  logout() {
    let service = new AuthService();
    service.deleteToken();
    return { success: true };
  }
  d_login(data) {
    let http = new HttpClient();
    return http.post(
      `${this.auditUrl}login`,
        data
    );
  }
  d_machineList() {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}machine`
    );
  }
  d_processList() {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}process`
    );
  }
  d_auditList(filter) {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit`,{params:filter}
    );
  }
  d_getTotal(filter) {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit/count`,{params:filter}
    )
  }
  d_getAuditGraph(filter) {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit/audit-day-wise`,{params:filter}
    )
  }
  d_getAging(filter) {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit/aging`,{params:filter}
    )
  }
  d_userList() {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}user`
    );
  }
  d_auditScheduleList() {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}schedule-audit`
    );
  }
  d_auditScheduleAdd(data) {
    let http = new HttpClient();
    return http.post(
      `${this.auditUrl}schedule-audit`,
      data
    );
  }
  d_rcaReport(data) {
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit/rca-report`,
      {params:data}
    );
  }
  d_repeatedAbnormality(data){
    let http = new HttpClient();
    return http.get(
      `${this.auditUrl}audit/repeated-abnormality`,
      {params:data}
    );
  }
  
}
