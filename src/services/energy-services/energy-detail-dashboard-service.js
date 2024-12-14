import { ENERGY } from "../../helpers/const-service";
import CrudService from "../crud-service";

class EnergyDetailDashboardService extends CrudService {
  url = ENERGY;

  getAllAssetEnergy(filter = {}) {
    return this.http.get(`${this.url}/list-all-energy`, {
      params: filter,
    });
  }

  getDashboardDetails = (assetId) => {
    return this.http.get(`${this.url}?assetIds[]=${assetId}`);
  };
  getTreeData(filter = {}) {
    return this.http.get(`${this.url}/all-energy-asset-details`, {
      params: filter,
    });
  }

  convertToTree(data, parent = null) {
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
  deleteEnergyAsset(id) {
    return this.http.post(`${this.url}/delete?assetId=${id}`);
  }
}
export default EnergyDetailDashboardService;
