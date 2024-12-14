import HttpClient from "../http";
import { SUGGESTION_CONFIGURATION } from "../../helpers/const-service";
class CorrectiveActionSuggestionService {
  url = SUGGESTION_CONFIGURATION;
  constructor() {
    this.http = new HttpClient();
  }
  list(filter = {}) {
    return this.http.get(this.url, { params: filter });
  }
}
export default CorrectiveActionSuggestionService;
