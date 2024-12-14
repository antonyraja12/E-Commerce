import { CONFIGURATION_ASSET_LIBRARY } from "../helpers/const-service";
import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";

class AssetLibraryService extends CrudService {
  url = CONFIGURATION_ASSET_LIBRARY;
  publish(id) {
    return this.http.post(`${this.url}/publish/${id}`, {});
  }

  listParameter(assetId) {
    return this.http.get(`${this.url}/${assetId}/parameter`);
  }
  listParameterAll(assetLibraryId) {
    return this.http.get(`${this.url}/${assetLibraryId}/parameter`, {
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

  retrieveAlert(assetId, alertName) {
    return this.http.get(`${this.url}/${assetId}/alert/${alertName}`);
  }

  uploadPreview(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/library-excel-upload-preview`, formData);
  }
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/library-excel-upload`, formData);
  }
  addorUpdateAlert(assetId, data) {
    return this.http.post(`${this.url}/${assetId}/alert`, data);
  }

  deleteAlert(assetId, alertName) {
    return this.http.delete(`${this.url}/${assetId}/alert/${alertName}`);
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
  listService(assetLibraryId) {
    return this.http.get(`${this.url}/${assetLibraryId}/service`);
  }
  retrieveService(assetLibraryId, serviceName) {
    return this.http.get(
      `${this.url}/${assetLibraryId}/service/${serviceName}`
    );
  }
  addorUpdateService(assetLibraryId, data) {
    return this.http.post(`${this.url}/${assetLibraryId}/service`, data);
  }
  deleteService(assetLibraryId, serviceName) {
    return this.http.delete(
      `${this.url}/${assetLibraryId}/service/${serviceName}`
    );
  }
  listSubscription(assetLibraryId) {
    return this.http.get(`${this.url}/${assetLibraryId}/subscription`);
  }
  retrieveSubscription(assetLibraryId, subscriptionName) {
    return this.http.get(
      `${this.url}/${assetLibraryId}/subscription/${subscriptionName}`
    );
  }
  addorUpdateSubscription(assetLibraryId, data) {
    return this.http.post(`${this.url}/${assetLibraryId}/subscription`, data);
  }
  deleteSubscription(assetLibraryId, subscriptionName) {
    return this.http.delete(
      `${this.url}/${assetLibraryId}/subscription/${subscriptionName}`
    );
  }
}
export default AssetLibraryService;
