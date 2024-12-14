import { Card, ConfigProvider, Form, Radio, Typography } from "antd";
import { useEffect, useState } from "react";
import AssemblyReworkSubService from "../../../services/track-and-trace-service/assembly-rework-sub-service";

import { useParams } from "react-router-dom";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";

function ReworkCard(props) {
  const { id } = useParams();
  const service = new AssemblyReworkSubService();
  const [form] = Form.useForm();
  const [defectStatus, setDefectStatus] = useState("NG");

  useEffect(() => {
    form.setFieldsValue({
      ...props,
      defectStatus: "NG",
    });
    setDefectStatus(props.qualityResult?.defectStatus || "NG");
  }, []);

  const onChange = (e) => {
    const newStatus = e.target.value;
    setDefectStatus(newStatus);
    const service = new WorkStationInstanceService();
    service
      .callService(id, "acknowledgeDefect", {
        value: {
          defectStatus: e.target.value,
          qaId: props.qaId,
        },
      })
      .then((data) => {});
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Badge: {
            statusSize: 10,
            textFontSize: 8,
            textFontSizeSM: 8,
          },
          // Card: {
          //   actionsBg: "#ff5722d6",
          // },
          // Radio: {
          //   // buttonBg: "#ffffff",
          //   // buttonCheckedBg: "#ffffff",
          // },
        },
        // token: {
        //   fontSize: 16,
        //   colorBgContainer: "#1C1E44",
        //   colorBgLayout: "#292A51",

        //   Layout: {
        //     headerBg: "#1C1E44",
        //     headerPadding: 0,
        //   },
        //   colorErrorBg: "#ff4d4f",
        //   Badge: {
        //     fontSize: 12,
        //   },
        // },
      }}
    >
      <Card
        size="small"
        style={{
          backgroundColor: defectStatus === "OK" ? "#53c41aa7" : "#ff4d4f",
        }}
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            height: 120,
          },
        }}
      >
        <div style={{ flex: "1 1 auto" }}>
          <Typography.Paragraph>{props.defectName}</Typography.Paragraph>
        </div>

        <Radio.Group
          block
          optionType="button"
          buttonStyle="solid"
          value={defectStatus}
          // size="small"
          options={[
            { label: "OK", value: "OK" },
            { label: "NG", value: "NG" },
          ]}
          onChange={onChange}
        />
      </Card>
    </ConfigProvider>
  );
}

export default ReworkCard;
