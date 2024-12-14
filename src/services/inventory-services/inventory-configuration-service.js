import { SPARE_PART } from "../../helpers/const-service";
import CrudService from "../crud-service";

class InventoryConfigurationService extends CrudService {
  url = SPARE_PART;
  addSpare(sparePartNumber,
    sparePartName,
    description,
    status,
    sparePartTypeId,
    assetFamilyId,
    reorderStock,
    supplierId,
    minimumStock,data) {
    return this.http.post(`${this.url}/add?sparePartNumber=${sparePartNumber}&sparePartName=${sparePartName}&description=${description}&status=${status}&sparePartTypeId=${sparePartTypeId}&assetFamilyId=${assetFamilyId}&reorder=${reorderStock}&minimumQuantityReq=${minimumStock}`, data);

  }
  uploadImage(id,data){
    return this.http.post(`${this.url}/image/${id}`, data);

  }
  

  getSpareDetails(filter = {}) {
    return this.http.get(`${this.url}`, { params: filter });
  }
}

export default InventoryConfigurationService;
