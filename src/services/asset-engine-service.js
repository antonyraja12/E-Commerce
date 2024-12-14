import { ASSET_ENGINE, CONFIGURATION_ASSET } from "../helpers/const-service";
import { rootUrl } from "../helpers/url";
import HttpClient from "./http";
export default class AssetEngineService {
  http = new HttpClient();
  getAsset(assetId) {
    return this.http.get(`${ASSET_ENGINE}/${assetId}`);
  }
  restart(assetId) {
    return this.http.post(`${CONFIGURATION_ASSET}/${assetId}/restart`);
  }
  start(assetId) {
    return this.http.post(`${CONFIGURATION_ASSET}/${assetId}/start`);
  }
  stop(assetId) {
    return this.http.post(`${CONFIGURATION_ASSET}/${assetId}/stop`);
  }
  connect(assetId) {
    return this.http.post(`${CONFIGURATION_ASSET}/${assetId}/connect`);
  }
  disconnect(assetId) {
    return this.http.post(`${CONFIGURATION_ASSET}/${assetId}/disconnect`);
  }
  restartByLibrary(assetLibraryId) {
    return this.http.post(
      `${CONFIGURATION_ASSET}/library/${assetLibraryId}/restart`
    );
  }
  statusSubscription(assetId, taskName) {
    return this.http.post(
      `${ASSET_ENGINE}/${assetId}/scheduler/${taskName}/status`
    );
  }
  startSubscription(assetId, taskName) {
    return this.http.post(
      `${ASSET_ENGINE}/${assetId}/scheduler/${taskName}/start`
    );
  }
  stopSubscription(assetId, taskName) {
    return this.http.post(
      `${ASSET_ENGINE}/${assetId}/scheduler/${taskName}/stop`
    );
  }
  updateParameterValue(assetId, parameterName, value) {
    return this.http.post(`${ASSET_ENGINE}/${assetId}/parameterValue`, {
      parameterName,
      value,
    });
  }
  updateParameterValues(assetId, data) {
    return this.http.post(`${ASSET_ENGINE}/${assetId}/parameterValues`, data);
  }
}
