import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const initSalary = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [months, setMonths] = useState([]);

	const [state, setState] = useState({
		salaryYear: "", //new Date().getFullYear(),
		salaryMonth: "", //new Date().toLocaleString("default", { month: "long" }),
		error: "",
		success: "",
		buttonText: "Initialize monthly salary",
	});
	const { salaryYear, salaryMonth, error, success, buttonText } = state;

	useEffect(() => {
		loadMonths();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const loadMonths = async () => {
		const response = await axios.get(`${API}/months`);
		setMonths(response.data.months);
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Initialize monthly salary",
		});
	};

	const initializeMonthlySalary = async () => {
		if (
			!salaryMonth ||
			salaryMonth === "" ||
			salaryMonth === undefined ||
			salaryMonth.length < 1
		) {
			setState({
				...state,
				buttonText: "Initialize monthly salary",
				error: "Please select next MONTH and YEAR of salary!",
			});
			return;
		} else if (
			!salaryYear ||
			salaryYear === "" ||
			salaryYear === undefined
		) {
			setState({
				...state,
				buttonText: "Initialize monthly salary",
				error: "Please select next MONTH and YEAR of salary!",
			});
			return;
		} else {
			setLoading(true);
			try {
				const response = await axios.put(
					`${API}/initializeSalary/`,
					{ currentMonth: salaryMonth, currentYear: salaryYear },
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
		}
	};

	const newSalaryForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Month: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("salaryMonth")}
						value={salaryMonth}
						title="Salary month"
					>
						<option></option>
						{months.length > 0 &&
							months.map((mnth, i) => (
								<option key={i} value={mnth.MonthName}>
									{mnth.MonthName}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-6">
					<label className="text-muted ">Year: </label> <br />
					<input
						type="text"
						onChange={handleChange("salaryYear")}
						className="form-control"
						value={salaryYear}
						required
						title="Enter salary year here"
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
				<div className="col-md-8 mt-1">
					<button
						onClick={initializeMonthlySalary}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Initialize new Monthly Salary</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert bg-light">
					<div className="col-md-12">
						<h6 className="text-danger font-weight-bold">
							Please note that this is IRREVERSIBLE operation and
							the current month salary will be archived
							permanently. So, before initializing the new monthly
							salary make sure:
						</h6>
					</div>
					<br />
					<div className="col-md-12">
						<h6 style={{ fontSize: "16px", color: "black" }}>
							1. The current monthly salary has been approved by
							an executive,
						</h6>

						<h6 style={{ fontSize: "16px", color: "black" }}>
							2. The current monthly salary has been dispached to
							respective employee's account.
						</h6>
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{newSalaryForm()}</div>
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
			</div>
			{/* {JSON.stringify(currentStaff && currentStaff.currentMonthSalary)} */}
		</Layout>
	);
};
export default withHR(initSalary);
