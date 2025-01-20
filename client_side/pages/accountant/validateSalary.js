import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import withAccountant from "./withAccountant";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber, numToWords } from "../../helpers/numberFormatter";

const validateSalary = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [validateModel, setValidateModal] = useState(false);
	const [correctModel, setCorrectModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [salSummary, setSalSummary] = useState({});
	// const [currentStaff, setCurrentStaff] = useState({});
	const [state, setState] = useState({
		validatedBy: "",
		validatedComment: "",
		error: "",
		success: "",
	});
	const { validatedBy, validatedComment, error, success } = state;

	useEffect(() => {
		getSummary();
		getProfiles();
	}, [router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const getSummary = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/sumSalary`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setSalSummary(response.data);
		setLoading(false);
	};

	const getProfiles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profilesAccountant`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setLoading(false);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchProfilesAccountant`,
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
		setSearchText("");
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

	const toggleValidate = () => {
		setValidateModal(!validateModel);
	};

	const toggleCorrect = () => {
		setCorrectModal(!correctModel);
	};

	const validateDialog = () => {
		return (
			<div>
				<Modal isOpen={validateModel} toggleValidate={toggleValidate}>
					<ModalHeader
						toggleValidate={toggleValidate}
						className="text-success"
					>
						Validate Monthly Salary
					</ModalHeader>
					<ModalBody>
						<div>
							<strong className="float-right">
								{salSummary && salSummary.Month}&emsp;
								{salSummary && salSummary.Year}
							</strong>
							<div className="form-group">
								<textarea
									rows="7"
									onChange={handleChange("validatedComment")}
									className="form-control"
									name="validatedComment"
									value={validatedComment}
									placeholder="Enter your comment on current moth salary"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="success" onClick={validateMonthlySalary}>
							Validate
						</Button>{" "}
						<Button color="primary" onClick={toggleValidate}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const correctDialog = () => {
		return (
			<div>
				<Modal isOpen={correctModel} toggleCorrect={toggleCorrect}>
					<ModalHeader
						toggleCorrect={toggleCorrect}
						className="text-danger"
					>
						Correct Monthly Salary
					</ModalHeader>
					<ModalBody>
						<div>
							<strong className="float-right">
								{salSummary && salSummary.Month}&emsp;
								{salSummary && salSummary.Year}
							</strong>
							<div className="form-group">
								<textarea
									rows="7"
									onChange={handleChange("validatedComment")}
									className="form-control"
									name="validatedComment"
									value={validatedComment}
									placeholder="Enter your comment on current moth salary"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="danger" onClick={correctMonthlySalary}>
							Make correction
						</Button>{" "}
						<Button color="primary" onClick={toggleCorrect}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const validateMonthlySalary = async () => {
		setValidateModal(!validateModel);
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/validateSalary/`,
				{
					validatedBy: user.fullName,
					validatedComment: validatedComment
						? validatedComment
						: "No comment",
					salaryStatus: "VALIDATED",
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
				success: response.data && response.data.message,
				error: "",
				validatedComment: "",
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

	const correctMonthlySalary = async () => {
		setCorrectModal(!correctModel);
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/validateSalary/`,
				{
					validatedBy: user.fullName,
					validatedComment: validatedComment
						? validatedComment
						: "No comment",
					salaryStatus: "NOT VALIDATED",
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
				success: response.data && response.data.message,
				error: "",
				validatedComment: "",
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

	// const exportMonthlySalary = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const response = await axios.get(`${API}/exportForValidation/`, {
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		});
	// 		if (
	// 			Array.isArray(response.data.salaryExportValidation) &&
	// 			response.data.salaryExportValidation.length > 0
	// 		) {
	// 			let csvContent = response.data.salaryExportValidation
	// 				.map((e) => e.join(","))
	// 				.join("\n");
	// 			const encodedUri =
	// 				"data:text/csv;charset=utf-8," +
	// 				encodeURIComponent(csvContent);
	// 			const link = document.createElement("a");
	// 			link.setAttribute("href", encodedUri);
	// 			link.setAttribute("download", "salaryExport.csv");
	// 			document.body.appendChild(link);
	// 			link.click();
	// 		}
	// 		setLoading(false);
	// 		setState({
	// 			...state,
	// 			success: response.data && response.data.message,
	// 		});
	// 	} catch (error) {
	// 		setLoading(false);
	// 		setState({
	// 			...state,
	// 			error:
	// 				error.response &&
	// 				error.response.data &&
	// 				error.response.data.error,
	// 		});
	// 	}
	// };

	const payrollDetails = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/salaryBreakDown/`, {
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
				success: "Salary Breaddown exported to csv file!",
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
			const response = await axios.get(`${API}/exportSalaryAccountant/`, {
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
			const response = await axios.get(
				`${API}/exportSalaryOtherBanksAccountant/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
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
				link.setAttribute("download", "salaryExportOtherBanks.txt");
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
			<div className="row text-center">
				{salSummary && salSummary["Year"] && salSummary["Month"] ? (
					<div className="col-md-12 text-danger font-weight-bold">
						{salSummary["Month"]}
						&emsp;{salSummary["Year"]}&emsp;Employees:{" "}
						{formatNumber(salSummary["Number of Employees"])}
					</div>
				) : (
					""
				)}
				&emsp;
				{salSummary && salSummary["Basic Salary"] > 0 ? (
					<div className="col-md-12">
						Basic Salary:&emsp;
						{formatNumber(salSummary["Basic Salary"])}
						&emsp;RWF ({numToWords(salSummary["Basic Salary"])})
					</div>
				) : (
					""
				)}
				{/* salSummary && 
				{salSummary["Rental Cost Allowance"] > 0 && (
					<div className="col-md-12">
						Rental Cost Allowance:&emsp;
						{formatNumber(salSummary["Rental Cost Allowance"])}
						&emsp;RWF (
						{numToWords(salSummary["Rental Cost Allowance"])})
					</div>
				)} */}
				{salSummary &&
				salSummary["Techn. Allowance"] &&
				salSummary["Techn. Allowance"] > 0 ? (
					<div className="col-md-12">
						Techn. Allowance:&emsp;
						{formatNumber(salSummary["Techn. Allowance"])}
						&emsp;RWF ({numToWords(salSummary["Techn. Allowance"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Responsibility Allowance"] &&
				salSummary["Responsibility Allowance"] > 0 ? (
					<div className="col-md-12">
						Responsibility Allowance:&emsp;
						{formatNumber(salSummary["Responsibility Allowance"])}
						&emsp;RWF (
						{numToWords(salSummary["Responsibility Allowance"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Transport Allowance"] &&
				salSummary["Transport Allowance"] > 0 ? (
					<div className="col-md-12">
						Transport Allowance:&emsp;
						{formatNumber(salSummary["Transport Allowance"])}
						&emsp;RWF (
						{numToWords(salSummary["Transport Allowance"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Other Allowances"] &&
				salSummary["Other Allowances"] > 0 ? (
					<div className="col-md-12">
						Other Allowances:&emsp;
						{formatNumber(salSummary["Other Allowances"])}
						&emsp;RWF ({numToWords(salSummary["Other Allowances"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Gross"] &&
				salSummary["Gross"] > 0 ? (
					<div className="col-md-12 font-weight-bold">
						Gross:&emsp;
						{formatNumber(salSummary["Gross"])}
						&emsp;RWF ({numToWords(salSummary["Gross"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["P.A.Y.E"] &&
				salSummary["P.A.Y.E"] > 0 ? (
					<div className="col-md-12">
						P.A.Y.E:&emsp;
						{formatNumber(salSummary["P.A.Y.E"])}
						&emsp;RWF ({numToWords(salSummary["P.A.Y.E"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Mat. Leave - Staff contribution"] &&
				salSummary["Mat. Leave - Staff contribution"] > 0 ? (
					<div className="col-md-12">
						Mat. Leave - Staff contribution:&emsp;
						{formatNumber(
							salSummary["Mat. Leave - Staff contribution"]
						)}
						&emsp;RWF (
						{numToWords(
							salSummary["Mat. Leave - Staff contribution"]
						)}
						)
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["CSR - Staff contribution"] &&
				salSummary["CSR - Staff contribution"] > 0 ? (
					<div className="col-md-12">
						CSR - Staff contribution:&emsp;
						{formatNumber(salSummary["CSR - Staff contribution"])}
						&emsp;RWF (
						{numToWords(salSummary["CSR - Staff contribution"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Other Deductions"] &&
				salSummary["Other Deductions"] >= 1 ? (
					<div className="col-md-12">
						Other Deductions:&emsp;
						{formatNumber(salSummary["Other Deductions"])}
						&emsp;RWF ({numToWords(salSummary["Other Deductions"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Net Pay"] &&
				salSummary["Net Pay"] > 0 ? (
					<div className="col-md-12 font-weight-bold">
						Net Pay:&emsp;
						{formatNumber(salSummary["Net Pay"])}
						&emsp;RWF ({numToWords(salSummary["Net Pay"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Mat. Leave - Cie contribution"] &&
				salSummary["Mat. Leave - Cie contribution"] > 0 ? (
					<div className="col-md-12">
						Mat. Leave - Cie contribution:&emsp;
						{formatNumber(
							salSummary["Mat. Leave - Cie contribution"]
						)}
						&emsp;RWF (
						{numToWords(
							salSummary["Mat. Leave - Cie contribution"]
						)}
						)
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["CSR - Cie contribution"] &&
				salSummary["CSR - Cie contribution"] > 0 ? (
					<div className="col-md-12">
						CSR - Cie contribution:&emsp;
						{formatNumber(salSummary["CSR - Cie contribution"])}
						&emsp;RWF (
						{numToWords(salSummary["CSR - Cie contribution"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Community Health"] &&
				salSummary["Community Health"] > 0 ? (
					<div className="col-md-12">
						Community Health:&emsp;
						{formatNumber(salSummary["Community Health"])}
						&emsp;RWF ({numToWords(salSummary["Community Health"])})
					</div>
				) : (
					""
				)}
				{salSummary &&
				salSummary["Cie Total Contribution"] &&
				salSummary["Cie Total Contribution"] > 0 ? (
					<div className="col-md-12">
						Cie Total Contribution:&emsp;
						{formatNumber(salSummary["Cie Total Contribution"])}
						&emsp;RWF (
						{numToWords(salSummary["Cie Total Contribution"])})
					</div>
				) : (
					""
				)}
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
						onClick={payrollDetails}
						className="btn btn-outline-primary btn-block"
						title="Generate Excel file containing of deductions and allowances."
					>
						Payroll Details
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={() =>
							router.push("/accountant/reportAccEntry")
						}
						className="btn btn-outline-primary btn-block"
						title="Generate Excel file salary accounting entry."
					>
						Accounting Entry
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={() =>
							router.push("/accountant/reportSalarySummary")
						}
						className="btn btn-outline-primary btn-block"
						title="Salary summary for signature."
					>
						Payroll Summary
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={toggleCorrect}
						className="btn btn-outline-warning btn-block"
						title="Ask for corrections before salary validation."
					>
						Correction needed
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={toggleValidate}
						className="btn btn-outline-success btn-block"
						title="Validate current month salary."
					>
						Validate
					</button>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6 mt-1 ">
					<button
						onClick={exportMonthlySalary}
						className="btn btn-success btn-block"
						title="Text File of salaries to dispach to staff accounts in Urwego Bank."
					>
						Urwego Bank Salary
					</button>
				</div>
				<div className="col-md-6 mt-1 ">
					<button
						onClick={exportMonthlySalaryOtherBanks}
						className="btn btn-success btn-block"
						title="Text File of salaries to be sent to staff accounts in other banks."
					>
						Other Banks Salary
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
						{pfl.currentMonthSalary &&
						pfl.currentMonthSalary.netSalary
							? formatNumber(pfl.currentMonthSalary.netSalary)
							: ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() =>
							router.push(`/accountant/salaryDetails/${pfl._id}`)
						}
						title="View details of this employee's salary"
					>
						<EyeOutlined className="text-primary" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Salary Validation</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

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
			{validateDialog()}
			{correctDialog()}
			{/* {JSON.stringify(salSummary)} */}
		</Layout>
	);
};
export default withAccountant(validateSalary);
