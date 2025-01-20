import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { EditOutlined, SwapOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import { API } from "../../config";
import withBusiness from "./withBusiness";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber } from "../../helpers/numberFormatter";

const Business = ({ user, token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [modal, setModal] = useState(false);
	const [incentivesBrachStaff, setIncentivesBranchStaff] = useState([]);
	const [currentIncentive, setCurrentIncentive] = useState({});
	const [incentives, setIncentives] = useState([]);

	const [state, setState] = useState({
		yearIncentive: "",
		monthIncentive: "",
		branchName: "",
		empNames: "",
		officerCode: "",
		jobTitle: "",
		replacingOfficerCode: 0,
		disbursedAmount: 0,
		disbursedClients: 0,
		repaidAmount: 0,
		ppalAreaDue: 0,
		overpaidAmount: 0,
		incentiveNet: 0,
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		yearIncentive,
		monthIncentive,
		branchName,
		empNames,
		officerCode,
		jobTitle,
		replacingOfficerCode,
		disbursedAmount,
		disbursedClients,
		repaidAmount,
		ppalAreaDue,
		overpaidAmount,
		incentiveNet,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		getIncentives();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const getIncentive = async (officerCode) => {
		if (officerCode !== undefined) {
			handleNewIncentive();
			const response = await axios.get(
				`${API}/businessIncentive/${officerCode}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCurrentIncentive(response.data.myIncentive);
			setState({ ...state, ...response.data.myIncentive });
			window.scrollTo(0, 0);
		}
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getIncentives = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/businessIncentives`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setIncentives(response.data.myIncentives);
		setLoading(false);
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const handleNewIncentive = () => {
		setState({
			...state,
			yearIncentive: "",
			monthIncentive: "",
			branchName: "",
			empNames: "",
			officerCode: "",
			jobTitle: "",
			disbursedAmount: 0,
			disbursedClients: 0,
			branchDisbursedAmount: 0,
			branchDisbursedClients: 0,
			repaidAmount: 0,
			ppalAreaDue: 0,
			overpaidAmount: 0,
			incentiveNet: 0,
			buttonText: "Save",
			error: "",
			success: "",
		});
		setSearchText("");
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/businessSearchIncentives`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setIncentives(response.data.myIncentives);
		setLoading(false);
		handleNewIncentive();
		setSearchText("");
	};

	const getBranchIncentiveStaff = async (officerCode) => {
		if (officerCode !== undefined) {
			getIncentive(officerCode);
			setLoading(true);
			try {
				const response = await axios.get(
					`${API}/branchIncentiveStaff/${officerCode}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setIncentivesBranchStaff(response.data.incentivesBranchStaff);
				setLoading(false);
				toggle();
			} catch (error) {
				setLoading(false);
			}
		}
	};

	const getBranchIncentivesStaff = async (officerCode) => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/branchIncentiveStaff/${officerCode}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setIncentivesBranchStaff(response.data.incentivesBranchStaff);
			setLoading(false);
			toggle();
		} catch (error) {
			setLoading(false);
		}
	};

	const toggle = () => {
		setModal(!modal);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>
						Swap incentives entitlement
					</ModalHeader>
					<ModalBody>
						<div>
							<div className="text-danger">
								Replace {currentIncentive.empNames} by:
							</div>
							<br />

							<div className="form-group ">
								<select
									className="form-control"
									onChange={handleChange(
										"replacingOfficerCode"
									)}
									value={replacingOfficerCode}
									title="Employee names"
								>
									<option></option>
									{incentivesBrachStaff.length > 0 &&
										incentivesBrachStaff.map((ibs, i) => (
											<option
												key={i}
												value={ibs.officerCode}
											>
												{ibs.empNames}
											</option>
										))}
								</select>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="warning" onClick={changeIncentiveOwner}>
							Swap
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const changeIncentiveOwner = async (e) => {
		e.preventDefault();
		setLoading(true);
		toggle();
		try {
			const response = await axios.put(
				`${API}/swapIncentive/`,
				{
					currentOfficerCode: currentIncentive.officerCode,
					replacingOfficerCode,
					yearIncentive: currentIncentive.yearIncentive,
					monthIncentive: currentIncentive.monthIncentive,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			handleNewIncentive();
			setState({
				...state,
				replacingOfficerCode: 0,
				success: response.data && response.data.message,
			});
			getBranchIncentivesStaff(replacingOfficerCode);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const exportMonthlyIncentive = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/exportIncentives/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.monthlyIncentives) &&
				response.data.monthlyIncentives.length > 0
			) {
				let csvContent = response.data.monthlyIncentives
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "monthlyIncentives.csv");
				document.body.appendChild(link);
				link.click();
			}
			setLoading(false);
			setState({
				...state,
				success: response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const incentiveForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">Year: </label> <br />
					<input
						type="text"
						onChange={handleChange("yearIncentive")}
						className="form-control"
						value={yearIncentive}
						disabled
					/>
				</div>

				<div className="form-group col-md-4">
					<label className="text-muted ">Month: </label> <br />
					<input
						type="text"
						onChange={handleChange("monthIncentive")}
						className="form-control"
						value={monthIncentive}
						disabled
					/>
				</div>

				<div className="form-group col-md-4">
					<label className="text-muted ">Branch: </label> <br />
					<input
						type="text"
						onChange={handleChange("branchName")}
						className="form-control"
						value={branchName}
						required
						disabled
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Employee Names: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("empNames")}
						className="form-control"
						value={empNames}
						disabled
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Job Title: </label> <br />
					<input
						type="text"
						onChange={handleChange("jobTitle")}
						className="form-control"
						value={jobTitle}
						disabled
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Disbursed Amount: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("disbursedAmount")}
						className="form-control"
						value={disbursedAmount}
						disabled
						title={formatNumber(disbursedAmount)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Disbursed Clients: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("disbursedClients")}
						className="form-control"
						value={disbursedClients}
						disabled
						title={formatNumber(disbursedClients)}
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Repaid Amount: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("repaidAmount")}
						className="form-control"
						value={repaidAmount}
						disabled
						title={formatNumber(repaidAmount)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Area Due: </label> <br />
					<input
						type="number"
						onChange={handleChange("ppalAreaDue")}
						className="form-control"
						value={ppalAreaDue}
						disabled
						title={formatNumber(ppalAreaDue)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Overpaid Amount: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("overpaidAmount")}
						className="form-control"
						value={overpaidAmount}
						disabled
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Net Incentive: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("incentiveNet")}
						className="form-control"
						value={incentiveNet}
						disabled
						title={formatNumber(incentiveNet)}
					/>
				</div>
			</div>

			<hr />
			<div className="row">
				<div className="col-md-6 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>
				<div className="col-md-6 mt-1">
					<button
						onClick={exportMonthlyIncentive}
						className="btn btn-outline-warning btn-block"
						title="Download current incentives to excel for further investiagation."
					>
						Download
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listIncentives = () =>
		incentives.map((incent, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{incent.empNames.length <= 67
							? incent.empNames
							: incent.empNames.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{incent.jobTitle ? incent.jobTitle + " - " : ""}
						{incent.branchName ? incent.branchName : ""}
					</span>
					<span className="text-danger" style={{ fontSize: "13px" }}>
						&emsp;
						{incent.incentiveNet
							? formatNumber(incent.incentiveNet)
							: 0}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => getIncentive(incent.officerCode)}
						title="View incentive data"
					>
						<EyeOutlined className="text-info" />
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() =>
							getBranchIncentiveStaff(incent.officerCode)
						}
						title="Assign this insentive to a different staff!"
					>
						<SwapOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Monthly Incentive</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentIncentive && currentIncentive.empNames
								? currentIncentive.empNames
								: "Select an employee to view data"}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentIncentive && currentIncentive.jobTitle
								? currentIncentive.jobTitle
								: ""}
							&emsp;
							{currentIncentive && currentIncentive.officerCode
								? ": " + currentIncentive.officerCode
								: ""}
						</h6>
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{incentiveForm()}</div>
				</div>
				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-lg text-danger"
							role="status"
						>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}

				<div className="row ">
					<form
						className="form-inline col bg-info mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder='Type here part of employee name, job title, branch name or full employee code, officer code, then press "Enter" to search.'
							style={{ width: "100%" }}
						/>
					</form>
				</div>

				{listIncentives()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(currentIncentive)} */}
		</Layout>
	);
};

export default withBusiness(Business);
