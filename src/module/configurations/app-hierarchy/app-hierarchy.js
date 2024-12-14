import { SearchOutlined } from "@ant-design/icons";
import { Row, Table, Col, Input, Form } from "antd";

import TagsCell from "../../../component/TagCell";

import { appHierarchyPageId } from "../../../helpers/page-ids";

import AppHierarchyForm from "./app-hierarchy-form";
import ModuleSelectionForm from "../module-selection/module-selection-form";

import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import LocationService from "../../../services/location-service";
import ModuleSelectionService from "../../../services/preventive-maintenance-services/module-selection-service";

import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import {
	AddButton,
	DeleteButton,
	EditButton,
	ViewButton,
} from "../../../utils/action-button/action-button";

import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";

class AppHierarchy extends PageList {
	constructor(props) {
		super(props);
		this.state = {
			ahid: null,
			searchValue: "",
		};
	}

	form = AppHierarchyForm;
	pageId = appHierarchyPageId;
	service = new AppHierarchyService();
	moduleService = new ModuleSelectionService();
	locationService = new LocationService();

	// userAccessService = new UserAccessService();
	title = "Entity";
	moduleTitle = "Module";

	refreshPage = () => {
		// Add logic here to refresh the data (e.g., call this.list())
		// You may also want to fetch data from this.moduleService.list()
		this.list();
		this.moduleService.list();
	};
	handleModuleSelection = () => {
		Promise.all([this.moduleService.list(), this.service.list()]).then(
			(response) => {
				let changes = this.handleData(response[1].data);
				this.setState((state) => ({
					...state,
					moduleData: response[0].data,
					rows: changes,
					res: changes,
				}));
			}
		);
	};

	componentDidMount() {
		this.handleModuleSelection();
	}

	columns = [
		{
			dataIndex: "ahname",
			key: "ahname",
			title: <div style={{ textAlign: "center" }}>Entity Name</div>,
			align: "left",
			fixed: "left",
			sorter: (a, b) => a.ahname.localeCompare(b.ahname),
		},
		{
			dataIndex: "ahid",
			key: "ahid",
			title: "Module",
			align: "center",
			width: "200px",
			render: (value) => {
				const appheir = this.state.moduleData?.find(
					(e) => e.entityId === value
				);
				return appheir ? (
					<TagsCell
						tags={appheir.moduleName.map((moduleName) => ({
							moduleName,
							moduleName,
						}))}
						keyName='moduleName'
						valueName='moduleName'
					/>
				) : null;
			},
		},
		{
			dataIndex: "mode",
			key: "mode",
			title: "Category",
			align: "center",
			width: "150px",
		},
		{
			dataIndex: "active",
			key: "active",
			title: "Status",
			align: "center",
			width: "150px",
			render: (value) => {
				return value ? "Active" : "Inactive";
			},
		},
		{
			dataIndex: "ahid",
			key: "ahid",
			title: "Action",
			width: 150,
			align: "center",
			render: (value, record, index) => {
				return (
					<>
						{this.props.access[0]?.includes("view") && (
							<ViewButton onClick={() => this.view(value)} />
						)}
						{this.props.access[0]?.includes("edit") && (
							<EditButton onClick={() => this.edit(value)} />
						)}
						{this.props.access[0]?.includes("delete") && (
							<DeleteButton onClick={() => this.delete(value)} />
						)}
					</>
				);
			},
		},
		{
			dataIndex: "ahname",
			key: "ahname",
			title: "Module Selection",
			width: 160,
			align: "center",
			fixed: "right",
			render: (value, record, index) => {
				const appheirt = this.state.moduleData?.find(
					(e) => e.entityId === record.ahid
				);

				if (record.mode === "Organization" || "Department") {
					return (
						<>
							{this.props.access[0]?.includes("add") && (
								<AddButton onClick={() => this.add1(record)} />
							)}
						</>
					);
				} else {
					return null;
				}
			},
		},
	];

	add1(record) {
		const ahid = record?.ahid;
		// console.log("Entity Name:", record);

		this.setState({
			...this.state,
			popup1: {
				open: true,
				mode: "Add",
				title: `Add ${this.moduleTitle}`,
				ahid: ahid,
				disabled: false,
			},
		});
	}

	onClose1 = (data) => {
		this.setState({ ...this.state, popup1: { open: false } }, () => {
			if (data) {
				this.list();
				this.moduleService.list();
			}
		});
		this.moduleService.list();
		this.handleModuleSelection();
		this.resetSearchInput();
	};

	onClose = (data) => {
		this.setState(
			{ ...this.state, popup: { open: false }, popup1: { open: false } },
			() => {
				if (data) {
					this.list();
				}
				this.resetSearchInput();
			}
		);
	};

	resetSearchInput = () => {
		this.setState({ searchValue: "" });
	};

	handleData(data) {
		return this.service.convertToTree(data);
	}
	// filter = (event) => {
	//   let s = event.target.value.toLowerCase().trim();
	//   let res = this.state.rows.filter((e) => {
	//     return e.ahname?.toLowerCase().includes(s);
	//   });
	//   this.setState({ searchValue: s, res });
	// };

	filter = (event) => {
		let s = event.target.value.toLowerCase();
		// Recursive function to search for the keyword in nested objects
		const searchNested = (obj, keyword) => {
			if (typeof obj !== "object" || obj === null) {
				return false;
			}
			for (let key in obj) {
				if (
					typeof obj[key] === "string" &&
					obj[key].toLowerCase().includes(keyword)
				) {
					return true;
				}
				if (typeof obj[key] === "object" && searchNested(obj[key], keyword)) {
					return true;
				}
			}
			return false;
		};
		let res = this.state.rows.filter((e) => {
			return searchNested(e, s);
		});
		this.setState({ searchValue: s, res });
	};

	render() {
		// console.log("res", this.props);
		// console.log("state", this.state);
		// console.log("module res", this.state.moduleData);
		return (
			<>
				<Page
					title={this.title}
					action={
						this.props.access[0]?.includes("add") && (
							<AddButton onClick={() => this.add()} />
						)
					}
				>
					<Row justify='space-between'>
						<Col span={24}>
							<Form>
								<Form.Item>
									<Input
										prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
										onInput={this.filter}
										value={this.state.searchValue}
										placeholder='Search...'
									/>
								</Form.Item>
							</Form>
						</Col>
					</Row>
					<br />
					<Table
						bordered
						rowKey='ahid'
						loading={this.state.isLoading}
						dataSource={this.state.res}
						columns={this.columns}
						size='small'
						pagination={{
							showSizeChanger: true,
							showQuickJumper: true,
							size: "default",
						}}
					/>
					<ModuleSelectionForm {...this.state.popup1} close={this.onClose1} />
					{this.state.popup?.open && (
						<this.form {...this.state.popup} close={this.onClose} />
					)}
				</Page>
			</>
		);
	}
}

export default withRouter(withAuthorization(AppHierarchy));
