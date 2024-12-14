import CrudService from "../crud-service";
import { SPARE_REQUEST } from "../../helpers/const-service";
class InventoryRequestService extends CrudService {
  url = SPARE_REQUEST;

  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e?.spareRequestSubList?.spareRequestId === parent)
      .map((e) => {
        console.log("eee", e);
        let obj = { ...e };
        let children = this.convertToTree(data, e?.spareRequestId);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
  getAvailability(filter = {}) {
    return this.http.get(`${this.url}/get-available-quantity`, {
      params: filter,
    });
  }
  dispatchIndividualStock(data) {
    return this.http.post(`${this.url}/stock-out`, data);
  }
  approveDispatch(id, status) {
    return this.http.put(`${this.url}/status-update/${id}?status=${status}`);
  }
  getPendingQuantity(id) {
    return this.http.get(`${this.url}/pending-quantity/${id}`);
  }
}
export default InventoryRequestService;
