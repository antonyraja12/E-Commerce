import { OEE_REPORT } from "../../helpers/const-service";
import CrudService from "../crud-service";

class OeeReportsService extends CrudService {
  url = OEE_REPORT;

  getbyReports(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    return this.http.get(
      `${this.url}?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyDowntime(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    return this.http.get(
      `${this.url}/runTimeAndDownTime?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyQuality(ahId, assetId, shiftName, reportWise, startDate, endDate) {
    return this.http.get(
      `${this.url}/qualityReport?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyQualityCalculation(
    ahId,
    assetId,
    shiftName,
    reportWise,
    startDate,
    endDate
  ) {
    return this.http.get(
      `${this.url}/qualityCalculation?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyDowntimeOccurence(
    ahId,
    assetId,
    shiftName,
    reportWise,
    startDate,
    endDate
  ) {
    return this.http.get(
      `${this.url}/downTimeOccurance?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyDefectCategory(
    ahId,
    assetId,
    shiftName,
    reportWise,
    startDate,
    endDate
  ) {
    return this.http.get(
      `${this.url}/defectCategory?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getbyDowntimeReasons(
    ahId,
    assetId,
    shiftName,
    reportWise,
    startDate,
    endDate
  ) {
    return this.http.get(
      `${this.url}/downTimeReasons?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getbyModelWiseReport(
    ahId,
    assetId,
    shiftName,
    reportWise,
    startDate,
    endDate
  ) {
    return this.http.get(
      `${this.url}/modelWiseReport?ahId=${ahId}&assetId=${assetId}&shiftName=${shiftName}&reportWise=${reportWise}&startDate=${startDate}&endDate=${endDate}`
    );
  }
}
export default OeeReportsService;
