import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import AssetEngineService from "../../../services/asset-engine-service";
// import "./asset.css";
import { Button, Col, Row, Space, Typography } from "antd";
import AssetLibraryService from "../../../services/asset-library-service";
function Preview() {
  const { assetLibraryId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  useEffect(() => {
    loadData();
  }, [assetLibraryId]);
  const loadData = () => {
    setLoading(true);
    const service = new AssetLibraryService();
    setData(null);
    setParameters([]);
    setAlerts([]);
    setActiveAlerts([]);
    service
      .retrieve(assetLibraryId)
      .then(({ data }) => {
        // console.log("data", data);

        setData(data);
        setParameters(Object.values(data?.parameters));
        setAlerts(Object.values(data?.alerts));
        setActiveAlerts(Object.values(data?.activeAlerts));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const restart = () => {
    const service = new AssetEngineService();
    setLoading(true);
    service
      .restartByLibrary(assetLibraryId)
      .then(({ data }) => {
        loadData();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Button type="primary" danger onClick={restart} loading={isLoading}>
        Restart Assets
      </Button>
      <Typography.Paragraph type="danger">
        Please click the button to view the changes made to assets in relation
        to this library.
      </Typography.Paragraph>
      <table className="preview">
        <tr>
          <th>Asset Library Name</th>
          <td>{data?.assetLibraryName}</td>
        </tr>

        <tr>
          <th>Status</th>
          <td>{data?.status ? "Active" : "Inactive"}</td>
        </tr>
        <tr>
          <th>Property Definition</th>
          <td>
            <table className="table">
              <thead>
                <tr>
                  <th>Parameter Name</th>
                  <th>Display Name</th>
                  <th>Description</th>
                  {/* <th>Value</th> */}
                  <th>Data Type</th>
                </tr>
              </thead>
              <tbody>
                {parameters?.map((e) => (
                  <tr>
                    <td>{e.parameterName}</td>
                    <td>{e.displayName}</td>
                    <td>{e.description}</td>
                    {/* <td>{e.unit}</td> */}
                    <td>{e.dataType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>Alert Definition</th>
          <td>
            <table className="table">
              <thead>
                <tr>
                  <th>Parameter Name</th>
                  <th>Alert Name</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Notification Type</th>
                </tr>
              </thead>
              <tbody>
                {alerts?.map((e) => (
                  <tr>
                    <td>{e.parameterName}</td>
                    <td>{e.alertName}</td>
                    <td>{e.description}</td>
                    <td>{e.priority}</td>
                    <td>{e.notificationType?.join(",")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </table>
      <br />
      <Row justify={"end"}>
        <Col>
          <Link to="/settings/asset-library">
            <Button type="primary">Done</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default Preview;
