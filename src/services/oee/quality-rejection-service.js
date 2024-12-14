import { OEE_QUALITY_REJECTION } from "../../helpers/const-service";
import CrudService from "../crud-service";

class QualityRejectionService extends CrudService {
  url = OEE_QUALITY_REJECTION;
  getbyshiftAllocationId(shiftAllocationId) {
    return this.http.get(
      `${this.url}/quality-rejection-list?shiftAllocationId=${shiftAllocationId}`
    );
  }
  putByModelId(modelId, rejectedPart, reason, remark, shiftAllocationId) {
    return this.http.put(
      `${this.url}/modelId?modelId=${modelId}&rejectPart=${rejectedPart}&remark=${remark}&reason=${reason}&shiftAllocationId=${shiftAllocationId}`
    );
  }
  getRejectionHistory(modelId) {
    return this.http.get(`${this.url}/modelId?modelId=${modelId}`);
  }
  getRejectionHistoryReason(id, parCount) {
    return this.http.put(`${this.url}/${id}?partCount=${parCount}`);
  }
  deleteRejectionHistoryReason(id) {
    return this.http.delete(`${this.url}/id?recordsId=${id}`);
  }
  addParts(shitId, modelId, partCounts) {
    return this.http.post(
      `${this.url}/addParts?shitId=${shitId}&modelId=${modelId}&partCounts=${partCounts}`
    );
  }
}
export default QualityRejectionService;
