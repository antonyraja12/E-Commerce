import { STOCK_JOURNAL } from "../../helpers/const-service";
import CrudService from "../crud-service";

class StockJournalService extends CrudService {
  url = STOCK_JOURNAL;
  getReport(filter = {}) {
    return this.http.get(`${this.url}/stockreport`, { params: filter });
  }
  dashboard(filter = {}) {
    return this.http.get(`${this.url}/inventory-dashboard`, { params: filter });
  }
  getStockDetails(filter = {}) {
    return this.http.get(`${this.url}/get-individual-stock`, {
      params: filter,
    });
  }
}

export default StockJournalService;
