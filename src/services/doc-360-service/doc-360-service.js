import { DOC_360 } from "../../helpers/const-service";
import CrudService from "../crud-service";
class Doc360Service extends CrudService {
  url = DOC_360;
  api_key =
    "hhe27jr97fXvzosPt1E2Bbj4qVidVrKFW49grLqP0W1TwIUSgXpE6X8ZY/ofHZEfbfUpCniPwmcLOFCLZp3pC8N8VplrfI2o8NU+Pb8NmA7XMvcaOE5Ppgv0W9vZRBaejXG2T1SkOSKLJPTzqaCVsQ==";
  getCategory(categoryId) {
    const category = categoryId;
    return this.http.get(`${this.url}/Categories/${category}`, {
      headers: { Api_token: this.api_key },
    });
  }
  listAllCategories(projectVersionId) {
    const pvId = projectVersionId;
    return this.http.get(`${this.url}/ProjectVersions/${pvId}/categories`, {
      headers: { Api_token: this.api_key },
    });
  }
  listAllArticles(projectVersionId) {
    const pvId = projectVersionId;
    return this.http.get(`${this.url}/ProjectVersions/${pvId}/articles`, {
      headers: { Api_token: this.api_key },
    });
  }
  getArticle(articleId) {
    return this.http.get(`${this.url}/Articles/${articleId}/en`, {
      headers: { Api_token: this.api_key },
    });
  }

  getProjectVersion(projectVersionId, filter = {}) {
    return this.http.get(`${this.url}/ProjectVersions/${projectVersionId}/en`, {
      headers: { Api_token: this.api_key },
      params: filter,
    });
  }
}
export default Doc360Service;
