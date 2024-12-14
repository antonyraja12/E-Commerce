// import { OEE_EXCEL } from "../../helpers/const-service";
// import { rootUrl } from "../../helpers/url";
// import CrudService from "../crud-service";

// class OeeExcelReportService extends CrudService {
//   url = OEE_EXCEL;

//   getbyExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
//     return this.http.get(
//       `${this.url}/excel?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
//     );
//   }
//   getbyDowntimeExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
//     return this.http.get(
//       `${this.url}/excelDownTime?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
//     );
//   }

//   getbyQualityExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
//     return this.http.get(
//       `${this.url}/qualityReportExcel?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
//     );
//   }
//   download(url) {
//     return this.http.get(url, {
//       responseType: "blob",
//       headers: {
//         Accept: "*/*",
//       },
//     });
//   }
// }

// export default OeeExcelReportService;

import { OEE_EXCEL } from "../../helpers/const-service";
import CrudService from "../crud-service";

class OeeExcelReportService extends CrudService {
  url = OEE_EXCEL;

  getbyExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    const params = {
      ahId,
      assetId,
      shiftName: encodeURIComponent(shiftName),
      reportWise: encodeURIComponent(reportWise),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
    return this.http.get(`${this.url}/excel`, { params, responseType: "blob" });
  }

  getbyDowntimeExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    const params = {
      ahId,
      assetId,
      shiftName: encodeURIComponent(shiftName),
      reportWise: encodeURIComponent(reportWise),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
    return this.http.get(`${this.url}/excelDownTime`, {
      params,
      responseType: "blob",
    });
  }

  getbyQualityExcel(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    const params = {
      ahId,
      assetId,
      shiftName: encodeURIComponent(shiftName),
      reportWise: encodeURIComponent(reportWise),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
    return this.http.get(`${this.url}/qualityReportExcel`, {
      params,
      responseType: "blob",
    });
  }
}

export default OeeExcelReportService;
