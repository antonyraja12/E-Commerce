import CrudService from "../crud-service";
import { IM_SCHEDULAR, PM_SCHEDULAR } from "../../helpers/const-service";
class SchedulerService extends CrudService {
  url = IM_SCHEDULAR;

  deleteScheduler(id, SchedulerUpdate, scheduleDate) {
    return this.http.delete(
      `${this.url}/${id}?schedulerUpdate=${SchedulerUpdate}&scheduleDate=${scheduleDate}`
    );
  }
  schedulerUploadPreview(file) {
    let formData = new FormData();
    formData.append("file", file);

    return this.http.post(
      `${this.url}/scheduler-excel-upload-preview`,
      formData
    );
  }
  schedulerUpload(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/scheduler-excel-upload`, formData);
  }
}
export default SchedulerService;
