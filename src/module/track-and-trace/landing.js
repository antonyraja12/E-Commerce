import { Card, Layout, Typography } from "antd";
import { FaTimeline } from "react-icons/fa6";
import { LiaIndustrySolid } from "react-icons/lia";
import { MdDevicesOther, MdLaptopMac } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./landing.css";

import { BsTools } from "react-icons/bs";
import { GoChecklist } from "react-icons/go";
import { MdOutlineShoppingCart } from "react-icons/md";
import { RiFlowChart } from "react-icons/ri";
import { CgScreen } from "react-icons/cg";
import { DisconnectOutlined, FileExclamationOutlined } from "@ant-design/icons";
function Landing() {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(link);
  };
  return (
    <Layout.Content>
      {/* <Typography.Title>Assembly Line</Typography.Title> */}
      <Card className="card-container">
        {/* <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./line-master")}
        >
          <div>
            <FaTimeline className="board-icon" />
          </div>
          <div className="board-name">Line Master</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./device-type")}
        >
          <div>
            <MdDevicesOther className="board-icon" />
          </div>
          <div className="board-name">Device Type</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./device")}
        >
          <div>
            <MdLaptopMac className="board-icon" />
          </div>
          <div className="board-name">Device</div>
        </Card.Grid> */}
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./product")}
        >
          <div>
            <MdOutlineShoppingCart className="board-icon" />
          </div>
          <div className="board-name">Product</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./work-station")}
        >
          <div>
            <LiaIndustrySolid className="board-icon" />
          </div>
          <div className="board-name">Workstation</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./work-instruction")}
        >
          <div>
            <RiFlowChart className="board-icon" />
          </div>
          <div className="board-name">WorkInstruction</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./job-order")}
        >
          <div>
            <BsTools className="board-icon" />
          </div>
          <div className="board-name">Job Order</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./defect-checklist")}
        >
          <div>
            <GoChecklist className="board-icon" />
          </div>
          <div className="board-name">Defect Checklist</div>
        </Card.Grid>
        <Card.Grid
          className="grid-style"
          onClick={() => handleNavigate("./loss-reason")}
        >
          <div>
            <FileExclamationOutlined className="board-icon" />
          </div>
          <div className="board-name">Loss Reason</div>
        </Card.Grid>
      </Card>
    </Layout.Content>
  );
}

export default Landing;
