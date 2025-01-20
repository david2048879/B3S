import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber } from "../../helpers/numberFormatter";
import { formatDate } from "../../helpers/dateFormatter";

const inflationAllowance = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	// const [countries, setCountries] = useState([]);
	// const [maritalStatuses, setMaritalStatuses] = useState([]);
	const [banks, setBanks] = useState([]);
	const [currentProfile, setCurrentProfile] = useState({});
	const [state, setState] = useState({
		empNames: "",
		empCode: null,
		salaryYear: "",
		salaryMonth: "",
		bankName: "",
		accountNumber: "",
		allowanceAmount: 0,
		adjustmentAmount: 0,
		staffMaternityLeave: 0,
		cieMaternityLeave: 0,
		payeTPR: 0,
		staffCSR: 0,
		cieCSR: 0,
		cieCommunityHealth: 0,
		totalStaffDeductions: 0,
		netSalary: 0,

		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		empNames,
		empCode,
		salaryYear,
		salaryMonth,
		bankName,
		accountNumber,
		allowanceAmount,
		adjustmentAmount,
		staffMaternityLeave,
		cieMaternityLeave,
		payeTPR,
		staffCSR,
		cieCSR,
		cieCommunityHealth,
		totalStaffDeductions,
		netSalary,
		error,
		success,
		buttonText,
	} = state;

	const [inflationAllowanceStatus, setInflationAllowanceStatus] = useState({
		validatedBy: "",
		validatedDate: null,
		validatedComment: "",
		approvedBy: "",
		approvalDate: null,
		approvalComment: "",
		approvedBy2: "",
		approvalDate2: null,
		approvalComment2: "",
		salaryStatus: "",
	});

	useEffect(() => {
		getProfiles();
		loadBanks();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const handleNewProfile = () => {
		setCurrentProfile({});
		setState({
			...state,
			empNames: "",
			empCode: "",
			salaryYear: "",
			salaryMonth: "",
			bankName: "",
			accountNumber: "",
			allowanceAmount: 0,
			adjustmentAmount: 0,
			staffMaternityLeave: 0,
			cieMaternityLeave: 0,
			payeTPR: 0,
			staffCSR: 0,
			cieCSR: 0,
			cieCommunityHealth: 0,
			totalStaffDeductions: 0,
			netSalary: 0,
			error: "",
			success: "",
			buttonText: "Save",
		});
		setSearchText("");
	};

	const loadBanks = async () => {
		const response = await axios.get(`${API}/banks`);
		setBanks(response.data.banks);
	};

	const getProfile = async (profileID) => {
		let bank = "",
			account = "";
		handleNewProfile();
		const response = await axios.get(`${API}/profile/${profileID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentProfile(response.data.myProfile);
		if (
			!response.data.myProfile.inflationAllowance &&
			!response.data.myProfile.inflationAllowance.bankName
		) {
			bank = response.data.myProfile.currentMonthSalary.bankName;
		} else {
			bank = response.data.myProfile.inflationAllowance.bankName;
		}
		if (
			!response.data.myProfile.inflationAllowance &&
			!response.data.myProfile.inflationAllowance.accountNumber
		) {
			account = response.data.myProfile.currentMonthSalary.accountNumber;
		} else {
			account = response.data.myProfile.inflationAllowance.accountNumber;
		}
		setState({
			...state,
			empNames:
				response.data.myProfile && response.data.myProfile.empNames,
			empCode: response.data.myProfile && response.data.myProfile.empCode,
			salaryYear:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.salaryYear,
			salaryMonth:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.salaryMonth,
			bankName: bank,
			accountNumber: account,
			allowanceAmount:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.allowanceAmount,
			adjustmentAmount:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.adjustmentAmount,
			staffMaternityLeave:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.staffMaternityLeave,
			cieMaternityLeave:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.cieMaternityLeave,
			payeTPR:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.payeTPR,
			staffCSR:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.staffCSR,
			cieCSR:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.cieCSR,
			cieCommunityHealth:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.cieCommunityHealth,
			totalStaffDeductions:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.totalStaffDeductions,
			netSalary:
				response.data.myProfile.inflationAllowance &&
				response.data.myProfile.inflationAllowance.netSalary,
		});
		window.scrollTo(0, 0);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getProfiles = async () => {
		handleNewProfile();
		setLoading(true);
		const response = await axios.get(`${API}/profiles`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);

		setInflationAllowanceStatus({
			...inflationAllowanceStatus,
			validatedBy:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.validatedBy,
			validatedDate:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.validatedDate,
			validatedComment:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.validatedComment,
			approvedBy:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvedBy,
			approvalDate:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvalDate,
			approvalComment:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvalComment,
			approvedBy2:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvedBy2,
			approvalDate2:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvalDate2,
			approvalComment2:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.approvalComment2,
			salaryStatus:
				response.data.myProfiles &&
				response.data.myProfiles[0].inflationAllowance &&
				response.data.myProfiles[0].inflationAllowance.salaryStatus,
		});

		setLoading(false);
	};

	const withoutInflationAllowance = async () => {
		handleNewProfile();
		setLoading(true);
		const response = await axios.get(`${API}/withoutInflationAllowance`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);

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
		handleNewProfile();
		setSearchText("");
	};

	const computeInflationAllowance = async (e) => {
		try {
			// e.preventDefault();
			setLoading(true);
			const response = await axios.get(`${API}/calcInflationAllowance`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			getProfiles();
			setLoading(false);
			handleNewProfile();
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

	const toggle = () => {
		setModal(!modal);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>
						<strong>{inflationAllowanceStatus.salaryStatus}</strong>
					</ModalHeader>
					<ModalBody>
						<div>
							<span>
								{inflationAllowanceStatus.validatedBy &&
									inflationAllowanceStatus.validatedBy}{" "}
								<br></br>
								{inflationAllowanceStatus.validatedDate &&
									formatDate(
										inflationAllowanceStatus.validatedDate
									)}
								<br></br>
								{inflationAllowanceStatus.validatedComment &&
									inflationAllowanceStatus.validatedComment}
								<br></br>
								<br></br>
							</span>

							<span>
								{inflationAllowanceStatus.approvedBy &&
									inflationAllowanceStatus.approvedBy}
								<br></br>
								{inflationAllowanceStatus.approvalDate &&
									formatDate(
										inflationAllowanceStatus.approvalDate
									)}
								<br></br>
								{inflationAllowanceStatus.approvalComment &&
									inflationAllowanceStatus.approvalComment}
								<br></br>
								<br></br>
							</span>
							<span>
								{inflationAllowanceStatus.approvedBy2 &&
									inflationAllowanceStatus.approvedBy2}
								<br></br>
								{inflationAllowanceStatus.approvalDate2 &&
									formatDate(
										inflationAllowanceStatus.approvalDate2
									)}
								<br></br>
								{inflationAllowanceStatus.approvalComment2 &&
									inflationAllowanceStatus.approvalComment2}
							</span>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={toggle}>
							Close
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const handleUpdate = async () => {
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/addInflationAllowance/${currentProfile._id}`,
				{
					bankName,
					accountNumber,
					allowanceAmount: parseInt(allowanceAmount),
					adjustmentAmount: parseInt(adjustmentAmount),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewProfile();
			getProfiles();
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: "Inflation allowance updated!",
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

	const toExcel = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/exportInflationAllowance/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (
				Array.isArray(response.data.inflationAllowanceArray) &&
				response.data.inflationAllowanceArray.length > 0
			) {
				let csvContent = response.data.inflationAllowanceArray
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "inflationAllowance.csv");
				document.body.appendChild(link);
				link.click();
			}
			setLoading(false);
			setState({
				...state,
				success: "Inflation allowance exported to csv file!",
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

	const toTxtFileUB = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/toTxtFile/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.txtInflationAllowance) &&
				response.data.txtInflationAllowance.length > 0
			) {
				let csvContent = response.data.txtInflationAllowance
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "infletionAllowanceUB.txt");
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

	const toTxtFileOtherBanks = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/toTxtFileOB/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (
				Array.isArray(response.data.txtInflationAllowance) &&
				response.data.txtInflationAllowance.length > 0
			) {
				let csvContent = response.data.txtInflationAllowance
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute(
					"download",
					"infletionAllowanceOtherBanks.txt"
				);
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

	const addProfileForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-5">
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
				<div className="form-group col-md-2">
					<label className="text-muted ">Employee ID: </label> <br />
					<input
						type="number"
						onChange={handleChange("empCode")}
						className="form-control"
						value={empCode}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Year: </label> <br />
					<input
						type="text"
						onChange={handleChange("salaryYear")}
						className="form-control"
						value={salaryYear}
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
						disabled
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-2">
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
				<div className="form-group col-md-2">
					<label className="text-muted ">Account: </label> <br />
					<input
						type="text"
						onChange={handleChange("accountNumber")}
						className="form-control"
						value={accountNumber}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Allowance: </label> <br />
					<input
						type="number"
						onChange={handleChange("allowanceAmount")}
						className="form-control"
						value={allowanceAmount}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Adjustment: </label> <br />
					<input
						type="number"
						onChange={handleChange("adjustmentAmount")}
						className="form-control"
						value={adjustmentAmount}
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Mat. Leave (staff): </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("staffMaternityLeave")}
						className="form-control"
						value={staffMaternityLeave}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">
						Mat. Leave (employer):{" "}
					</label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("cieMaternityLeave")}
						className="form-control"
						value={cieMaternityLeave}
						disabled
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-2">
					<label className="text-muted ">P.A.Y.E.: </label> <br />
					<input
						type="number"
						onChange={handleChange("payeTPR")}
						className="form-control"
						value={payeTPR}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">CSR (stff): </label> <br />
					<input
						type="number"
						onChange={handleChange("staffCSR")}
						className="form-control"
						value={staffCSR}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">CST (employer): </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("cieCSR")}
						className="form-control"
						value={cieCSR}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Community Health: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("cieCommunityHealth")}
						className="form-control"
						value={cieCommunityHealth}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">
						Total Staff Deductions:{" "}
					</label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("totalStaffDeductions")}
						className="form-control"
						value={totalStaffDeductions}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Net: </label> <br />
					<input
						type="number"
						onChange={handleChange("netSalary")}
						className="form-control"
						value={netSalary}
						disabled
					/>
				</div>
			</div>

			<hr />
			<div className="row">
				<div className="col-md-1 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={handleNewProfile}
						className="btn btn-info btn-block"
						title="Clear all fields to be able to edit a different staff's inflation allowance."
					>
						Clear
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={
							currentProfile && currentProfile._id && handleUpdate
						}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>

				<div className="col-md-2 mt-1">
					<button
						className="btn btn-outline-primary btn-block"
						title="Calculate inflation allowance for each employee."
						onClick={computeInflationAllowance}
					>
						Compute
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={withoutInflationAllowance}
						className="btn btn-outline-danger btn-block"
						title="Employees WITHOUT inflation allowance!"
					>
						Odd
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={() => toggle()}
						className="btn btn-outline-info btn-block"
						title="See if the current inflation allowance has been validated or approved."
					>
						Status
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={toExcel}
						className="btn btn-outline-success btn-block"
						title="Send the current inflation allowances to an excel file."
					>
						Download
					</button>
				</div>

				<div className="col-md-2 mt-1">
					<button
						onClick={toTxtFileUB}
						className="btn btn-outline-success btn-block"
						title="Send the current inflation allowances to an text file for employees whose account are in Urwego Bank."
					>
						Urwego Bank
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						className="btn btn-outline-success btn-block"
						title="Send the current inflation allowances to an text file for employees whose account are NOT in Urwego Bank."
						onClick={toTxtFileOtherBanks}
					>
						Other Banks
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listProfiles = () =>
		profiles &&
		profiles.length > 0 &&
		profiles.map((pfl, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{pfl.empNames.length <= 61
							? pfl.empNames
							: pfl.empNames.substring(0, 61) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
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
					<span className="text-danger" style={{ fontSize: "13px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.netSalary
							? formatNumber(pfl.inflationAllowance.netSalary)
							: ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => getProfile(pfl._id)}
						title="Edit Employee data"
					>
						<EditOutlined className="text-info" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Inflation Allowance</h4>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addProfileForm()}</div>
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
				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

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
			{modalDialog()}
			{/* {JSON.stringify(inflationAllowanceStatus)} */}
		</Layout>
	);
};
export default withHR(inflationAllowance);
