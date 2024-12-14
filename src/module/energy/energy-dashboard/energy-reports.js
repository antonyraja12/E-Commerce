import {
	DownloadOutlined,
	SearchOutlined,
	FilePdfOutlined,
	FileExcelOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	Dropdown,
	Form,
	Menu,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tooltip,
	TreeSelect,
	Typography,
} from "antd";
import dayjs from "dayjs";
import excelExport from "../../../helpers/excel-export";
import moment from "moment";
import { CSVLink } from "react-csv";
import BarChart from "../../../component/BarChart";
import TimeSeriesGraph from "../../../component/TimeSeriesGraph";
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
import downloadPdf from "./pdf-generator";
import React from "react";
import { withAuthorization } from "../../../utils/with-authorization";
const style = {
	formItem: {
		minWidth: "120px",
	},
};

const { Text, Title } = Typography;

class EnergyReports extends FilterFunctions {
	state = {
		isLoading: false,
		assetId: this.props.searchParams.get("assetId"),
		isDateTabsOpen: false,
	};
	service = new EnergyConsumptionDashboardService();
	filterfunctionsservice = new FilterFunctions();
	continentService = new ContinentService();
	countryService = new CountryService();
	assetWiseService = new EnergyDetailDashboardService();
	componentDidMount() {
		const assetId = this.props.searchParams.get("assetId");
		if (assetId !== "null" && assetId !== "undefined" && assetId) {
			this.props.form.setFieldsValue({
				startDate: dayjs().startOf("day").toISOString(),
				endDate: dayjs().endOf("day").toISOString(),
			});
		}
		this.loadAppHierarchy();
	}
	constructor(props) {
		super(props);
		this.ref = React.createRef();
		this.state = {
			shiftWiseData: [],
			dailyWiseData: [],
			graphShow: false,
		};
	}
	handlePDFDownload = () => {
		downloadPdf({
			title: "Dailwise Energy Report - PDF",
			columns: this.excelSheet,
			data: this.state.dailyWiseData,
			// currentUser: this.state.currentUserList[0].value,
		});
	};
	handlePDFDownload2 = () => {
		downloadPdf({
			title: "Shiftwise Energy Report - PDF",
			columns: this.excelSheet2,
			data: this.state.shiftWiseData,
			// currentUser: this.state.currentUserList[0].value,
		});
	};
	handleExcelDownload = async () => {
		try {
			const buffer = await excelExport({
				title: "Dailywise Energy Report - Excel",
				columns: this.excelSheet,
				data: this.state.dailyWiseData,
				// currentUser: this.state.currentUserList[0].value,
			});

			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Dailywise Energy Report.xlsx`;
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting Excel:", error);
		}
	};
	handleExcelDownload2 = async () => {
		try {
			const buffer = await excelExport({
				title: "Shiftwise Energy Report - Excel",
				columns: this.excelSheet2,
				data: this.state.shiftWiseData,
				// currentUser: this.state.currentUserList[0].value,
			});

			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Shiftwise Energy Report.xlsx`;
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting Excel:", error);
		}
	};
	loadAppHierarchy = () => {
		this.appHierarchyService
			.list()
			.then(({ data }) => {
				console.log(data, "dataconverttree");
				this.setState((state) => ({
					...state,
					parentTreeList: this.appHierarchyService.convertToSelectTree(data),
				}));
				this.getAssetList(
					this.appHierarchyService.convertToSelectTree(data)[0].value
				);
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
				// published: true,
				aHId: ahid,
				assetCategory: 2,
			})
			.then((response) => {
				console.log(response, "responseassteid");
				this.setState((state, props) => ({
					...state,
					assetList: response.data?.map((e) => ({
						label: e.assetName,
						value: e.assetId,
					})),
				}));
				this.props.form.setFieldsValue({
					assetId: response.data.length ? response.data[0].assetId : null,
					ahid: ahid,
				});
			})
			.finally(() => {
				this.setState((state, props) => ({
					...state,
					isAssetListLoading: false,
				}));
				setTimeout(() => {
					if (this.props.form.getFieldValue("assetId")) {
						this.props.form?.submit();
					}
				}, 500);
			});
	}
	executeSearch = (data) => {
		this.setState((state) => ({ ...state, isLoading: true }));
		// console.log(data, "data111");
		this.service
			.getLiveMonitoringData(data)
			.then(({ data }) => {
				console.log(data, "datameterreading");
				let obj = {
					values: {
						c1: [],
						c2: [],
						c3: [],
						v1: [],
						v2: [],
						v3: [],
						l1: [],
						l2: [],
						l3: [],
						pf1: [],
						pf2: [],
						pf3: [],
					},
				};
				const rows = data ?? [];
				console.log(data, "rowsssdata");
				console.log(obj, "objdata");

				for (let x of rows) {
					let ts = new Date(x.timestamp);
					obj.values.c1.push({ x: ts, y: x.A1 });
					obj.values.c2.push({ x: ts, y: x.A2 });
					obj.values.c3.push({ x: ts, y: x.A3 });
					obj.values.v1.push({ x: ts, y: x.V1 });
					obj.values.v2.push({ x: ts, y: x.V2 });
					obj.values.v3.push({ x: ts, y: x.V3 });
					obj.values.l1.push({ x: ts, y: x.L1 });
					obj.values.l2.push({ x: ts, y: x.L2 });
					obj.values.l3.push({ x: ts, y: x.L3 });
					obj.values.pf1.push({ x: ts, y: x.PF1 });
					obj.values.pf2.push({ x: ts, y: x.PF2 });
					obj.values.pf3.push({ x: ts, y: x.PF3 });
				}
				this.setState((state) => ({
					...state,
					current: [
						{
							name: "Phase 1",
							data: obj.values.c1,
						},
						{
							name: "Phase 2",
							data: obj.values.c2,
						},
						{
							name: "Phase 3",
							data: obj.values.c3,
						},
					],
					voltage: [
						{
							name: "Phase 1",
							data: obj.values.v1,
						},
						{
							name: "Phase 2",
							data: obj.values.v2,
						},
						{
							name: "Phase 3",
							data: obj.values.v3,
						},
					],
					load: [
						{
							name: "Phase 1",
							data: obj.values.l1,
						},
						{
							name: "Phase 2",
							data: obj.values.l2,
						},
						{
							name: "Phase 3",
							data: obj.values.l3,
						},
					],
					powerFactor: [
						{
							name: "Phase 1",
							data: obj.values.pf1,
						},
						{
							name: "Phase 2",
							data: obj.values.pf2,
						},
						{
							name: "Phase 3",
							data: obj.values.pf3,
						},
					],
				}));
			})
			.finally(() => {
				this.setState((state) => ({ ...state, isLoading: false }));
			})
			.catch((error) => {
				console.log(error);
			});
	};
	onBarClick = (config) => {
		this.getBarData({
			startDate: new Date(
				this.state.barData[config.dataPointIndex].x
			).toISOString(),
			endDate: new Date(
				this.state.barData[config.dataPointIndex].z
			).toISOString(),
			assetId: this.props.form.getFieldValue("assetId"),
		});
	};
	handleDateTabsModeChange = (mode) => {
		// Update the 'mode' state in MainDashboard
		this.setState({ mode }, () => {
			if (this.props.form.getFieldValue("assetId")) {
				this.props.form?.submit();
			}
		});
	};
	setDatefield = (v) => {
		// console.log("date", v);
		this.props?.form.setFieldsValue({
			startDate: new Date(v.startDate),
			endDate: new Date(v.endDate),
		});
		this.setState((state) => state);
	};
	setAssetId = (assetId) => {
		this.setState({ assetId: assetId });
	};
	toISOString = (date) => {
		return dayjs(dayjs(date).toISOString()).format("DD-MM-YY HH:mm");
	};
	getBarData = (mainData) => {
		console.log(mainData, "maindayta1");
		this.setState((state) => ({ ...state, isLoading: true }));
		this.service
			.getBarGraphData(mainData)
			.then(({ data }) => {
				console.log("datalength", data);
				if (data.length) {
					console.log("length1");
					this.setState((state) => ({
						...state,
						barData: data?.map((e) => ({
							x: e.x,
							y: e.y,
							z: e.z,
							name: e.name,
						})),
					}));
				} else {
					console.log("length2");
					console.log(mainData, "maindataexecutesearch");
					this.setState((state) => ({ ...state, graphShow: true }));
					setTimeout(() => {
						window.scrollTo({
							top: this.ref.current.offsetTop,
							behavior: "smooth",
						});
						this.executeSearch(mainData);
					}, 500);
				}
			})
			.finally(() => {
				this.setState((state) => ({ ...state, isLoading: false }));
			});
	};

