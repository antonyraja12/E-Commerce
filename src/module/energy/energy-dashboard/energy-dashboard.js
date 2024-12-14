import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Row,
	Select,
	Space,
	Spin,
	Table,
	TreeSelect,
	Typography,
} from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import BarChart from "../../../component/BarChart";
import DateTabs from "../../../helpers/data";
import { dateFormat } from "../../../helpers/date-format";
import ContinentService from "../../../services/continent-service";
import CountryService from "../../../services/country-service";
import EnergyConsumptionDashboardService from "../../../services/energy-services/energy-consumption-dashboard-service";
import EnergyDetailDashboardService from "../../../services/energy-services/energy-detail-dashboard-service";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
const { Text, Title } = Typography;
// const style = {
// 	formItem: {
// 		minWidth: "120px",
// 	},
// };
// const gridStyle = {
// 	width: "100%",
// 	textAlign: "center",
// };

class EnergyDashboard extends FilterFunctions {
	state = { isLoading: false, assetId: null };
	service = new EnergyConsumptionDashboardService();
	filterfunctionsservice = new FilterFunctions();
	continentService = new ContinentService();
	countryService = new CountryService();
	assetWiseService = new EnergyDetailDashboardService();
	componentDidMount() {
		this.loadAppHierarchy();
		this.getAssetList();

		let assetId = this.props.searchParams.get("assetId");

		if (assetId) {
			setTimeout(() => {
				this.props.form?.setFieldValue("assetId", Number(assetId));
				this.props.form?.submit();
				this.setState({ assetId: assetId });
			}, 500);
		}
	}
	loadAppHierarchy = () => {
		this.appHierarchyService
			.list()
			.then(({ data }) => {
				console.log("this.appHierarchyService.convertToSelectTree(data)", data);
				this.setState((state) => ({
					...state,
					parentTreeList: this.appHierarchyService.convertToSelectTree(data),
				}));
			})
			.finally(({ data }) => {
				this.props.form.setFieldsValue({
					ahid: this.appHierarchyService.convertToSelectTree(data)[0].value,
				});
			})
			.catch((error) => {
				console.error("Failed to load app hierarchy:", error);
			});
	};
	getAssetList(ahid) {
		this.setState((state, props) => ({
			...state,
			isAssetListLoading: true,
			assetList: [],
		}));
		this.assetService
			.list({
				active: true,
				published: true,
				ahid: ahid,
				assetCategory: 2,
			})
			.then((response) => {
				this.setState((state, props) => ({
					...state,
					assetList: response.data?.map((e) => ({
						label: e.assetName,
						value: e.assetId,
					})),
				}));
			})
			.finally(() => {
				this.setState((state, props) => ({
					...state,
					isAssetListLoading: false,
				}));
			});
	}
	handleDateTabsModeChange = (mode) => {
		this.setState({ mode }, () => {
			this.props.form.submit();
		});
	};
	setDatefield = (v) => {
		this.props?.form.setFieldsValue({
			startDate: new Date(v.startDate),
			endDate: new Date(v.endDate),
		});
		this.setState((state) => state);
	};
	setAssetId = (assetId) => {
		this.setState({ assetId: assetId });
	};
	search = (data = {}) => {
		this.setState((state) => ({ ...state, isLoading: true }));
		let obj = { ...data };
		if (obj.mode === 5) {
			obj.fromDate = moment(data.dateRange[0]).format("YYYY-MM-DD");
			obj.toDate = moment(data.dateRange[1]).format("YYYY-MM-DD");
		}
		delete obj.dateRange;

		this.service
			.getEnergyData(data)
			.then(({ data }) => {
				// console.log("data", data);
				this.setState((state) => ({
					...state,
					energyTable: data,
					todaysEnergyConsumption: data[data.length - 1]?.todayConsumption,
					monthsEnergyConsumption: data[data.length - 1]?.monthConsumption,
					cumulativeEnergy: data[data.length - 1]?.cumulativeConsumption,
					energyConsumption: {
						name: "Consumption",
						data: data?.map((e) => ({
							x: e.timestamp,
							y: e.todayConsumption,
						})),
					},
				}));
			})
			.finally(() => {
				this.setState((state) => ({ ...state, isLoading: false }));
			});
	};
	columns = [
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			align: "left",
			width: 100,
			render: (value) => {
				return dateFormat(value);
			},
		},
		{
			dataIndex: "todayConsumption",
			key: "todayConsumption",
			title: "Energy Consumption (KWh)",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: "Month Consumption (kWh)",
			align: "left",
			render: (value) => {
				return value;
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: "Cumulative Energy (KWh)",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
	];

	render() {
		console.log("stausnnfme", this.state.parentTreeList);
		const length = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		return (
			<Page
				title='Energy Dashboard'
				filter={
					<Form
						size='small'
						onFinish={this.search}
						form={this.props.form}
						// initialValues={{ mode: 2 }}
					>
						<Row gutter={[10, 10]}>
							<Form.Item name='startDate' hidden></Form.Item>
							<Form.Item name='endDate' hidden></Form.Item>
							<Col lg={4}>
								<Form.Item name='ahid' style={{ minWidth: "150px" }}>
									<TreeSelect
										onChange={(v) => this.getAssetList(v)}
										showSearch
										loading={this.state.isparentTreeListLoading}
										placeholder='Site'
										treeData={this.state.parentTreeList}
									></TreeSelect>
								</Form.Item>
							</Col>
							<Col lg={4}>
								<Form.Item name='assetId'>
									<Select
										showSearch
										loading={this.state.isAssetListLoading}
										placeholder='Asset'
										allowClear
										options={this.state.assetList}
										onChange={this.setAssetId}
									></Select>
								</Form.Item>
							</Col>
							{/* <DateFilter /> */}
							<Col lg={5}>
								{/* <Space> */}
								<DateTabs
									change={(data) => this.setDatefield(data)}
									onChangeMode={this.handleDateTabsModeChange}
								/>
							</Col>
							<Col>
								<Space>
									<Button
										type='primary'
										htmlType='submit'
										icon={<SearchOutlined />}
									>
										Go
									</Button>

									<Link to={`../live-monitoring?assetId=${this.state.assetId}`}>
										<Button
											type='primary'
											icon={<FontAwesomeIcon icon='fa-solid fa-chart-line' />}
										>
											&nbsp; Live
										</Button>
									</Link>
									<Link to={`../reports?assetId=${this.state.assetId}`}>
										<Button
											type='primary'
											icon={<FontAwesomeIcon icon='fa-solid fa-chart-line' />}
										>
											&nbsp; Reports
										</Button>
									</Link>
									{/* </Space> */}
								</Space>
							</Col>
						</Row>
					</Form>
				}
			>
				<Spin spinning={this.state.isLoading}>
					<Row gutter={[10, 10]}>
						<Col sm={8} md={7} lg={6}>
							<Space
								size={10}
								direction='vertical'
								// size="middle"
								style={{
									display: "flex",
								}}
							>
								<Card>
									<Card.Meta
										avatar={
											<Avatar
												shape='square'
												size={70}
												style={{
													backgroundColor: "#f56a00",
													verticalAlign: "middle",
												}}
												icon={<CalendarOutlined />}
											/>
										}
										title={
											<Title level={2} style={{ marginBottom: 0 }}>
												{Number(
													this.state.todaysEnergyConsumption ?? 0
												).toFixed(2)}{" "}
												KWh
											</Title>
										}
										description="Today's Consumption"
									></Card.Meta>
								</Card>
								<Card>
									<Card.Meta
										avatar={
											<Avatar
												shape='square'
												size={70}
												style={{
													backgroundColor: "#7265e6",
													verticalAlign: "middle",
												}}
												icon={<CalendarOutlined />}
											/>
										}
										title={
											<Title level={2} style={{ marginBottom: 0 }}>
												{Number(
													this.state.monthsEnergyConsumption ?? 0
												)?.toFixed(2)}{" "}
												KWh
											</Title>
										}
										description='Month Consumption'
									></Card.Meta>
								</Card>
								<Card>
									<Card.Meta
										avatar={
											<Avatar
												shape='square'
												size={70}
												style={{
													backgroundColor: "#ffbf00",
													verticalAlign: "middle",
												}}
												icon={<CalendarOutlined />}
											/>
										}
										title={
											<Title level={2} style={{ marginBottom: 0 }}>
												{Number(this.state.cumulativeEnergy ?? 0)?.toFixed(2)}{" "}
												KWh
											</Title>
										}
										description='Cumulative Consumption'
									></Card.Meta>
								</Card>
							</Space>
						</Col>
						<Col sm={8} md={7} lg={3}>
							{/* Outer Card */}
							<Card style={{ height: "355px", overflowY: "auto" }}>
								{length?.map((e) => (
									<Row style={{ marginLeft: "-15px", marginTop: "-16px" }}>
										{/* <Row style={{ padding: 0, overflow: "hidden" }}> */}
										<Space direction='vertical'>
											<Col lg={24}>
												<Avatar
													shape='square'
													size={30}
													style={{
														backgroundColor: "#7265E6",
														verticalAlign: "center",
													}}
													icon={<CalendarOutlined />}
												/>
											</Col>
											<Col lg={24}>
												<Text>{`Shift ${e}`}</Text>
											</Col>
											<Col>
												<Title level={5} style={{ color: "#2C4A88" }}>
													{Number(this.state.cumulativeEnergy ?? 0)?.toFixed(2)}{" "}
													<Text strong>KWh</Text>
												</Title>
											</Col>
										</Space>
										<Divider style={{ marginTop: "10px", width: "20px" }} />
									</Row>
								))}
							</Card>
						</Col>
						<Col sm={16} md={17} lg={15}>
							<Col lg={24}>
								{/* <Space direction="vertical"> */}
								<Card
									bodyStyle={{
										padding: 0,
										overflow: "hidden",
									}}
								>
									<Col lg={24}>
										<Title level={5}>Energy Consumption - Daily </Title>
									</Col>
									<Col>
										<Table
											style={{ height: "140px" }}
											scroll={{ y: 105 }}
											dataSource={this.state.energyTable}
											columns={this.columns}
											size='small'
											pagination={false}
										/>
									</Col>
								</Card>
								<Divider style={{ margin: 4 }} />
								<Card
									bodyStyle={{
										padding: 0,
										overflow: "hidden",
									}}
								>
									<Col lg={24}>
										<Title level={5}>Energy Consumption - Daily </Title>
									</Col>
									<Col>
										<Table
											style={{ height: "140px" }}
											scroll={{ y: 105 }}
											dataSource={this.state.energyTable}
											columns={this.columns}
											size='small'
											pagination={false}
										/>
									</Col>
								</Card>
								{/* </Space> */}
							</Col>

							{/* <Card>
                
              </Card> */}
						</Col>

						<Col sm={24}>
							<Row gutter={[5, 5]}>
								<Col lg={24}>
									<Card title={"Energy Consumption - Daily"}>
										<BarChart
											series={this.state.energyConsumption?.data}
											horizontal={false}
										/>
									</Card>
								</Col>
							</Row>
						</Col>
					</Row>
				</Spin>
			</Page>
		);
	}
}

export default withRouter(withForm(EnergyDashboard));
