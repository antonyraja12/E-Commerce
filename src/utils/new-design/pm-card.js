import { ArrowRightOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { GrVmMaintenance } from "react-icons/gr";
import { IoTicket } from "react-icons/io5";
import { Link } from "react-router-dom";
import WorkOrderResolutionService from "../../services/preventive-maintenance-services/workorder-resolution-service";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";
function PmCard({ startDate, endDate, aHId, length }) {
	const [pmData, setpmData] = useState(null);
	const pmservice = new WorkOrderResolutionService();

	const fetchData = () => {
		return pmservice
			.getbyOverallpm(startDate, endDate, aHId)
			.then((response) => {
				setpmData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching OEE data:", error);
			});
	};
	useMemo(() => {
		if (aHId && endDate && startDate) fetchData();
	}, [startDate, endDate, aHId]);
	return (
		<CommonCard
			length={length}
			// title="Preventive Maintenance"
			title={
				<Row justify='space-between' align='middle'>
					<Col>
						<Typography.Title level={5}>
							Preventive Maintenance
						</Typography.Title>
					</Col>
					<Col>
						<Link to='../pm/dashboard'>
							<ArrowRightOutlined
								style={{ fontSize: "1em", width: "3em" }}
							/>
						</Link>
					</Col>
				</Row>
			}
			icon={<GrVmMaintenance style={iconStyle} />}
			link='./machine/pm'
			iconBg='linear-gradient(135deg,#8ed6ff, #17afd0)'
			content={[
				{
					title: "Ticket Count",
					icon: <IoTicket style={{ color: "#b816c6" }} />,
					value: pmData?.PmTotalCount ?? 0,
				},
				{
					title: "Tickets Resolved",
					icon: (
						<FiArrowUpRight
							style={{ color: "#6ab13f", fontSize: "1.5em" }}
						/>
					),
					value: pmData?.PmResolve ?? 0,
				},
				{
					title: "Tickets Completed",
					icon: (
						<FiArrowDownLeft
							style={{ color: "#f84343", fontSize: "1.5em" }}
						/>
					),
					value: pmData?.PmYetResolve ?? 0,
				},
			]}
		/>
	);
}

export default PmCard;
