import axios from "axios";
export default class HttpClient {
  get(url, config = {}) {
    return axios.get(...arguments);
  }
  post(url, data, config = {}) {
    return axios.post(...arguments);
  }
  put(url, data, config = {}) {
    return axios.put(...arguments);
  }
  patch(url, data, config = {}) {
    return axios.patch(...arguments);
  }
  delete(url, config = {}) {
    return axios.delete(...arguments);
  }
}
