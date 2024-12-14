import { PURCHASE_HISTORY } from "../../helpers/const-service";
import CrudService from "../crud-service";

class PurchaseHistoryService extends CrudService {
  url = PURCHASE_HISTORY;
  updatePurchaseRequestStatus = (id, status) => {
    return this.http.post(
      `${this.url}/update-status?purchaseRequestId=${id}&purchaseRequestStatus=${status}`
    );
  };
}

export default PurchaseHistoryService;
