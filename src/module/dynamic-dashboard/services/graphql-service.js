import { graphqlUrl } from "../../../helpers/url";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { getIntrospectionQuery } from "graphql";

export default class GraphqlService {
  static url = `${graphqlUrl}`;
  static getSchema() {
    const client = new ApolloClient({
      uri: GraphqlService.url,
      cache: new InMemoryCache(),
    });
    return client.query({
      query: gql`
        ${getIntrospectionQuery()}
      `,
    });
  }
  static getType(schema) {
    return schema?.__schema.types;
  }
  static getChild(types, name) {
    return types?.find((e) => e.name.toLowerCase() === name?.toLowerCase())
      ?.fields;
  }
  static getFunctions() {
    return new Promise((resolve, reject) => {
      this.getSchema()
        .then(({ data }) => {
          const { types } = data.__schema;
          resolve(types.find((e) => e.name === "Query")?.fields);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /*[
    {queryName:"tickstatus",argument:["date"],field:["count","day"]}
  ]*/
  //field = ["count","day"]
  getData(queryName, argument, field) {
    const client = new ApolloClient({
      uri: GraphqlService.url,
      cache: new InMemoryCache(),
    });
    return client.query({
      query: gql`
        query 
        fetchData() {
          ${queryName}{
            ${field.join("")}
          }
          ticketStatus(mode: $mode, assetId: $assetId, userId: $userId) {
            status
            count
          }
          ageingOfTicket(mode: $mode, assetId: $assetId, userId: $userId) {
            label
            value
          }
        }
      `,
    });
  }

  static getFields(selectedType) {
    switch (selectedType.type.kind) {
      case "LIST":
        break;

      default:
        break;
    }
  }
}
