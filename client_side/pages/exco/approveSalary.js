import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import withExco from "./withExco";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber, numToWords } from "../../helpers/numberFormatter";

const approveSalary = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [approveModel, setApproveModal] = useState(false);
	const [correctModel, setCorrectModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [salSummary, setSalSummary] = useState({});
	// const [currentStaff, setCurrentStaff] = useState({});
	const [state, setState] = useState({
		approvedBy: "",
		approvalComment: "",
		error: "",
		success: "",
	});
	const { approvedBy, approvalComment, error, success } = state;

	useEffect(() => {
		getSummary();
		getProfiles();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, []);

	const getSummary = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/sumSalaryExco`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setSalSummary(response.data);
		setLoading(false);
	};

	const getProfiles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profilesExco`, {
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
			`${API}/searchProfilesExco`,
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

	const toggleApprove = () => {
		setApproveModal(!approveModel);
	};

	const toggleCorrect = () => {
		setCorrectModal(!correctModel);
	};

	const approveDialog = () => {
		return (
			<div>
				<Modal isOpen={approveModel} toggleApprove={toggleApprove}>
					<ModalHeader
						toggleApprove={toggleApprove}
						className="text-success"
					>
						Approve Monthly Salary
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
									onChange={handleChange("approvalComment")}
									className="form-control"
									name="approvalComment"
									value={approvalComment}
									placeholder="Enter your comment on current moth salary"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="success" onClick={approveMonthlySalary}>
							Approve
						</Button>{" "}
						<Button color="primary" onClick={toggleApprove}>
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
									onChange={handleChange("approvalComment")}
									className="form-control"
									name="approvalComment"
									value={approvalComment}
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

	const payrollDetails = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/salaryBreakDownExco/`, {
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

	const approveMonthlySalary = async () => {
		setApproveModal(!approveModel);
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/approveSalary/`,
				{
					approvedBy: user.fullName,
					approvalComment: approvalComment
						? approvalComment
						: "No comment",
					salaryStatus: "APPROVED",
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
				approvalComment: "",
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
				`${API}/approveSalary/`,
				{
					approvedBy: user.fullName,
					approvalComment: approvalComment
						? approvalComment
						: "No comment",
					salaryStatus: "NOT APPROVED",
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
				approvalComment: "",
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
				{salSummary && salSummary["Year"] && salSummary["Month"] && (
					<div className="col-md-12 text-danger font-weight-bold">
						{salSummary["Month"]}
						&emsp;{salSummary["Year"]}&emsp;Employees:{" "}
						{formatNumber(salSummary["Number of Employees"])}
					</div>
				)}
				&emsp;
				{salSummary && salSummary["Basic Salary"] > 0 && (
					<div className="col-md-12">
						Basic Salary:&emsp;
						{formatNumber(salSummary["Basic Salary"])}
						&emsp;RWF ({numToWords(salSummary["Basic Salary"])})
					</div>
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
					salSummary["Gross"] > 0 && (
						<div className="col-md-12 font-weight-bold">
							Gross:&emsp;
							{formatNumber(salSummary["Gross"])}
							&emsp;RWF ({numToWords(salSummary["Gross"])})
						</div>
					)}
				{salSummary &&
					salSummary["P.A.Y.E"] &&
					salSummary["P.A.Y.E"] > 0 && (
						<div className="col-md-12">
							P.A.Y.E:&emsp;
							{formatNumber(salSummary["P.A.Y.E"])}
							&emsp;RWF ({numToWords(salSummary["P.A.Y.E"])})
						</div>
					)}
				{salSummary &&
					salSummary["Mat. Leave - Staff contribution"] &&
					salSummary["Mat. Leave - Staff contribution"] > 0 && (
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
					)}
				{salSummary &&
					salSummary["CSR - Staff contribution"] &&
					salSummary["CSR - Staff contribution"] > 0 && (
						<div className="col-md-12">
							CSR - Staff contribution:&emsp;
							{formatNumber(
								salSummary["CSR - Staff contribution"]
							)}
							&emsp;RWF (
							{numToWords(salSummary["CSR - Staff contribution"])}
							)
						</div>
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
					salSummary["Net Pay"] > 0 && (
						<div className="col-md-12 font-weight-bold">
							Net Pay:&emsp;
							{formatNumber(salSummary["Net Pay"])}
							&emsp;RWF ({numToWords(salSummary["Net Pay"])})
						</div>
					)}
				{salSummary &&
					salSummary["Mat. Leave - Cie contribution"] &&
					salSummary["Mat. Leave - Cie contribution"] > 0 && (
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
					)}
				{salSummary &&
					salSummary["CSR - Cie contribution"] &&
					salSummary["CSR - Cie contribution"] > 0 && (
						<div className="col-md-12">
							CSR - Cie contribution:&emsp;
							{formatNumber(salSummary["CSR - Cie contribution"])}
							&emsp;RWF (
							{numToWords(salSummary["CSR - Cie contribution"])})
						</div>
					)}
				{salSummary &&
					salSummary["Community Health"] &&
					salSummary["Community Health"] > 0 && (
						<div className="col-md-12">
							Community Health:&emsp;
							{formatNumber(salSummary["Community Health"])}
							&emsp;RWF (
							{numToWords(salSummary["Community Health"])})
						</div>
					)}
				{salSummary &&
					salSummary["Cie Total Contribution"] &&
					salSummary["Cie Total Contribution"] > 0 && (
						<div className="col-md-12">
							Cie Total Contribution:&emsp;
							{formatNumber(salSummary["Cie Total Contribution"])}
							&emsp;RWF (
							{numToWords(salSummary["Cie Total Contribution"])})
						</div>
					)}
			</div>
			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={toggleCorrect}
						className="btn btn-outline-warning btn-block"
						title="Ask for corrections before salary validation."
					>
						Correction needed
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={toggleApprove}
						className="btn btn-outline-success btn-block"
						title="Approve current month salary."
					>
						Approve
					</button>
				</div>
				{/* <div className="col-md-2 mt-1">
					<button
						onClick={exportMonthlySalary}
						className="btn btn-outline-success btn-block"
						title="Generate Excel file containing current month salary."
					>
						Download
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={payrollDetails}
						className="btn btn-outline-primary btn-block"
						title="Generate Excel file containing of deductions and allowances."
					>
						Payroll Details
					</button>
				</div> */}
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
							router.push(`/exco/salaryDetails/${pfl._id}`)
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
					<h4>Salary Approval</h4>
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
			{approveDialog()}
			{correctDialog()}
			{/* {JSON.stringify(salSummary)} */}
		</Layout>
	);
};
export default withExco(approveSalary);
