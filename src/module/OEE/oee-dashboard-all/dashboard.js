import { DisconnectOutlined } from "@ant-design/icons";
import {
	Avatar,
	Card,
	Col,
	Divider,
	Flex,
	Form,
	Progress,
	Row,
	Space,
	Spin,
	Statistic,
	TreeSelect,
	Typography,
} from "antd";

import { RxValueNone } from "react-icons/rx";
import { Link } from "react-router-dom";

import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../services/asset-service";
import OeeCalculationService from "../../../services/oee-calculation-service";
import MachineStatusService from "../../../services/oee/machine-status-service";

import Page from "../../../utils/page/page";
import PageForm from "../../../utils/page/page-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

class OeeDashboardNew extends PageForm {
	constructor(props) {
		super(props);
		this.state = {
			selectedOrganization: null,
			assets: [],
			refreshInterval: 2000,
			totalPartCount: 0,
			acceptedPartCount: 0,
			rejectedPartCount: 0,
			isRunning: false,
			liveOEEPercentage: 0,
			isLoading: false,
			isParentLoading: false,
			parentTreeList: [],
			ahId: null,
		};
		this.service = new AppHierarchyService();
		this.oeeservice = new OeeCalculationService();
		this.assetService = new AssetService();
		this.machineStatusService = new MachineStatusService();
	}

	async componentDidMount() {
		try {
			await this.getAppHierarchyList();
			const initialOrganization = this.state.parentTreeList?.[0]?.value;
			if (initialOrganization) {
				this.setHierarchyName(initialOrganization);
				this.props.form?.setFieldValue("ahName", initialOrganization);
			}
		} catch (error) {
			console.error("Error fetching hierarchy list:", error);
		}

		this.refreshIntervalId = setInterval(() => {
			this.handleAutoRefresh();
		}, this.state.refreshInterval);
	}

	componentWillUnmount() {
		if (this.refreshIntervalId) {
			clearInterval(this.refreshIntervalId);
		}
	}

	setHierarchyName = async (value) => {
		if (!value) return;
		this.setState({ selectedOrganization: value, ahId: value });

		let ahId = Number(value);
		if (!ahId || isNaN(ahId)) {
			console.log("ahId is NaN");
			return;
		}

		this.setState({ isLoading: true });
		try {
			const { data } = await this.oeeservice.getbyahId(ahId);
			this.setState({ assets: data, isLoading: false });
		} catch (error) {
			console.error("Error fetching data:", error);
			this.setState({ isLoading: false });
		}
	};

	getAppHierarchyList() {
		return new Promise((resolve, reject) => {
			this.setState({ isParentLoading: true });
			this.service
				.list()
				.then(({ data }) => {
					const parentTreeList = this.service.convertToSelectTree(data);
					this.setState({ parentTreeList }, resolve);
				})
				.catch((error) => {
					console.error("Error fetching hierarchy list:", error);
					reject(error);
				})
				.finally(() => {
					this.setState({ isParentLoading: false });
				});
		});
	}

