import { Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import DashboardMasterService from "../../../services/dynamic-dashboard/dashboard-master-service";
import FilterBuilder from "../filter/filter-builder";
import { Widget } from "../render-widget/render-widget-fn";

function Frame() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [filters, setFilters] = useState([]);
  const [apiURL, setApiURL] = useState(null);
  const [loading, setLoading] = useState({ widget: false, data: false });

  useEffect(() => {
    const service = new DashboardMasterService();
    setLoading((state) => ({ ...state, widget: true }));
    service
      .retrieve(params.id)
      .then(({ data }) => {
        setWidgets(
          data.widgets?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
        );
        setFilters(
          data.filters?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
        );
        setApiURL(data.apiUrl);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, widget: false }));
      });
  }, [params.id]);
  useEffect(() => {
    fetchData({});
  }, [apiURL]);

  const fetchData = async(data) => {
    setLoading((state) => ({ ...state, data: true }));
    const service = new DashboardMasterService();
    service
      .fetchAllData(apiURL, { params: data })
      .then((response) => {
        setData(response);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, data: false }));
      });
  };

  const loadingPanel = () => {
    const data = [
      { span: 24, height: 80 },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
      { span: 8, height: "auto" },
    ];
    return (
      <Row gutter={[10, 10]}>
        {data.map((e) => (
          <Col span={e.span}>
            <Card style={{ height: e.height }} loading={true}></Card>
          </Col>
        ))}
      </Row>
    );
  };

  if (loading.widget) {
    return loadingPanel();
  }

  return (
    <>
      <Spin spinning={loading.data}>
        <Row gutter={[10, 10]}>
          {filters?.length > 0 && (
            <Col span={24}>
              <div
                style={{
                  backgroundColor: "#eeeeee",
                  padding: "0 10px",
                  border: "1px solid #dddddd",
                  borderRadius: 10,
                }}
              >
                <FilterBuilder filters={filters} onFinish={fetchData} />
              </div>
            </Col>
          )}

          {widgets?.map((e, i) => (
            <Col span={e.col}>
              <Widget e={e} data={data} />
            </Col>
          ))}
        </Row>
      </Spin>
    </>
  );
}

export default Frame;
