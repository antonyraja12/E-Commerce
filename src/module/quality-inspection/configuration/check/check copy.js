import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { Spin } from "antd";
import { getIntrospectionQuery } from "graphql";
import { useEffect, useState } from "react";
const GET_LOCATIONS = gql`
  query Dashboard($mode: Int, $assetId: [Int], $userId: [Int]) {
    ticketCount(mode: $mode, assetId: $assetId, userId: $userId) {
      count
      day
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
`;
function Checks() {
  const [type, setType] = useState({});
  const schema = useQuery(
    gql`
      ${getIntrospectionQuery()}
    `
  );
  useEffect(() => {
    let type = {};
    if (schema.data) {
      for (let x of schema.data.__schema?.types) {
        type[x.name] = x;
      }
    }
    setType(type);
    // console.log(type);
  }, [schema]);

  const renderType = (e) => {
    let render;
    switch (e.kind) {
      case "OBJECT":
        render = (
          <li>
            <ul>
              {type[e.name]?.fields?.map((el) => (
                <li>
                  {el.name} {el.kind}
                </li>
              ))}
            </ul>
          </li>
        );
        break;
      case "LIST":
        render = (
          <li>
            <ul>
              {type[e.ofType.name]?.fields?.map((el) => (
                <li>
                  {el.name} {el.type.kind} {el.type.name}
                </li>
              ))}
            </ul>
          </li>
        );
        // e.ofType
        break;
      case "SCALAR":
      default:
        render = <li>{e.name}</li>;
        break;
    }
    return render;
  };

  const { loading, error, data } = useQuery(GET_LOCATIONS, {
    variables: {
      $mode: 2,
    },
  });
  return (
    <>
      <Spin spinning={loading}>
        <ul>
          {type?.Query?.fields?.map((e) => (
            <li>
              {e.name} {e.type.kind}
              <ul>
                {e.args?.map((el) => (
                  <li>
                    {el.name} {el.type?.kind} {el.type?.name} - ARGS
                  </li>
                ))}
                {renderType(e.type)}
              </ul>
            </li>
          ))}
          <li></li>
        </ul>
      </Spin>
    </>
  );
}

export default Checks;
