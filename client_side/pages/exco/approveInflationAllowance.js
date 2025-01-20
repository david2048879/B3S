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

const approveInflatonAllowance = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [approveModel, setApproveModal] = useState(false);
	const [correctModel, setCorrectModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [inflationSummary, setInflationSummary] = useState({});
	// const [currentStaff, setCurrentStaff] = useState({});
	const [state, setState] = useState({
		approvalComment: "",
		error: "",
		success: "",
	});
	const { approvalComment, error, success } = state;

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
		const response = await axios.get(`${API}/sumInflationAllowanceExco`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setInflationSummary(response.data);
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
						Approve Inflation Allowance
					</ModalHeader>
					<ModalBody>
						<div>
							<strong className="float-right">
								{inflationSummary && inflationSummary.Month}
								&emsp;
								{inflationSummary && inflationSummary.Year}
							</strong>
							<div className="form-group">
								<textarea
									rows="7"
									onChange={handleChange("approvalComment")}
									className="form-control"
									name="approvalComment"
									value={approvalComment}
									placeholder="Enter your comment on current inflation allowance"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="success"
							onClick={approveInflationAllowance}
						>
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
						Correct Inflation Allowance
					</ModalHeader>
					<ModalBody>
						<div>
							<strong className="float-right">
								{inflationSummary && inflationSummary.Month}
								&emsp;
								{inflationSummary && inflationSummary.Year}
							</strong>
							<div className="form-group">
								<textarea
									rows="7"
									onChange={handleChange("approvalComment")}
									className="form-control"
									name="approvalComment"
									value={approvalComment}
									placeholder="Enter your comment on current inflation allowance"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="danger"
							onClick={correctInflationAllowance}
						>
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

	const approveInflationAllowance = async () => {
		setApproveModal(!approveModel);
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/approveInflationAllowance/`,
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

	const correctInflationAllowance = async () => {
		setCorrectModal(!correctModel);
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/approveInflationAllowance/`,
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

	const inflationDetails = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/exportInflationAllowanceEXCO/`,
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

	const addSalaryForm = () => (
		<Fragment>
			<div className="row text-center">
				{inflationSummary &&
				inflationSummary["Year"] &&
				inflationSummary["Month"] ? (
					<div className="col-md-12 text-danger font-weight-bold">
						{inflationSummary["Month"]}
						&emsp;{inflationSummary["Year"]}&emsp;Employees:{" "}
						{formatNumber(inflationSummary["Number of Employees"])}
					</div>
				) : (
					""
				)}
				&emsp;
				{inflationSummary &&
				inflationSummary["Allowance Amount"] > 0 ? (
					<div className="col-md-12">
						Allowance Amount:&emsp;
						{formatNumber(inflationSummary["Allowance Amount"])}
						&emsp;RWF (
						{numToWords(inflationSummary["Allowance Amount"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Adjustement Amount"] &&
				inflationSummary["Adjustement Amount"] > 0 ? (
					<div className="col-md-12">
						Adjustement Amount:&emsp;
						{formatNumber(inflationSummary["Adjustement Amount"])}
						&emsp;RWF (
						{numToWords(inflationSummary["Adjustement Amount"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Total Earnings"] &&
				inflationSummary["Total Earnings"] > 0 ? (
					<div className="col-md-12 font-weight-bold">
						Total Earnings:&emsp;
						{formatNumber(inflationSummary["Total Earnings"])}
						&emsp;RWF (
						{numToWords(inflationSummary["Total Earnings"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Mat. Leave - Staff contribution"] &&
				inflationSummary["Mat. Leave - Staff contribution"] > 0 ? (
					<div className="col-md-12">
						Mat. Leave - Staff contribution:&emsp;
						{formatNumber(
							inflationSummary["Mat. Leave - Staff contribution"]
						)}
						&emsp;RWF (
						{numToWords(
							inflationSummary["Mat. Leave - Staff contribution"]
						)}
						)
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Mat. Leave - Cie contribution"] &&
				inflationSummary["Mat. Leave - Cie contribution"] > 0 ? (
					<div className="col-md-12">
						Mat. Leave - Cie contribution:&emsp;
						{formatNumber(
							inflationSummary["Mat. Leave - Cie contribution"]
						)}
						&emsp;RWF (
						{numToWords(
							inflationSummary["Mat. Leave - Cie contribution"]
						)}
						)
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["P.A.Y.E"] &&
				inflationSummary["P.A.Y.E"] > 0 ? (
					<div className="col-md-12">
						P.A.Y.E:&emsp;
						{formatNumber(inflationSummary["P.A.Y.E"])}
						&emsp;RWF ({numToWords(inflationSummary["P.A.Y.E"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["CSR - Staff contribution"] &&
				inflationSummary["CSR - Staff contribution"] > 0 ? (
					<div className="col-md-12">
						CSR - Staff contribution:&emsp;
						{formatNumber(
							inflationSummary["CSR - Staff contribution"]
						)}
						&emsp;RWF (
						{numToWords(
							inflationSummary["CSR - Staff contribution"]
						)}
						)
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["CSR - Cie contribution"] &&
				inflationSummary["CSR - Cie contribution"] > 0 ? (
					<div className="col-md-12">
						CSR - Cie contribution:&emsp;
						{formatNumber(
							inflationSummary["CSR - Cie contribution"]
						)}
						&emsp;RWF (
						{numToWords(inflationSummary["CSR - Cie contribution"])}
						)
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Net Pay"] &&
				inflationSummary["Net Pay"] > 0 ? (
					<div className="col-md-12 font-weight-bold">
						Net Pay:&emsp;
						{formatNumber(inflationSummary["Net Pay"])}
						&emsp;RWF ({numToWords(inflationSummary["Net Pay"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Community Health"] &&
				inflationSummary["Community Health"] > 0 ? (
					<div className="col-md-12">
						Community Health:&emsp;
						{formatNumber(inflationSummary["Community Health"])}
						&emsp;RWF (
						{numToWords(inflationSummary["Community Health"])})
					</div>
				) : (
					""
				)}
				{inflationSummary &&
				inflationSummary["Staff Total Deductions"] &&
				inflationSummary["Staff Total Deductions"] > 0 ? (
					<div className="col-md-12">
						Staff Total Deductions:&emsp;
						{formatNumber(
							inflationSummary["Staff Total Deductions"]
						)}
						&emsp;RWF (
						{numToWords(inflationSummary["Staff Total Deductions"])}
						)
					</div>
				) : (
					""
				)}
			</div>
			<hr />
			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={toggleCorrect}
						className="btn btn-outline-warning btn-block"
						title="Ask for corrections before approval."
					>
						Correction needed
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={toggleApprove}
						className="btn btn-outline-success btn-block"
						title="Approve inflation allowance ."
					>
						Approve
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={inflationDetails}
						className="btn btn-outline-success btn-block"
						title="Generate Excel file containing inflation allowance."
					>
						Details
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
					<span style={{ fontSize: "12px", fontWeight: "bold" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.allowanceAmount
							? "Allowance: " +
							  formatNumber(
									pfl.inflationAllowance.allowanceAmount
							  )
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.adjustmentAmount
							? "Adjustment: " +
							  formatNumber(
									pfl.inflationAllowance.adjustmentAmount
							  )
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.staffMaternityLeave
							? "Mat. Leave - Staff: " +
							  formatNumber(
									pfl.inflationAllowance.staffMaternityLeave
							  )
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.cieMaternityLeave
							? "Mat. Leave - Employer: " +
							  formatNumber(
									pfl.inflationAllowance.cieMaternityLeave
							  )
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.payeTPR
							? "P.A.Y.E.: " +
							  formatNumber(pfl.inflationAllowance.payeTPR)
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.staffCSR
							? "CSR - Staff: " +
							  formatNumber(pfl.inflationAllowance.staffCSR)
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance && pfl.inflationAllowance.cieCSR
							? "CSR - Employer: " +
							  formatNumber(pfl.inflationAllowance.cieCSR)
							: ""}
					</span>
					<span style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.cieCommunityHealth
							? "Community Health: " +
							  formatNumber(
									pfl.inflationAllowance.cieCommunityHealth
							  )
							: ""}
					</span>
					<span className="text-danger" style={{ fontSize: "12px" }}>
						&emsp;
						{pfl.inflationAllowance &&
						pfl.inflationAllowance.netSalary
							? "Net: " +
							  formatNumber(pfl.inflationAllowance.netSalary)
							: ""}
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Inflation Allowance Approval</h4>
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
			{/* {JSON.stringify(inflationSummary)} */}
		</Layout>
	);
};
export default withExco(approveInflatonAllowance);
