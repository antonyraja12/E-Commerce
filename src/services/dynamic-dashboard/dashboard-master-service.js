import { DYNAMIC_DASHBOARD } from "../../helpers/const-service";
import { baseUrl } from "../../helpers/url";
import CrudService from "../crud-service";

export default class DashboardMasterService extends CrudService {
  url = DYNAMIC_DASHBOARD;
  fetchData(url, options) {
    return this.http.get(`${baseUrl}${url}`, options);
  }
  fetchAllData(apiUrls, options) {
    const promises = apiUrls.map(url => this.http.get(`${baseUrl}${url}`, options));
    
    return Promise.all(promises);
  }
  categoryFetchData(id) {
    return this.http.put(`${this.url}/update-by-category/${id}`);
  }

  categoryGetData(pageId) {
    return this.http.get(`${this.url}/list-by?pageId=${pageId}`);
  }

  // postByCategory(pageId) {
  //   return this.http.post(`${this.url}/add-by-category?pageId=${pageId}`);
  // }
  postByCategory() {
    return this.http.post(`${this.url}/add-by-category`);
  }
  getById(id) {
    return this.http.get(`${this.url}/${id}`);
  }

  putTheCheck(id, value) {
    return this.http.put(`${this.url}/add-the-check/${id}?value=${value}`);
  }
}
