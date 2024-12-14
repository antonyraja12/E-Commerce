import { useEffect, useMemo, useState } from "react";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Image,
  Input,
  Menu,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { TreeSelect } from "antd/es";
import {
  NavLink,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";
import AppHierarchyService from "../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../services/asset-service";
import "./main-layout.css";
const StyledCardSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    font-size: 1em;
    color: #b2b9b7;
  }
  .slick-prev:hover,
  .slick-next:hover {
    color: #333333;
  }
  .slick-prev {
    left: 0;
  }
  .slick-next {
    right: 0;
  }
  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .slick-slide > div {
    // width: auto;
    flex: 1 !important;
    text-align: center;
    padding: 5px;
    // margin-left:10px;
    // background: rgba(255, 255, 255, 0.16);
    // border-radius: 16px;
    // border: 1px solid rgba(255, 255, 255, 1);
  }
  .image-wrapper {
    width: auto !important;
  }
  .slick-list {
    margin: 0 30px;
  }
`;

function MainLayout() {
  const location = useLocation();
  const [form] = Form.useForm();
  const assetId = Form.useWatch("assetId", form);
  const aHId = Form.useWatch("aHId", form);
  const items = [
    // {
    //   label: <NavLink to={`cbm?aHId=${aHId}&assetId=${assetId}`}>CBM</NavLink>,
    //   key: "cbe",
    // },
    {
      label: <NavLink to={`oee?aHId=${aHId}&assetId=${assetId}`}>OEE</NavLink>,
      key: "oee",
    },
    {
      label: (
        <NavLink to={`energy?aHId=${aHId}&assetId=${assetId}`}>Energy</NavLink>
      ),
      key: "energy",
    },
    {
      label: <NavLink to={`pm?aHId=${aHId}&assetId=${assetId}`}>PM</NavLink>,
      key: "pm",
    },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [current, setCurrent] = useState("mail");
  const [assetList, setAssetList] = useState([]);

  const onClick = (e) => {
    setCurrent(e.key);
  };
  const [entityOption, setEntityOption] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const getAssetList = () => {
    if (!isNaN(Number(aHId))) {
      const service = new AssetService();
      setAssetList([]);
      service.getByEntity(Number(aHId)).then(({ data }) => {
        let rec = [];
        if (location?.pathname?.includes("energy")) {
          rec = data
            ?.filter((e) => e.assetCategory === 2)
            .map((e) => ({
              label: e.assetName,
              value: e.assetId,
              imagePath: e.imagePath,
              ahId: e.ahid,
            }));
        } else {
          rec = data
            ?.filter((e) => e.assetCategory === 1)
            .map((e) => ({
              label: e.assetName,
              value: e.assetId,
              imagePath: e.imagePath,
              ahId: e.ahid,
            }));
        }

        setAssetList(rec);

        form.setFieldValue("assetId", rec[0] ? rec[0]?.value : null);
      });
    }
  };

  const settings = {
    // className: "center",
    centerMode: false,
    infinite: false,
    slidesToShow: 7,
    draggable: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(6, assetList.length),
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(4, assetList.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, assetList.length),
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: Math.min(1, assetList.length),
        },
      },
    ],
    speed: 500,
    prevArrow: <LeftOutlined />,
    nextArrow: <RightOutlined />,
  };

  const getAppHierarchyList = () => {
    const service = new AppHierarchyService();
    service.list({ active: true }).then(({ data }) => {
      let treeData = service.convertToSelectTree(data);
      setEntityOption(treeData);
      form.setFieldValue("aHId", treeData[0]?.value);
    });
  };

  useEffect(() => {
    getAppHierarchyList();
    form.setFieldValue("aHId", searchParams.get("aHId"));
    form.setFieldValue("assetId", searchParams.get("assetId"));
  }, []);

  useMemo(() => {
    getAssetList();
  }, [aHId]);

  useMemo(() => {
    const params = new URLSearchParams({
      aHId: aHId,
      assetId: assetId,
    });
    setSearchParams(params);
  }, [aHId, assetId]);

  useMemo(() => {
    if (location.pathname !== currentPath) {
      if (
        currentPath?.includes("energy") ||
        location?.pathname?.includes("energy")
      ) {
        getAssetList();
      }

      setCurrentPath(location.pathname);
    }
  }, [location]);

  const handleAssetChange = (value) => {
    form.setFieldValue("assetId", value);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          // maxWidth: 1240,
          // margin: "0 auto",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 10px",
            // height: 60,
          }}
        >
          <Row align="middle" gutter={[40, 40]}>
            <Col md={4}>
              <Form layout="inline" form={form}>
                <Space split="/">
                  <div>
                    <Form.Item name="aHId">
                      <TreeSelect
                        treeData={entityOption}
                        style={{ width: 200 }}
                        dropdownStyle={{
                          minWidth: 350,
                        }}
                        treeDefaultExpandAll
                      />
                    </Form.Item>
                    <Form.Item name="assetId" hidden>
                      <Input />
                    </Form.Item>
                  </div>
                </Space>
              </Form>
            </Col>
            <Col md={20}>
              <div className="machine-list">
                {assetList.length !== 0 ? (
                  <div style={{ width: "100%" }}>
                    <StyledCardSlider {...settings}>
                      {assetList.map((item) => (
                        <div>
                          <Tooltip title={item.label}>
                            <div
                              key={item.value}
                              className={`asset-card ${
                                assetId === item.value ? "selected" : ""
                              }`}
                              onClick={() => handleAssetChange(item.value)}
                            >
                              <Image
                                preview={false}
                                className="asset-card-image"
                                src={`/051223.svg`}
                              />

                              <Typography.Text
                                ellipsis
                                style={{
                                  fontSize: "inherit",
                                  color: "inherit",
                                }}
                              >
                                {item.label}
                              </Typography.Text>
                            </div>
                          </Tooltip>
                        </div>
                      ))}
                    </StyledCardSlider>
                  </div>
                ) : (
                  <Typography.Text type="secondary">No Data</Typography.Text>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      {assetId ? (
        <Outlet />
      ) : (
        <Typography.Text type="danger">Please select asset</Typography.Text>
      )}
    </>
  );
}

export default MainLayout;
