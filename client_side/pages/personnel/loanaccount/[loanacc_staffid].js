import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MinusCircleOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../../components/Layout";
import withHR from "../withHR";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { formatDate } from "../../../helpers/dateFormatter";

const LoanAccount = ({ token }) => {
	const router = useRouter();
	const { loanacc_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [newLoanAcc, setNewLoanAcc] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [banks, setBanks] = useState([]);
	const [state, setState] = useState({
		bankName: "",
		accountNumber: "",
		comment: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const { bankName, accountNumber, comment, error, success, buttonText } =
		state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		loadBanks();
	}, [router]);

	const getStaff = async () => {
		const response = await axios.get(`${API}/profile/${loanacc_staffid}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentStaff(response.data.myProfile);
		setState({ ...state, ...response.data.myProfile.loanAccount });
		setStartDate(
			response.data.myProfile.loanAccount &&
				response.data.myProfile.loanAccount.startDate &&
				new Date(response.data.myProfile.loanAccount.startDate)
		);
		setEndDate(
			response.data.myProfile.loanAccount &&
				response.data.myProfile.loanAccount.endDate &&
				new Date(response.data.myProfile.loanAccount.endDate)
		);
	};

	const loadBanks = async () => {
		const response = await axios.get(`${API}/banks`);
		setBanks(response.data.banks);
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

	const handleNewLoanAcc = () => {
		setState({
			...state,
			bankName: "",
			accountNumber: "",
			comment: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(null);
		setEndDate(null);
		setNewLoanAcc(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/addLoanAccount/${currentStaff._id}`,
				{
					bankName,
					accountNumber,
					comment,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			setNewLoanAcc(false);
			setState({
				...state,
				bankName: "",
				accountNumber: "",
				comment: "",
				buttonText: "Save",
				success: response.data && response.data.message,
			});
			setStartDate(null);
			setEndDate(null);
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

	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/loanAccount/${currentStaff._id}`,
				{
					bankName,
					accountNumber,
					comment,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			setNewLoanAcc(false);
			setState({
				...state,
				bankName: "",
				accountNumber: "",
				comment: "",
				buttonText: "Save",
				success: response.data && response.data.message,
			});
			setStartDate(null);
			setEndDate(null);
		} catch (error) {
			// console.log(error)
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

	const loanAccForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Bank: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("bankName")}
						value={bankName}
					>
						<option></option>
						{banks.length > 0 &&
							banks.map((b, i) => (
								<option key={i} value={b.bankName}>
									{b.bankName}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Account Number: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("accountNumber")}
						className="form-control"
						value={accountNumber}
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Loan Start Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={startDate}
						onChange={(date) => {
							setStartDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Loan End Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={endDate}
						onChange={(date) => {
							setEndDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
			</div>

			<div className="form-group">
				<label className="text-muted">Comment</label>
				<textarea
					onChange={handleChange("comment")}
					value={comment}
					className="form-control"
					rows="3"
				/>
			</div>

			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/personnel/payroll")}
					>
						Back
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleNewLoanAcc}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new employee."
					>
						New
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={newLoanAcc ? handleSubmit : handleUpdate}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listLoanAccounts = () =>
		currentStaff.loanAccountsHistory &&
		currentStaff.loanAccountsHistory.map((lac, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					From&emsp;
					<span className="text-muted">
						{lac.startDate
							? formatDate(lac.startDate)
							: "Start date is not recorded"}
					</span>
					&emsp;To&emsp;
					<span className="text-muted">
						{lac.endDate
							? formatDate(lac.endDate)
							: "End date is not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{lac.bankName
							? lac.bankName
							: "Bank name was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{lac.accountNumber ? lac.accountNumber : "Account number was not recorded!"}
					</span>
					{/* <span
						className="btn btn-sm float-right"
						// onClick={() => toggle(pfl)}
						title="Delete this former appointment."
					>
						<MinusCircleOutlined className="text-danger" />
					</span> */}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Loan Account</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}
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
				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentStaff.empNames}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.empCode ? currentStaff.empCode : ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.phone ? currentStaff.phone : ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.email ? currentStaff.email : ""}
						</h6>
						&emsp;
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{loanAccForm()}</div>
				</div>
				{currentStaff &&
					currentStaff.loanAccountsHistory &&
					currentStaff.loanAccountsHistory.length > 0 && (
						<h6
							style={{
								fontSize: "16px",
								color: "purple",
								fontWeight: "bold",
							}}
						>
							PREVIOUS LOAN ACCOUNTS
						</h6>
					)}
				{currentStaff &&
					currentStaff.loanAccountsHistory &&
					currentStaff.loanAccountsHistory.length > 0 &&
					listLoanAccounts()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withHR(LoanAccount);
