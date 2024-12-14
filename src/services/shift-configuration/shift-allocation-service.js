import CrudService from "../crud-service";
import HttpClient from "../http";
import { SHIFT_ALLOCATION } from "../../helpers/const-service";
class ShiftAllocationService extends CrudService {
  http = new HttpClient();
  url = SHIFT_ALLOCATION;

  cancel(shiftAllocationId, data) {
    return this.http.post(`${this.url}/${shiftAllocationId}/cancel`, data);
  }
  postShiftAllocation(setName, asset, time) {
    return this.http.post(
      `${this.url}/shift-allocation?setNameId=${setName}&time=${time}`,
      asset
    );
  }
  bulkAdd(value) {
    return this.http.post(`${this.url}/bulk`, value);
  }

  updateShiftAllocation(setNameId, data) {
    return this.http.put(`${this.url}/${setNameId}`, data);
  }
  getShiftAllocation() {
    return this.http.get(`${this.url}`);
  }

  getShiftNames(ahId, assetId = null) {
    // return this.http.get(`${this.url}/shiftNames?ahId=${ahId}&assetId=${assetId}`);
    let url = `${this.url}/shiftNames?ahId=${ahId}`;
    if (assetId != null) {
      url += `&assetId=${assetId}`;
    }
    return this.http.get(url);
  }

  getCalenderView(assetId) {
    return this.http.get(`${this.url}/calender-view?assetId=${assetId}`);
  }
}

export default ShiftAllocationService;
