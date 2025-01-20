import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	EditOutlined,
	MinusSquareOutlined,
	PlusSquareOutlined,
	EyeOutlined,
} from "@ant-design/icons";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber } from "../../helpers/numberFormatter";

const monthlySalary = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [banks, setBanks] = useState([]);
	const [currentStaff, setCurrentStaff] = useState({});
	const [state, setState] = useState({
		salaryYear: "", //new Date().getFullYear(),
		salaryMonth: "", //new Date().toLocaleString("default", { month: "long" }),
		bankName: "",
		accountNumber: "",
		basicSalary: 0,
		// rentalCostAllowance: 0,
		technAllowance: 0,
		responsibilityAllowance: 0,
		transportAllowance: 0,
		totalOtherAllowances: 0,
		daysWorked: 30,
		grossEarnings: 0,
		payeTPR: 0,
		staffMaternityLeave: 0,
		staffCSR: 0,
		totalOtherDeductions: 0,
		netSalary: 0,
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		salaryYear,
		salaryMonth,
		bankName,
		accountNumber,
		basicSalary,
		// rentalCostAllowance,
		technAllowance,
		responsibilityAllowance,
		transportAllowance,
		totalOtherAllowances,
		daysWorked,
		grossEarnings,
		payeTPR,
		staffMaternityLeave,
		staffCSR,
		totalOtherDeductions,
		netSalary,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		getProfiles();
		loadBanks();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const loadBanks = async () => {
		const response = await axios.get(`${API}/banks`);
		setBanks(response.data.banks);
	};

	const getStaff = async (staffID) => {
		handleNewSalary();
		const response = await axios.get(`${API}/profile/${staffID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentStaff(response.data.myProfile);
		if (
			response.data.myProfile.currentMonthSalary &&
			response.data.myProfile.currentAppointment.entitledBasicSalary > 0
		) {
			setState({
				...state,
				...response.data.myProfile.currentMonthSalary,
				basicSalary:
					response.data.myProfile.currentAppointment
						.entitledBasicSalary,
				// rentalCostAllowance:
				// 	response.data.myProfile.currentAppointment
				// 		.entitledRentalCostAllowance,
				technAllowance:
					response.data.myProfile.currentAppointment
						.entitledTechnAllowance,
				responsibilityAllowance:
					response.data.myProfile.currentAppointment
						.entitledResponsibilityAllowance,
				transportAllowance:
					response.data.myProfile.currentAppointment
						.entitledTransportAllowance,
				error: "",
				success: "",
			});
		} else {
			setState({
				...state,
				bankName: "",
				accountNumber: "",
				basicSalary: 0,
				// rentalCostAllowance: 0,
				technAllowance: 0,
				responsibilityAllowance: 0,
				transportAllowance: 0,
				totalOtherAllowances: 0,
				daysWorked: 30,
				grossEarnings: 0,
				payeTPR: 0,
				staffMaternityLeave: 0,
				staffCSR: 0,
				totalOtherDeductions: 0,
				netSalary: 0,
			});
		}
		window.scrollTo(0, 0);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getProfiles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profiles`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setState({
			...state,
			salaryYear:
				response.data.myProfiles[0].currentMonthSalary.salaryYear,
			salaryMonth:
				response.data.myProfiles[0].currentMonthSalary.salaryMonth,
		});
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

	const handleNewSalary = () => {
		setCurrentStaff({});
		setState({
			...state,
			salaryYear: "",
			salaryMonth: "",
			bankName: "",
			accountNumber: "",
			basicSalary: 0,
			// rentalCostAllowance: 0,
			technAllowance: 0,
			responsibilityAllowance: 0,
			transportAllowance: 0,
			totalOtherAllowances: 0,
			daysWorked: 30,
			grossEarnings: 0,
			totalOtherAllowances: 0,
			grossEarnings: 0,
			payeTPR: 0,
			staffMaternityLeave: 0,
			staffCSR: 0,
			totalOtherDeductions: 0,
			netSalary: 0,
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
			`${API}/searchProfiles`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setProfiles(response.data.myProfiles);
		setLoading(false);
		handleNewSalary();
		setSearchText("");
	};

	const handleUpdate = async (e) => {
		window.scrollTo(0, 0);
		e.preventDefault();
		if (!basicSalary || basicSalary <= 0) {
			setState({
				...state,
				buttonText: "Save",
				error: "Basic salary is required!",
			});
			return;
		}

		if (!bankName || !accountNumber) {
			setState({
				...state,
				buttonText: "Save",
				error: "Provide employee's bank name and account number, please!",
			});
			return;
		}

		if (!currentStaff || currentStaff._id === undefined) {
			setState({
				...state,
				buttonText: "Save",
				error: "Select an employee, please!",
			});
			return;
		}

		const currentMonthSalary = {
			salaryYear,
			salaryMonth,
			bankName,
			accountNumber,
			basicSalary,
			// rentalCostAllowance,
			technAllowance,
			responsibilityAllowance,
			transportAllowance,
			daysWorked,
			updatedData: "Core",
		};
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/salary/${currentStaff._id}`,
				{
					currentMonthSalary,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
			getStaff(currentStaff._id);
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

	const calculateMonthlySalary = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/calculateSalary/`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

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

	const toExcel = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/salaryBreakDownHR/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.breakDownPayrollArray) &&
				response.data.breakDownPayrollArray.length > 0
			) {
				let csvContent = response.data.breakDownPayrollArray
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "salaryBreakdown.csv");
				document.body.appendChild(link);
				link.click();
			}
			setLoading(false);
			setState({
				...state,
				success: "Salary Breakdown exported to csv file!",
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

	const exportMonthlySalary = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/exportSalary/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.salaryExport) &&
				response.data.salaryExport.length > 0
			) {
				let csvContent = response.data.salaryExport
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "salaryExport.txt");
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

	const exportMonthlySalaryOtherBanks = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/exportSalaryOtherBanks/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.salaryExportOtherBanks) &&
				response.data.salaryExportOtherBanks.length > 0
			) {
				let csvContent = response.data.salaryExportOtherBanks
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "salaryExportOtherBanks.csv");
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

	const addSalaryForm = () => (
		<Fragment>
			<div className="row">
				<div className="col-md-2 mt-1 ">
					<button
						onClick={() => router.push("/personnel/payrollStatus")}
						className="btn btn-outline-info btn-block"
						title="See feedback about validation and approval of the current month salary."
					>
						Current Status
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={() => router.push("/personnel/fileUpload")}
						className="btn btn-outline-warning btn-block"
						title="Upload CSV file containing allowances or deductions."
					>
						Upload
					</button>
					{/* btn btn-outline-warning btn-block */}
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={toExcel}
						className="btn btn-outline-success btn-block"
						title="Download current month salary for further checks."
					>
						Send To Excel
					</button>
					{/* btn btn-outline-warning btn-block */}
				</div>
				<div className="col-md-3 mt-1 ">
					<button
						onClick={exportMonthlySalary}
						className="btn btn-success btn-block"
						title="File of salaries to dispach to staff accounts in Urwego Bank."
					>
						Urwego Bank Salary
					</button>
				</div>
				<div className="col-md-3 mt-1 ">
					<button
						onClick={exportMonthlySalaryOtherBanks}
						className="btn btn-success btn-block"
						title="File of salaries to be sent to staff accounts in other banks."
					>
						Other Banks Salary
					</button>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Year: </label> <br />
					<input
						type="text"
						onChange={handleChange("salaryYear")}
						className="form-control"
						value={salaryYear}
						required
						title="Enter salary year here"
						disabled
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Month: </label> <br />
					<input
						type="text"
						onChange={handleChange("salaryMonth")}
						className="form-control"
						value={salaryMonth}
						required
						title="Enter salary year here"
						disabled
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Bank: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("bankName")}
						value={bankName}
						title="Banks"
					>
						<option></option>
						{banks.length > 0 &&
							banks.map((bnk, i) => (
								<option key={i} value={bnk.bankName}>
									{bnk.bankName}
								</option>
							))}
					</select>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Account: </label> <br />
					<input
						type="text"
						onChange={handleChange("accountNumber")}
						className="form-control"
						value={accountNumber}
						title="Enter account number here"
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-2">
					<label className="text-muted ">Days Worked: </label> <br />
					<input
						type="number"
						onChange={handleChange("daysWorked")}
						className="form-control"
						value={daysWorked}
						title="Number of worked days in a month should be 30. It can be increased or decrease depending on regularisation of the employee."
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Basic Salary: </label> <br />
					<input
						type="number"
						onChange={handleChange("basicSalary")}
						className="form-control"
						value={basicSalary}
						title={formatNumber(basicSalary)}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Transport: </label> <br />
					<input
						type="number"
						onChange={handleChange("transportAllowance")}
						className="form-control"
						value={transportAllowance}
						title={formatNumber(transportAllowance)}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Techn. Allowance: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("technAllowance")}
						className="form-control"
						value={technAllowance}
						title={formatNumber(technAllowance)}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Responsibility: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("responsibilityAllowance")}
						className="form-control"
						value={responsibilityAllowance}
						title={formatNumber(responsibilityAllowance)}
						disabled
					/>
				</div>

				<div className="form-group col-md-2">
					<label className="text-muted ">Other Allowances: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("totalOtherAllowances")}
						className="form-control"
						value={totalOtherAllowances}
						disabled
						title={formatNumber(totalOtherAllowances)}
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-2">
					<label className="font-weight-bold">Gross: </label> <br />
					<input
						type="number"
						onChange={handleChange("grossEarnings")}
						className="form-control"
						value={grossEarnings}
						disabled
						title={formatNumber(grossEarnings)}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">P.A.Y.E: </label> <br />
					<input
						type="number"
						onChange={handleChange("payeTPR")}
						className="form-control"
						value={payeTPR}
						disabled
						title={formatNumber(payeTPR)}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Maternity: </label> <br />
					<input
						type="number"
						onChange={handleChange("staffMaternityLeave")}
						className="form-control"
						value={staffMaternityLeave}
						disabled
						title={formatNumber(staffMaternityLeave)}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">RSSB: </label> <br />
					<input
						type="number"
						onChange={handleChange("staffCSR")}
						className="form-control"
						value={staffCSR}
						disabled
						title={formatNumber(staffCSR)}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Other deductions: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("totalOtherDeductions")}
						className="form-control"
						value={totalOtherDeductions}
						disabled
						title={formatNumber(totalOtherDeductions)}
					/>
				</div>

				<div className="form-group col-md-2">
					<label className="font-weight-bold">Net: </label> <br />
					<input
						type="number"
						onChange={handleChange("netSalary")}
						className="form-control"
						value={netSalary}
						disabled
						title={formatNumber(netSalary)}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/personnel/payroll")}
					>
						Back
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={handleUpdate}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={() => router.push("/personnel/initSalary")}
						className="btn btn-outline-warning btn-block"
						title="Initialize the current month salary for all staff."
					>
						Initialize
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={calculateMonthlySalary}
						className="btn btn-outline-success btn-block"
						title="Calculate net pay for each employee for the current month."
					>
						Compute
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listProfiles = () =>
		profiles.map((pfl, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{pfl.empNames.length <= 67
							? pfl.empNames
							: pfl.empNames.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span
						className="text-muted"
						style={{ fontSize: "13px" }}
						// onClick={() => getStaff(pfl._id)}
					>
						{pfl.currentAppointment.jobTitle
							? pfl.currentAppointment.jobTitle + " - "
							: ""}
						{pfl.currentAppointment.contractType === undefined ||
						pfl.currentAppointment.contractType === "Permanent"
							? ""
							: pfl.currentAppointment.contractType + " - "}
						{pfl.currentAppointment.branch
							? pfl.currentAppointment.branch
							: ""}
					</span>
					{/* <span className="text-danger" style={{ fontSize: "13px" }}>
						&emsp;
						{pfl.currentMonthSalary &&
						pfl.currentMonthSalary.netSalary
							? formatNumber(pfl.currentMonthSalary.netSalary)
							: ""}
					</span> */}
					<span
						className="btn btn-sm float-right"
						onClick={() => getStaff(pfl._id)}
						title="Edit Employee salary data"
					>
						<EditOutlined className="text-info" />
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() =>
							router.push(`/personnel/salaryDetails/${pfl._id}`)
						}
						title="View details of this employee's salary"
					>
						<EyeOutlined className="text-primary" />
					</span>
					<span
						onClick={() =>
							router.push(`/personnel/allowance/${pfl._id}`)
						}
						className="btn btn-sm float-right"
						title="Other allowances"
					>
						<PlusSquareOutlined className="text-success" />
					</span>
					<span
						onClick={() =>
							router.push(`/personnel/deduction/${pfl._id}`)
						}
						className="btn btn-sm float-right"
						title="Other deductions"
					>
						<MinusSquareOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Monthly Salary</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentStaff && currentStaff.empNames
								? currentStaff.empNames
								: "Select an employee to view data"}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.empCode
								? currentStaff.empCode
								: ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.phone
								? currentStaff.phone
								: ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.email
								? currentStaff.email
								: ""}
						</h6>
						&emsp;
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addSalaryForm()}</div>
				</div>
				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-sm text-primary"
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
							placeholder='Type here part of name or full employee code or employee email, then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of name or full employee code or employee email, then press "Enter" to search.'
						/>
					</form>
				</div>

				{listProfiles()}
			</div>
			{/* {JSON.stringify(profiles[0])} */}
		</Layout>
	);
};
export default withHR(monthlySalary);
