import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber } from "../../helpers/numberFormatter";

const InsentiveSale = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [modal, setModal] = useState(false);
	const [modalApply, setModalApply] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [currentIncentive, setCurrentIncentive] = useState({});
	const [incentives, setIncentives] = useState([]);

	const [state, setState] = useState({
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
		disbursedAmount,
		disbursedClients,
		branchDisbursedAmount,
		branchDisbursedClients,
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

	const incentiveYears = [
		2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
	];
	const incentiveMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const getIncentive = async (incentiveID) => {
		handleNewIncentive();
		const response = await axios.get(`${API}/incentive/${incentiveID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentIncentive(response.data.myIncentive);
		setState({ ...state, ...response.data.myIncentive });
		window.scrollTo(0, 0);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getIncentives = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/incentives`, {
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
		setCurrentStaff({});
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
			`${API}/searchIncentives`,
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

	const toggle = () => {
		setModal(!modal);
	};

	const toggleApply = () => {
		setModalApply(!modalApply);
	};

	const modalApplyDialog = () => {
		return (
			<div>
				<Modal isOpen={modalApply} toggleApply={toggleApply}>
					<ModalHeader
						className="text-primary"
						toggleApply={toggleApply}
					>
						Merge sales incentives with current monthly salary
					</ModalHeader>
					<ModalBody>
						<div>
							<span
								style={{
									fontSize: "16px",
									fontWeight: "bold",
									textAlign: "right",
								}}
							>
								Make sure staff incentives are calculated and
								verified.
							</span>
							<br />
							<br />
							<span className="text-danger">
								YOU WILL NOT BE ABLE TO REVERT THIS ACTION!
							</span>
							<br />
							<div className="form-group ">
								<select
									className="form-control"
									onChange={handleChange("yearIncentive")}
									value={yearIncentive}
									title="Year Incentive"
								>
									<option></option>
									{incentiveYears.length > 0 &&
										incentiveYears.map((iy, i) => (
											<option key={i} value={iy}>
												{iy}
											</option>
										))}
								</select>
							</div>
							<div className="form-group ">
								<select
									className="form-control"
									onChange={handleChange("monthIncentive")}
									value={monthIncentive}
									title="Month Incentive"
								>
									<option></option>
									{incentiveMonths.length > 0 &&
										incentiveMonths.map((im, i) => (
											<option key={i} value={im}>
												{im}
											</option>
										))}
								</select>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="warning"
							onClick={mergeIncentiveWithSalary}
						>
							Continue
						</Button>{" "}
						<Button color="secondary" onClick={toggleApply}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>
						Calculate sales incentives
					</ModalHeader>
					<ModalBody>
						<div>
							<div className="form-group ">
								<select
									className="form-control"
									onChange={handleChange("yearIncentive")}
									value={yearIncentive}
									title="Year Incentive"
								>
									<option></option>
									{incentiveYears.length > 0 &&
										incentiveYears.map((iy, i) => (
											<option key={i} value={iy}>
												{iy}
											</option>
										))}
								</select>
							</div>
							<div className="form-group ">
								<select
									className="form-control"
									onChange={handleChange("monthIncentive")}
									value={monthIncentive}
									title="Month Incentive"
								>
									<option></option>
									{incentiveMonths.length > 0 &&
										incentiveMonths.map((im, i) => (
											<option key={i} value={im}>
												{im}
											</option>
										))}
								</select>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="warning" onClick={calcIncentiveSales}>
							Calculate
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const calcIncentiveSales = async (e) => {
		e.preventDefault();
		toggle();
		if (!yearIncentive || !monthIncentive) {
			setState({
				...state,
				buttonText: "Save",
				error: "Provide year and month for calculation!",
			});
			toggle();
			window.scrollTo(0, 0);
			return;
		}
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/incentiveSales/`,
				{
					salaryYear: parseInt(yearIncentive),
					salaryMonth: monthIncentive,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			handleNewIncentive();
			getIncentives();
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				yearIncentive: "",
				monthIncentive: "",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const mergeIncentiveWithSalary = async (e) => {
		toggleApply();
		e.preventDefault();
		if (!yearIncentive || !monthIncentive) {
			setState({
				...state,
				buttonText: "Save",
				error: "Provide year and month for calculation!",
			});
			window.scrollTo(0, 0);
			return;
		}
		setLoading(true);
		setState({ ...state, buttonText: "Merging..." });
		try {
			const response = await axios.post(
				`${API}/apply_incentives/`,
				{
					salaryYear: parseInt(yearIncentive),
					salaryMonth: monthIncentive,
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
				buttonText: "Save",
				success: response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
		window.scrollTo(0, 0);
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/incentive/${currentIncentive._id}`,
				{
					overpaidAmount,
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
				buttonText: "Save",
				success: response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const loadIncentiveData = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/loadCurrentIncentiveData`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			router.push(`/personnel/incentiveUpload`);
			// setState({
			// 	...state,
			// 	success: response.data && response.data.message,
			// });
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
					<label className="text-muted ">Expected Payment: </label>{" "}
					<br />
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
				<div className="col-md-2 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={handleNewIncentive}
						className="btn btn-success btn-block"
						title="Clear overpaid amount to insert new one for the selected employee."
					>
						New
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={handleUpdate}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>

				<div className="col-md-2 mt-1">
					<button
						onClick={loadIncentiveData}
						className="btn btn-outline-warning btn-block"
						title="Load incentive data for the current payroll."
					>
						Load
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={() => toggle()}
						className="btn btn-outline-success btn-block"
						title="Calculate net incentive for each employee for the current month."
					>
						Compute
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={toggleApply}
						className="btn btn-outline-warning btn-block"
						title="Merge current incentive with montly salary."
					>
						Apply
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
						onClick={() =>
							getIncentive(
								incent._id
								// incent.officerCode
								// 	? incent.officerCode
								// 	: incent.empCode
							)
						}
						title="Edit incentive data"
					>
						<EditOutlined className="text-info" />
					</span>
					{/* || 	incent.jobTitle === "Branch Manager" */}
					{(incent.jobTitle === "Sales Team Leader" ||
						incent.jobTitle === "Senior Sales Team Leader") && (
						<span
							className="btn btn-sm float-right"
							onClick={() =>
								router.push(
									`/personnel/supervision/${incent.officerCode}`
								)
							}
							title="Add supervised staff for team leader"
						>
							<TeamOutlined className="text-primary" />
						</span>
					)}
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
			{modalApplyDialog()}
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withHR(InsentiveSale);
