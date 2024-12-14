import UserAccessService from "../../services/user-access-service";

export default class AuthorizationCheck {
  userAccessService = new UserAccessService();

  constructor(pageId) {
    this._access = {};
    this._pageId = pageId;
  }
  async _accessCheck() {
    let { data } = await this.userAccessService.authorization(this._pageId);
    for (let x of data.feature) {
      this._setAccess(x);
    }
  }
  _setAccess(mode) {
    let m = mode.toLowerCase();
    this._access = { ...this._access, [m]: true };
  }

  _checkAccess(mode) {
    let m = mode.toLowerCase();
    return this._access[m];
  }
}
