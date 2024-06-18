import { baseUrl, rootUrl } from "./url";

const baseapi = baseUrl;

const buildApiUrl = (base, ...urls) => {
  return base + "/api/" + urls.join("/");
};

export const REGISTER_URL = buildApiUrl(baseapi, "users/add");
export const LOGIN_URL = buildApiUrl(baseUrl, "login");
export const PRODUCT_URL = buildApiUrl(baseapi, "product");
/// http://localhost:3003/api/users/add
