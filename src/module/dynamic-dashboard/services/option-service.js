import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import UserService from "../../../services/user-service";
export default class OptionService {
  static getEntities(filter = {}) {
    return new Promise((resolve, reject) => {
      const service = new AppHierarchyService();
      return service
        .list({ active: true, ...filter })
        .then(({ data }) => {
          data?.sort((a, b) => a.ahname.localeCompare(b.ahname));
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static convertToTree(
    source,
    parentId = null,
    { label, value, primary, parent }
  ) {
    let config = { label, value, primary, parent };
    let result = source
      ?.filter((e) => e[parent] === parentId)
      .map((e) => {
        let obj = { value: e[value], title: e[label] };
        let children = this.convertToTree(source, e[primary], config);
        if (children.length > 0)
          obj = { value: e[value], title: e[label], children: children };
        return obj;
      });

    return result;
  }
  static getUsers(filter = {}) {
    return new Promise((resolve, reject) => {
      const service = new UserService();
      return service
        .list({ active: true, ...filter })
        .then(({ data }) => {
          resolve(data?.sort((a, b) => a.userName.localeCompare(b.userName)));
          // resolve(
          //   data
          //     .map((e) => ({ value: e.userId, label: e.userName }))
          //     .sort((a, b) => a.label.localeCompare(b.label))
          // );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static getAssets(filter = {}) {
    return new Promise((resolve, reject) => {
      const service = new AssetService();
      return service
        .list({ active: true, ...filter })
        .then(({ data }) => {
          resolve(data?.sort((a, b) => a.assetName.localeCompare(b.assetName)));

          // resolve(
          //   data
          //     .map((e) => ({ value: e.assetId, label: e.assetName }))
          //     .sort((a, b) => a.label.localeCompare(b.label))
          // );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static getMode() {
    return new Promise((resolve, reject) => {
      resolve([
        { value: 1, label: "Today" },
        { value: 2, label: "This Week" },
        { value: 3, label: "This Month" },
        { value: 4, label: "This Year" },
      ]);
    });
  }
}
