import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MinusCircleOutlined } from "@ant-design/icons";
import Layout from "../../../components/Layout";
import withHR from "../withHR";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { formatNumber } from "../../../helpers/numberFormatter";
import { formatDate } from "../../../helpers/dateFormatter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Deduction = ({ token }) => {
	const router = useRouter();
	const { deduction_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [staffDeduction, setStaffDeduction] = useState([]);
	const [deductions, setDeductions] = useState([]);
	const [state, setState] = useState({
		deductionName: "",
		deductionComment: "",
		deductionAmount: 0,
		isRepeated: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		deductionName,
		deductionComment,
		deductionAmount,
		isRepeated,
		error,
		success,
		buttonText,
	} = state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		loadDeductions();
	}, [router]);

	const loadDeductions = async () => {
		const response = await axios.get(`${API}/deductions`);
		setDeductions(response.data.deductions);
	};

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/profile/${deduction_staffid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.myProfile);
		if (
			response.data.myProfile &&
			response.data.myProfile.currentMonthSalary &&
			response.data.myProfile.currentMonthSalary.otherDeductions
		) {
			setStaffDeduction(
				response.data.myProfile.currentMonthSalary.otherDeductions
			);
		} else {
			setStaffDeduction([]);
		}
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

	const handleNewDeduction = () => {
		setState({
			...state,
			deductionAmount: 0,
			deductionName: "",
			deductionComment: "",
			isRepeated: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const removeDeduction = async (deduct) => {
		setLoading(true);
		if (
			currentStaff &&
			currentStaff.currentMonthSalary &&
			currentStaff.currentMonthSalary.otherDeductions
		)
			setStaffDeduction(currentStaff.currentMonthSalary.otherDeductions);
		const deductionIndex = staffDeduction.findIndex(
			(deduction) => deduction.deductionName === deduct.deductionName
		);
		if (deductionIndex !== -1) staffDeduction.splice(deductionIndex, 1);

		//======================================Save array of education to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/otherDeduction/${currentStaff._id}`,
				{
					staffDeduction,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewDeduction();
			setLoading(false);
			getStaff();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		//======================Adding new salary deduction to the array
		if (
			currentStaff &&
			currentStaff.currentMonthSalary &&
			currentStaff.currentMonthSalary.otherDeductions
		)
			setStaffDeduction(currentStaff.currentMonthSalary.otherDeductions);
		if (!deductionName || deductionName === null) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Please select a deduction name!",
			});
			return;
		}

		if (!isRepeated || isRepeated === null || isRepeated === "") {
			isRepeated = "YES";
		}
		if (
			!deductionComment ||
			deductionComment === null ||
			deductionComment === ""
		) {
			deductionComment = "No comment";
		}

		if (
			deductionName !== "SFAR" &&
			(!deductionAmount || deductionAmount <= 0)
		) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Please provide deduction amount!",
			});
			return;
		}

		const deductionIndex = staffDeduction.findIndex(
			(deduction) => deduction.deductionName === deductionName
		);
		if (endDate && endDate && endDate < startDate) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "End date must be greater than start date for a deduction!",
			});
			return;
		} else {
			setState({
				...state,
				isRepeated: "YES",
			});
		}

		if (deductionIndex !== -1) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Looks like that salary deduction has been recorded for the current staff!",
			});
			return;
		} else {
			let newDeduction = {};
			newDeduction.deductionName = deductionName;
			newDeduction.deductionComment = deductionComment;
			newDeduction.deductionAmount = deductionAmount;
			newDeduction.isRepeated = isRepeated;
			newDeduction.startDate = startDate;
			newDeduction.endDate = endDate;
			staffDeduction.push(newDeduction);
		}

		//======================================Save array of deduction to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/otherDeduction/${currentStaff._id}`,
				{
					staffDeduction,
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
			getStaff();
			handleNewDeduction();
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

	const deductionForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">Name: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("deductionName")}
						value={deductionName}
						title="Select a deduction you wish to add for the current employee."
					>
						<option></option>
						{deductions.length > 0 &&
							deductions.map((deduct, i) => (
								<option key={i} value={deduct.deductionName}>
									{deduct.deductionName}
								</option>
							))}
					</select>
				</div>
				{deductionName === "SFAR" ? (
					<div className="form-group col-md-2">
						<label className="text-muted ">Amount: </label> <br />
						<input
							type="number"
							onChange={handleChange("deductionAmount")}
							className="form-control"
							value={deductionAmount}
							title={formatNumber(deductionAmount)}
							disabled
						/>
					</div>
				) : (
					<div className="form-group col-md-2">
						<label className="text-muted ">Amount: </label> <br />
						<input
							type="number"
							onChange={handleChange("deductionAmount")}
							className="form-control"
							value={deductionAmount}
							title={formatNumber(deductionAmount)}
						/>
					</div>
				)}
				<div className="form-group col-md-2">
					<label className="text-muted ">
						Apply for next month:{" "}
					</label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("isRepeated")}
						value={isRepeated}
						title="Will this deduction apply next month?"
					>
						<option></option>
						<option key="YES" value="YES">
							YES
						</option>
						<option key="NO" value="NO">
							NO
						</option>
					</select>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Start Date:</label>
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
				<div className="form-group col-md-2">
					<label className="text-muted ">End Date:</label>
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
			<div className="row">
				<div className="form-group col-md-12">
					<label className="text-muted ">Description: </label> <br />
					<input
						type="text"
						onChange={handleChange("deductionComment")}
						className="form-control"
						value={deductionComment}
						title="Enter a brief description of the salary deduction you wish to add for the current employee."
					/>
				</div>
			</div>

			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/personnel/monthlySalary")}
					>
						Back
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleNewDeduction}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new salary deduction for the employee."
					>
						New
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listDeduction = () =>
		staffDeduction &&
		staffDeduction.map((deduct, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span className="text-muted">
						{deduct.deductionName && deduct.deductionName}
					</span>
					&emsp;&emsp;
					<span className="text-muted">
						{deduct.deductionAmount
							? formatNumber(deduct.deductionAmount)
							: 0}
					</span>
					&emsp;
					<span className="text-muted">RWF</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{deduct.startDate ? formatDate(deduct.startDate) : ""}
					</span>
					<span className="text-muted " style={{ fontSize: 12 }}>
						{deduct.endDate
							? "  ==>  " + formatDate(deduct.endDate)
							: ""}
					</span>
					&emsp;&emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{deduct.deductionComment ? deduct.deductionComment : ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => removeDeduction(deduct)}
						title="Delete this salary deduction for the current staff."
					>
						<MinusCircleOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Salary Deductions</h4>
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
					<div className="col-md-12">{deductionForm()}</div>
				</div>

				{currentStaff &&
					currentStaff.currentMonthSalary &&
					currentStaff.currentMonthSalary.otherDeductions.length >
						0 &&
					listDeduction()}
			</div>
			{/* {JSON.stringify(sta)} */}
		</Layout>
	);
};
export default withHR(Deduction);
