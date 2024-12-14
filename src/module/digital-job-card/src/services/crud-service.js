import HttpClientService from "./http-client-service";
export default class CrudService {
  http = new HttpClientService();
  url;
  list(filter = {}) {
    return this.http.get(`${this.url}`, {
      params: filter,
    });
  }
  retrieve(id) {
    return this.http.get(`${this.url}/${id}`);
  }
  add(data) {
    return this.http.post(this.url, data);
  }
  update(data, id) {
    return this.http.put(`${this.url}/${id}`, data);
  }
  delete(id) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
