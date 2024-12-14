import { CONFIGURATION_ASSET } from "../helpers/const-service";
import CrudService from "./crud-service";
class AssetService extends CrudService {
  url = CONFIGURATION_ASSET;
  // doc360Url = DOC_360_URL;
  publish(id) {
    return this.http.post(`${this.url}/publish/${id}`, {});
  }
  listParameter(assetId) {
    return this.http.get(`${this.url}/${assetId}/parameter`);
  }
  listParameterAll(assetId) {
    return this.http.get(`${this.url}/${assetId}/parameter`, {
      params: {
        includeLibrary: true,
      },
    });
  }
  retrieveParameter(assetId, parameterName) {
    return this.http.get(`${this.url}/${assetId}/parameter/${parameterName}`);
  }
  addorUpdateParameter(assetId, data) {
    return this.http.post(`${this.url}/${assetId}/parameter`, data);
  }
  deleteParameter(assetId, parameterName) {
    return this.http.delete(
      `${this.url}/${assetId}/parameter/${parameterName}`
    );
  }
  listAlert(assetId) {
    return this.http.get(`${this.url}/${assetId}/alert`);
  }
  uploadPreview(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/asset-excel-upload-preview`, formData);
  }
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/asset-excel-upload`, formData);
  }
  retrieveAlert(assetId, alertName) {
    return this.http.get(`${this.url}/${assetId}/alert/${alertName}`);
  }
  listParameterAll(assetId) {
    return this.http.get(`${this.url}/${assetId}/parameter`, {
      params: {
        includeLibrary: true,
      },
    });
  }
  addorUpdateAlert(assetId, data) {
    return this.http.post(`${this.url}/${assetId}/alert`, data);
  }
  alertTicket(data) {
    return this.http.post(
      `${this.url}/${data.assetId}/alert/alert-ticket`,
      data
    );
  }
  deleteAlert(assetId, alertName) {
    return this.http.delete(`${this.url}/${assetId}/alert/${alertName}`);
  }
  listService(assetId) {
    return this.http.get(`${this.url}/${assetId}/service`);
  }
  retrieveService(assetId, serviceName) {
    return this.http.get(`${this.url}/${assetId}/service/${serviceName}`);
  }
  addorUpdateService(assetId, data) {
    return this.http.post(`${this.url}/${assetId}/service`, data);
  }
  deleteService(assetId, serviceName) {
    return this.http.delete(`${this.url}/${assetId}/service/${serviceName}`);
  }
  listSubscription(assetId) {
    return this.http.get(`${this.url}/${assetId}/subscription`);
  }
  retrieveSubscription(assetId, subscriptionName) {
    return this.http.get(
      `${this.url}/${assetId}/subscription/${subscriptionName}`
    );
  }
  addorUpdateSubscription(assetId, data) {
    return this.http.post(`${this.url}/${assetId}/subscription`, data);
  }
  deleteSubscription(assetId, subscriptionName) {
    return this.http.delete(
      `${this.url}/${assetId}/subscription/${subscriptionName}`
    );
  }
  gatewayIntegration(assetId, value) {
    return this.http.post(`${this.url}/${assetId}/gateway-integration`, value);
  }
  convertToTree(data, parent = 0) {
    let result;
    result = data
      .filter((e) => e.parentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.assetId);
        let mainChild = children.map((x) => ({ ...x, name: x.assetName }));
        if (mainChild.length > 0)
          obj = { ...e, children: mainChild, name: e.assetName };
        else obj = { ...e, name: e.assetName };
        return obj;
      });
    return result;
  }
  image(file, id) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.put(`${this.url}/image/${id}`, formData);
  }
  addwarranty() {
    return this.http.post(`${this.url}/add-warranty`);
  }
  createAsset(asset, description, ahid, active, assetCategory) {
    return this.http.post(
      `${this.url}?assetName=${asset}&description=${description}&ahid=${ahid}&active=${active}&assetCategory=${assetCategory}`
    );
  }
  getTimeSeriesData(assetId, params = {}) {
    return this.http.get(`${this.url}/${assetId}/time-series-data`, {
      params: params,
    });
  }
  getByEntity(entityId) {
    return this.http.get(`${this.url}/app-hierarchy/${entityId}`);
  }
}
export default AssetService;