	search = (data) => {
		this.setState((state) => ({ ...state, isLoading: true }));
		let obj = { ...data };
		if (obj.mode === 1) {
			this.setState({ graphShow: true });
		} else {
			this.setState({ graphShow: false });
		}
		if (obj.mode === 5) {
			obj.fromDate = moment(data.dateRange[0]).format("YYYY-MM-DD");
			obj.toDate = moment(data.dateRange[1]).format("YYYY-MM-DD");
		}
		delete obj.dateRange;
		this.getBarData(data);
		this.service.getEnergyData(data).then(({ data }) => {
			this.setState((state) => ({ ...state, dailyWiseData: data }));
		});
		this.service.getEnergyDataShiftWise(data).then(({ data }) => {
			this.setState((state) => ({ ...state, shiftWiseData: data }));
		});
	};
	excelSheet = [
		{
			title: "S.No",
			key: "assetIds",
			dataIndex: "assetIds",
			width: 10,
			fixed: "center",
			render: (value, record, index) => {
				return index + 1;
			},
		},
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			width: 10,
			align: "center",
			render: (value) => {
				return value ? moment(value).format("DDDD") : "-";
			},
		},

		{
			dataIndex: "todayConsumption",
			key: "todayConsumption",
			title: "Today's Consumption (kWh)",
			align: "left",
			width: 50,
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: "Month's Consumption (kWh)",
			align: "center",
			width: 40,
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: "Cumulative Consumption",
			align: "left",
			width: 40,
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
	];
	excelSheet2 = [
		{
			title: "S.No",
			key: "assetIds",
			dataIndex: "assetIds",
			width: 10,
			fixed: "center",
			render: (value, record, index) => {
				return index + 1;
			},
		},
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			width: 10,
			align: "center",
			render: (value) => {
				return value ? moment(value).format("DDDD") : "-";
			},
		},
		{
			dataIndex: "shiftName",
			key: "shiftName",
			title: "Shift",
			align: "left",
			render: (value) => {
				return value ? value : "-";
			},
		},
		{
			dataIndex: "shiftConsumption",
			key: "shiftConsumption",
			title: "Energy Consumption (kWh) ",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
			align: "left",
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: "Month's Consumption (kWh)",
			align: "center",
			width: 40,
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: "Cumulative Consumption",
			align: "left",
			width: 40,
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
	];
	dailyWiseColumn = [
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			align: "left",
			// width: 100,
			render: (value) => {
				return dateFormat(value);
			},
		},
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Day",
			align: "left",
			render: (value) => {
				return dayjs(value).format("dddd");
			},
		},
		{
			dataIndex: "todayConsumption",
			key: "todayConsumption",
			title: (
				<Tooltip title='Energy Consumption (kWh) '>
					<span>EC (kWh)</span>
				</Tooltip>
			),
			align: "right",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: (
				<Tooltip title='Monthly Consumption (kWh) '>
					<span>MC (kWh)</span>
				</Tooltip>
			),
			align: "right",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: (
				<Tooltip title='Cumulative Energy (kWh) '>
					<span>CE (kWh)</span>
				</Tooltip>
			),
			align: "right",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
	];
	columnsPdf = [
		{
			dataIndex: "assetIds",
			key: "assetIds",
			title: "S.No",
			align: "left",
		},
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			align: "left",
			render: (value) => {
				return value ? moment(value).format("DDDD") : "-";
			},
		},

		{
			dataIndex: "shiftConsumption",
			key: "shiftConsumption",
			title: "Energy Consumption (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: "Month Consumption (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: "Cumulative Energy (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
	];

	columnsPdf2 = [
		{
			dataIndex: "assetIds",
			key: "assetIds",
			title: "S.No",
			align: "left",
		},
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			align: "left",
			render: (value) => {
				return value ? moment(value).format("DDDD") : "-";
			},
		},
		{
			dataIndex: "shiftName",
			key: "shiftName",
			title: "Shift",
			align: "left",
		},
		{
			dataIndex: "shiftConsumption",
			key: "shiftConsumption",
			title: "Energy Consumption (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: "Month Consumption (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: "Cumulative Energy (kWh) ",
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
	];
	shiftWiseColumn = [
		{
			dataIndex: "timestamp",
			key: "timestamp",
			title: "Date",
			align: "left",
			render: (value) => {
				return value ? moment(value).format("DD-MM-YYYY") : "-";
			},
		},
		{
			dataIndex: "shiftName",
			key: "shiftName",
			title: "Shift",
			align: "left",
		},
		{
			dataIndex: "shiftConsumption",
			key: "shiftConsumption",
			title: (
				<Tooltip title='Energy Consumption (kWh) '>
					<span>EC (kWh)</span>
				</Tooltip>
			),
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : value;
			},
		},
		{
			dataIndex: "monthConsumption",
			key: "monthConsumption",
			title: (
				<Tooltip title='Month Consumption (kWh) '>
					<span>MC (kWh)</span>
				</Tooltip>
			),
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
		{
			dataIndex: "cumulativeConsumption",
			key: "cumulativeConsumption",
			title: (
				<Tooltip title='Cumulative Energy (kWh) '>
					<span>CE (kWh)</span>
				</Tooltip>
			),
			align: "left",
			render: (value) => {
				return value ? value.toFixed(2) : "0";
			},
		},
	];
	onClose = () => {
		this.setState({ open: false, isDateTabsOpen: false });
	};
	handleDateTabsOpen = () => {
		this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
	};
	render() {
		const menu = (
			<Menu>
				{/* PDF Button */}
				<Menu.Item key='pdf' onClick={this.handlePDFDownload}>
					{/* <Button  onClick={this.handleDownload}> */}
					<FilePdfOutlined /> PDF
					{/* </Button> */}
				</Menu.Item>

				{/* Excel Button */}
				<Menu.Item key='excel' onClick={this.handleExcelDownload}>
					{/* <Button  onClick={this.handleDownload1}> */}
					<FileExcelOutlined /> Excel
					{/* </Button> */}
				</Menu.Item>
			</Menu>
		);
		const menu2 = (
			<Menu>
				{/* PDF Button */}
				<Menu.Item key='pdf' onClick={this.handlePDFDownload2}>
					{/* <Button  onClick={this.handleDownload}> */}
					<FilePdfOutlined /> PDF
					{/* </Button> */}
				</Menu.Item>

				{/* Excel Button */}
				<Menu.Item key='excel' onClick={this.handleExcelDownload2}>
					{/* <Button  onClick={this.handleDownload1}> */}
					<FileExcelOutlined /> Excel
					{/* </Button> */}
				</Menu.Item>
			</Menu>
		);
		const colors = ["#FF2D00", "#ECFF00", "#0042FF"];
		const { isLoading } = this.props;
		// console.log("access", access[0].length);
		if (isLoading) {
			return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
		}

		return (
			<Spin spinning={isLoading}>
				<Page
					title='Energy Reports'
					filter={
						<Form size='small' onFinish={this.search} form={this.props.form}>
							<Row gutter={[10, 10]}>
								<Form.Item name='startDate' hidden></Form.Item>
								<Form.Item name='endDate' hidden></Form.Item>
								<Col>
									<Form.Item name='ahid' style={{ minWidth: "150px" }}>
										<TreeSelect
											onChange={(v) => this.getAssetList(v)}
											showSearch
											loading={this.state.isparentTreeListLoading}
											placeholder='Site'
											allowClear
											treeData={this.state.parentTreeList}
										></TreeSelect>
									</Form.Item>
								</Col>
								<Col>
									<Form.Item name='assetId' style={{ minWidth: "150px" }}>
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
								<Col>
									<DateTabs
										change={(data) => this.setDatefield(data)}
										onChangeMode={this.handleDateTabsModeChange}
										open={this.state.isDateTabsOpen}
										setOpen={this.handleDateTabsOpen}
										energy={true}
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

										{/* <Link to={`../live-monitoring?assetId=${this.state.assetId}`}>
                    <Button
                      type="primary"
                      icon={<FontAwesomeIcon icon="fa-solid fa-chart-line" />}
                    >
                      &nbsp; Live
                    </Button>
                  </Link> */}
									</Space>
								</Col>
							</Row>
						</Form>
					}
				>
					<Spin spinning={this.state.isLoading}>
						<Row gutter={[10, 10]}>
							<Card title={"Energy Consumption"} style={{ width: "100%" }}>
								<BarChart
									series={this.state.barData}
									height={180}
									horizontal={false}
									scrollTo={this.onBarClick}
								/>
							</Card>
							<Col
								lg={12}
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "5px",
								}}
							>
								<Card
									bodyStyle={{
										padding: 0,
										overflow: "hidden",
									}}
									title={"Daily"}
									extra={
										<Dropdown overlay={menu} placement='bottom'>
											<Button type='primary' style={{ width: "120%" }}>
												<DownloadOutlined />
											</Button>
										</Dropdown>
									}
								>
									<Table
										style={{ height: "215px" }}
										scroll={{ y: 160 }}
										dataSource={this.state.dailyWiseData}
										columns={this.dailyWiseColumn}
										size='small'
										bordered
										pagination={false}
									/>
								</Card>
								{this.state.graphShow ? (
									<div
										ref={this.ref}
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "5px",
										}}
									>
										<Card title='Current (A)'>
											<TimeSeriesGraph
												hideLabel={true}
												height={250}
												series={this.state.current}
												colors={colors}
											/>
										</Card>
										<Card title='Voltage (V)'>
											<TimeSeriesGraph
												hideLabel={true}
												height={250}
												series={this.state.voltage}
												colors={colors}
											/>
										</Card>
									</div>
								) : null}
							</Col>
							<Col
								lg={12}
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "5px",
								}}
							>
								<Card
									bodyStyle={{
										padding: 0,
										overflow: "hidden",
									}}
									title='Shiftwise'
									extra={
										<Dropdown overlay={menu2} placement='bottom'>
											<Button type='primary' style={{ width: "120%" }}>
												<DownloadOutlined />
											</Button>
										</Dropdown>
									}
								>
									<Table
										style={{ height: "215px" }}
										scroll={{ y: 160 }}
										dataSource={this.state.shiftWiseData}
										columns={this.shiftWiseColumn}
										size='small'
										pagination={false}
									/>
								</Card>
								{this.state.graphShow ? (
									<div
										ref={this.ref}
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "5px",
										}}
									>
										<Card title='Load (kWh)'>
											<TimeSeriesGraph
												hideLabel={true}
												height={250}
												series={this.state.load}
												colors={colors}
											/>
										</Card>
										<Card title='Power Factor (kW)'>
											<TimeSeriesGraph
												hideLabel={true}
												height={250}
												series={this.state.powerFactor}
												colors={colors}
											/>
										</Card>
									</div>
								) : null}
							</Col>
						</Row>
					</Spin>
				</Page>
			</Spin>
		);
	}
}

export default withRouter(withAuthorization(withForm(EnergyReports)));
