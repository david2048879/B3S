import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";

import Layout from "../../components/Layout";
import withAccountant from "./withAccountant";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber, numToWords } from "../../helpers/numberFormatter";

const reportAccEntry = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [months, setMonths] = useState([]);
	const [salAccountEntry, setSalAccountEntry] = useState([]);
	const [state, setState] = useState({
		yearSalary: new Date().getFullYear(),
		monthSalary: new Date().toLocaleString("default", { month: "long" }), //"May", ///
		viewEport: "VIEW",
		error: "",
		success: "",
	});
	const { yearSalary, monthSalary, viewEport, error, success } = state;

	useEffect(() => {
		getSalaryAccountEntry();
		loadMonths();
	}, [router]);

	const columns = [
		{
			title: "Contract Type",
			dataIndex: "contractType",
			key: "contractType",
		},
		{
			title: "Department",
			dataIndex: "departments",
			key: "departments",
		},
		{
			title: "Branch",
			dataIndex: "branchNames",
			key: "branchNames",
		},
		{
			title: "Function Type",
			dataIndex: "functionType",
			key: "functionType",
		},
		{
			title: "Basic Salary",
			dataIndex: "basicSalary",
			key: "basicSalary",
		},
		// {
		// 	title: "Techn. Allowance",
		// 	dataIndex: "technAllowance",
		// 	key: "technAllowance",
		// },
		{
			title: "Transport Allowance",
			dataIndex: "transportAllowance",
			key: "transportAllowance",
		},
		{
			title: "Incentives",
			dataIndex: "incentives",
			key: "incentives",
		},
		{
			title: "Gross Salary",
			dataIndex: "grossEarnings",
			key: "grossEarnings",
		},
		{
			title: "Net Salary",
			dataIndex: "netSalary",
			key: "netSalary",
		},
	];

	const getSalaryAccountEntry = async () => {
		setLoading(true);
		setSalAccountEntry([]);
		try {
			const response = await axios.put(
				`${API}/salaryAccountEntry`,
				{
					yearSalary,
					monthSalary,
					viewEport: "VIEW",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (Array.isArray(response.data.dataSources)) {
				setSalAccountEntry(response.data.dataSources);
			} else {
				setState({
					...state,
					success: "",
					error:
						error.response &&
						error.response.data &&
						error.response.data.error,
				});
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

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
			buttonText: "Save",
		});
	};

	const exportSalaryAccountEntry = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/salaryAccountEntry`,
				{
					yearSalary,
					monthSalary,
					viewEport: "EXPORT",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (
				Array.isArray(response.data.accountEntryArray) &&
				response.data.accountEntryArray.length > 0
			) {
				let csvContent = response.data.accountEntryArray
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "accountEntryArray.csv");
				document.body.appendChild(link);
				link.click();
				setLoading(false);
			} else {
				setLoading(false);
				setState({
					...state,
					error:
						error.response &&
						error.response.data &&
						error.response.data.error,
				});
			}
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
				<div className="col-md-2 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() =>
							router.push("/accountant/validateSalary")
						}
					>
						Back
					</button>
				</div>
				<div className="form-group col-md-3">
					{/* <label className="text-muted ">Month: </label> <br /> */}
					<select
						className="form-control mt-1"
						onChange={handleChange("monthSalary")}
						value={monthSalary}
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
				<div className="form-group col-md-3">
					{/* <label className="text-muted ">Year: </label> <br /> */}
					<input
						type="text"
						onChange={handleChange("yearSalary")}
						className="form-control mt-1"
						value={yearSalary}
						required
						title="Enter salary year here"
					/>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={getSalaryAccountEntry}
						className="btn btn-outline-success btn-block"
						title="View salary salary accounting entry details."
					>
						View
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={exportSalaryAccountEntry}
						className="btn btn-outline-danger btn-block"
						title="Generate Excel file containing all salary accounting entry details."
					>
						Export To Excel
					</button>
				</div>
			</div>

			{/* <div className="row">
				
			</div> */}
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Salary Acounting Entry</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addSalaryForm()}</div>
				</div>
				<div className="row alert alert-secondary">
					<div className="col-md-12">
						<Table dataSource={salAccountEntry} columns={columns} />
					</div>
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

			{/* {JSON.stringify(salAccountEntry)} */}
		</Layout>
	);
};
export default withAccountant(reportAccEntry);
