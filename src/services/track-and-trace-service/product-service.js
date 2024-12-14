import CrudService from "../crud-service";
import { TAT_PRODUCT } from "../../helpers/const-service";

class ProductService extends CrudService {
  url = TAT_PRODUCT;
  uploadFile(data) {
    return this.http.post(`${this.url}/excel/upload`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  exportFile() {
    return this.http.get(`${this.url}/excel/download`, {
      responseType: "blob",
    });
  }
  updateImage(data, id) {
    return this.http.put(`${this.url}/add-image/${id}`, data);
  }
}

export default ProductService;