	render() {
		const { isLoading, assets, ahId } = this.state;

		const getProgressBarColor = (percentage) => {
			if (percentage >= 0 && percentage <= 50) return "#FF5353";
			if (percentage <= 80) return "#FFD600";
			return "#33D04C";
		};
		const valueStyle = {
			fontSize: "1.1em",
			color: "#0F1A35",
			fontWeight: 400,
		};

		const sortedAssets = Array.isArray(assets)
			? assets.sort((a, b) => a.assetName.localeCompare(b.assetName))
			: [];
		// Map the sorted assets to asset cards
		const assetCards = sortedAssets.map((asset) => {
			const oee = asset.oee;
			const availability = asset.availability;
			const performance = asset.performance;
			const quality = asset.quality;
			const assetId = asset.assetId;
			const assetColor = asset.color;

			const isAvatarColor = ["#33D04C", "#FF5353"].includes(assetColor);
			const isYellowColor = assetColor === "yellow";
			const oeeProgressBarColor = getProgressBarColor(oee);
			const qualityProgressBarColor = getProgressBarColor(quality);
			const performanceProgressBarColor = getProgressBarColor(performance);
			const availabilityProgressBarColor = getProgressBarColor(availability);

			const statusIndicator = () => {
				return isAvatarColor ? (
					<Avatar
						size={15}
						style={{
							backgroundColor: assetColor,
							display: "flex",
							alignItems: "center",
						}}
					/>
				) : isYellowColor ? (
					<Typography.Text>
						<DisconnectOutlined />
					</Typography.Text>
				) : (
					<Typography.Text>
						<RxValueNone
							style={{
								color: "orange",
								fontSize: "15px",
							}}
						/>
					</Typography.Text>
				);
			};

			const renderValueWithUnits = (value, unit) => (
				<>
					{value}{" "}
					<Typography.Text
						style={{ fontWeight: 400, color: "#0F1A35", fontSize: ".8em" }}
					>
						{unit}
					</Typography.Text>
				</>
			);

			const ProgressItem = ({ label, percent, strokeColor }) => (
				<Space>
					<Typography.Text
						style={{
							fontFamily: "Inter",
							fontWeight: 400,
							color: "#8B908F",
							fontSize: "14px",
						}}
					>
						{label}
					</Typography.Text>
					<Progress
						percent={percent}
						size='small'
						style={{ width: 90 }}
						strokeColor={strokeColor}
					/>
				</Space>
			);

			// Data array for progress items
			const progressItems = [
				{
					label: "A",
					percent: availability,
					strokeColor: availabilityProgressBarColor,
				},
				{
					label: "P",
					percent: performance,
					strokeColor: performanceProgressBarColor,
				},
				{ label: "Q", percent: quality, strokeColor: qualityProgressBarColor },
			];

			return (
				<>
					<Col xs={24} sm={12} md={8} lg={6} key={`asset${assetId}`}>
						<Link
							to={`/oee/machine-detail-dashboard?ahId=${ahId}&assetId=${asset?.assetId}`}
						>
							<Card
								title={
									<Typography.Title level={5} style={{ marginBottom: "0px" }}>
										{asset.assetName}
									</Typography.Title>
								}
								extra={statusIndicator()}
								bodyStyle={{
									padding: "1px 0px 0px 0px",
								}}
								headStyle={{
									border: "none",
									padding: "0px 12px 0px 12px",
									minHeight: "42px",
								}}
								style={{
									width: "100%",
									borderRadius: "10px",
									boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
								}}
							>
								<Row
									align='middle'
									style={{ paddingLeft: "12px", marginBottom: "6px" }}
								>
									<Typography.Text style={{ fontSize: "12px" }}>
										Current Model: {asset.currentModel}
									</Typography.Text>
								</Row>
								<Row justify='space-between' align='middle'>
									<Col span={12}>
										<Flex justify='space-evenly' align='center'>
											<Progress
												percent={oee}
												size={70}
												type='circle'
												strokeWidth={12}
												strokeColor={oeeProgressBarColor}
											/>
											<Typography.Text
												style={{
													fontWeight: 500,
													color: "#8B908F",
												}}
											>
												OEE
											</Typography.Text>
										</Flex>
									</Col>
									<Col span={12}>
										<Flex vertical align='center'>
											{progressItems.map((item, index) => (
												<ProgressItem
													key={index}
													label={item.label}
													percent={item.percent}
													strokeColor={item.strokeColor}
												/>
											))}
										</Flex>
									</Col>
								</Row>
								<Row
									justify='space-evenly'
									align='middle'
									style={{
										background: "#fafafa",
										borderRadius: "0px 0px 10px 10px",
									}}
								>
									<Statistic
										title='Part Count'
										value={asset.totalPartCount}
										valueStyle={valueStyle}
									/>
									<Divider type='vertical' />
									<Statistic
										title='Runtime'
										value={asset.runTime}
										valueStyle={valueStyle}
										valueRender={(value) => renderValueWithUnits(value, "mins")}
									/>
									<Divider type='vertical' />
									<Statistic
										title='Downtime'
										value={asset.downTime}
										valueStyle={valueStyle}
										valueRender={(value) => renderValueWithUnits(value, "mins")}
									/>
								</Row>
							</Card>
						</Link>
					</Col>
				</>
			);
		});

		return this.props.isLoading ? (
			<Spin style={{ marginTop: "250px", marginLeft: "600px" }} />
		) : (
			<Spin spinning={this.props?.isLoading}>
				<Page title='Dashboard'>
					<Spin spinning={isLoading}>
						<>
							<Row gutter={16} justify='center'>
								<Col xs={24} sm={12} md={12} lg={6} xl={6}>
									<Form form={this.props.form}>
										<Space>
											<Form.Item name='ahName'>
												<TreeSelect
													showSearch
													style={{ width: "250px" }}
													placeholder='Organization'
													treeDefaultExpandAll={false}
													treeData={this.state.parentTreeList}
													onChange={this.setHierarchyName}
												/>
											</Form.Item>
										</Space>
									</Form>
								</Col>
								<Col xs={24} sm={12} md={12} lg={18} xl={18}>
									<div className='status'>
										<Space size='middle'>
											<div className='status-item'>
												<div className='status-indicator running'></div>
												Running
											</div>
											<div className='status-item'>
												<div className='status-indicator empty'></div>
												Downtime
											</div>
											<div className='status-item'>
												<div className='status-icon'>
													<DisconnectOutlined /> Connection Lost
												</div>
											</div>
											<div className='status-item'>
												<RxValueNone
													style={{
														color: "orange",
														fontSize: "15px",
														marginRight: "5px",
													}}
												/>
												No Shift
											</div>
										</Space>
									</div>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8} xl={8}></Col>
							</Row>
						</>
						<div>
							<Row gutter={[12, 12]}>{assetCards}</Row>
						</div>
					</Spin>
				</Page>
			</Spin>
		);
	}
}

export default withRouter(withAuthorization(withForm(OeeDashboardNew)));
