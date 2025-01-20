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

const Allowance = ({ token }) => {
	const router = useRouter();
	const { allowance_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [staffAllowance, setStaffAllowance] = useState([]);
	const [allowances, setAllowances] = useState([]);
	const [state, setState] = useState({
		allowanceName: "",
		allowanceComment: "",
		allowanceAmount: "",
		isRepeated: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		allowanceName,
		allowanceComment,
		allowanceAmount,
		isRepeated,
		error,
		success,
		buttonText,
	} = state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		loadAllowances();
	}, [router]);

	const loadAllowances = async () => {
		const response = await axios.get(`${API}/allowances`);
		setAllowances(response.data.allowances);
	};

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/profile/${allowance_staffid}`,
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
			response.data.myProfile.currentMonthSalary.otherAllowances
		) {
			setStaffAllowance(
				response.data.myProfile.currentMonthSalary.otherAllowances
			);
		} else {
			setStaffAllowance([]);
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

	const handleNewAllowance = () => {
		setState({
			...state,
			allowanceAmount: 0,
			allowanceName: "",
			allowanceComment: "",
			isRepeated: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const removeAllowance = async (deduct) => {
		setLoading(true);
		if (
			currentStaff &&
			currentStaff.currentMonthSalary &&
			currentStaff.currentMonthSalary.otherAllowances
		)
			setStaffAllowance(currentStaff.currentMonthSalary.otherAllowances);
		const allowanceIndex = staffAllowance.findIndex(
			(allowance) => allowance.allowanceName === deduct.allowanceName
		);
		if (allowanceIndex !== -1) staffAllowance.splice(allowanceIndex, 1);

		//======================================Save array of allowance to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/otherAllowance/${currentStaff._id}`,
				{
					staffAllowance,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewAllowance();
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

		//======================Adding new salary allowance to the array
		if (
			currentStaff &&
			currentStaff.currentMonthSalary &&
			currentStaff.currentMonthSalary.otherAllowances
		)
			setStaffAllowance(currentStaff.currentMonthSalary.otherAllowances);
		if (!allowanceName || allowanceName === null) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Please select an allowance name!",
			});
			return;
		}

		if (!isRepeated || isRepeated === null || isRepeated === "") {
			isRepeated = "YES";
		}
		if (
			!allowanceComment ||
			allowanceComment === null ||
			allowanceComment === ""
		) {
			allowanceComment = "No comment";
		}

		if (!allowanceAmount || allowanceAmount <= 0) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Please provide allowance amount!",
			});
			return;
		}
		if (endDate && endDate && endDate < startDate) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "End date must be greater than start date for an allowance!",
			});
			return;
		} else {
			setState({
				...state,
				isRepeated: "YES",
			});
		}

		const allowanceIndex = staffAllowance.findIndex(
			(allowance) => allowance.allowanceName === allowanceName
		);
		if (allowanceIndex !== -1) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Looks like that salary allowance has been recorded for the current staff!",
			});
			return;
		} else {
			let newAllowance = {};
			newAllowance.allowanceName = allowanceName;
			newAllowance.allowanceComment = allowanceComment;
			newAllowance.allowanceAmount = allowanceAmount;
			newAllowance.isRepeated = isRepeated;
			newAllowance.startDate = startDate;
			newAllowance.endDate = endDate;
			staffAllowance.push(newAllowance);
		}

		//======================================Save array of allowance to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/otherAllowance/${currentStaff._id}`,
				{
					staffAllowance,
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
			handleNewAllowance();
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

	const allowanceForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">Name: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("allowanceName")}
						value={allowanceName}
						title="Select an allowance you wish to add for the current employee."
					>
						<option></option>
						{allowances.length > 0 &&
							allowances.map((allowa, i) => (
								<option key={i} value={allowa.allowanceName}>
									{allowa.allowanceName}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-2">
					<label className="text-muted ">Amount: </label> <br />
					<input
						type="number"
						onChange={handleChange("allowanceAmount")}
						className="form-control"
						value={allowanceAmount}
						title={formatNumber(allowanceAmount)}
					/>
				</div>
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
						onChange={handleChange("allowanceComment")}
						className="form-control"
						value={allowanceComment}
						title="Enter a brief description of the salary allowance you wish to add for the current employee."
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
						onClick={handleNewAllowance}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new salary allowance for the employee."
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

	const listAllowance = () =>
		staffAllowance &&
		staffAllowance.map((allowa, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span className="text-muted">
						{allowa.allowanceName && allowa.allowanceName}
					</span>
					&emsp;&emsp;
					<span className="text-muted">
						{allowa.allowanceAmount
							? formatNumber(allowa.allowanceAmount)
							: 0}
					</span>
					&emsp;
					<span className="text-muted">RWF</span>&emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{allowa.startDate ? formatDate(allowa.startDate) : ""}
					</span>
					<span className="text-muted " style={{ fontSize: 12 }}>
						{allowa.endDate
							? "  ==>  " + formatDate(allowa.endDate)
							: ""}
					</span>
					&emsp;&emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{allowa.allowanceComment ? allowa.allowanceComment : ""}
					</span>
					&emsp;&emsp;
					<span
						className="btn btn-sm float-right"
						onClick={() => removeAllowance(allowa)}
						title="Delete this salary allowance for the current staff."
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
					<h4>Salary Allowances</h4>
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
					<div className="col-md-12">{allowanceForm()}</div>
				</div>

				{currentStaff &&
					currentStaff.currentMonthSalary &&
					currentStaff.currentMonthSalary.otherAllowances.length >
						0 &&
					listAllowance()}
			</div>
			{/* {JSON.stringify(staffAllowance)} */}
		</Layout>
	);
};
export default withHR(Allowance);
