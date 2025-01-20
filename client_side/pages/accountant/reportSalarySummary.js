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

const reportSalarySummary = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [months, setMonths] = useState([]);
	const [summaryData, setSummaryData] = useState([]);
	const [state, setState] = useState({
		yearSalary: new Date().getFullYear(),
		monthSalary: new Date().toLocaleString("default", { month: "long" }),
		viewEport: "VIEW",
		error: "",
		success: "",
	});
	const { yearSalary, monthSalary, viewEport, error, success } = state;

	useEffect(() => {
		getSalarySummary();
		loadMonths();
	}, [router]);

	const columns = [
		{
			title: "TRANSACTIONS",
			dataIndex: "transaction",
			key: "transaction",
		},
		{
			title: "PERIOD AMOUNT",
			dataIndex: "periodAmount",
			key: "periodAmount",
		},
	];

	const getSalarySummary = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/paySummarySignature`,
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

			if (
				response.data.summarySalaryReport &&
				response.data.summarySalaryReport.basicSalary > 0
			) {
				makeDataForTable(response.data.summarySalaryReport);
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

	const makeDataForTable = async (receivedObject) => {
		let dataSource = [];
		dataSource.push({
			transaction: "Basic Salary",
			periodAmount: formatNumber(receivedObject.basicSalary),
		});
		dataSource.push({
			transaction: "Bonus/Profit sharing",
			periodAmount: formatNumber(receivedObject.bonus),
		});
		dataSource.push({
			transaction: "Adjustments",
			periodAmount: formatNumber(receivedObject.adjustment),
		});
		dataSource.push({
			transaction: "Incentives",
			periodAmount: formatNumber(receivedObject.incentives),
		});
		dataSource.push({
			transaction: "Overtime Incentive Amount",
			periodAmount: formatNumber(receivedObject.overtime),
		});
		dataSource.push({
			transaction: "Responsibility Allowance",
			periodAmount: formatNumber(receivedObject.responsibilityAllowance),
		});
		dataSource.push({
			transaction: "Internet Allowance",
			periodAmount: formatNumber(receivedObject.internetAllowance),
		});
		dataSource.push({
			transaction: "Rental Cost Allowance",
			periodAmount: formatNumber(receivedObject.rentalCostAllowance),
		});
		dataSource.push({
			transaction: "Techn. Allowance",
			periodAmount: formatNumber(receivedObject.technAllowance),
		});
		dataSource.push({
			transaction: "Transport Allowance",
			periodAmount: formatNumber(receivedObject.transportAllowance),
		});
		dataSource.push({
			transaction: "Teller Allowance",
			periodAmount: formatNumber(receivedObject.tellerAllowance),
		});
		dataSource.push({
			transaction: "Total Income",
			periodAmount: formatNumber(receivedObject.grossEarnings),
		});
		dataSource.push({
			transaction: "Communication Allowance Deficit",
			periodAmount: formatNumber(receivedObject.communicationAllowance),
		});
		dataSource.push({
			transaction: "Lunch Payments",
			periodAmount: formatNumber(receivedObject.lunchPayments),
		});
		dataSource.push({
			transaction: "Sport and Fitness Fees",
			periodAmount: formatNumber(receivedObject.sportsFitnessFees),
		});
		dataSource.push({
			transaction: "Advance Deductions",
			periodAmount: formatNumber(receivedObject.advanceDeduction),
		});
		dataSource.push({
			transaction: "Medical Expenses Deficit",
			periodAmount: formatNumber(receivedObject.medicalExpensesDeficit),
		});
		dataSource.push({
			transaction: "Sanlam Life Insurance",
			periodAmount: formatNumber(receivedObject.sanlamLifeInsurance),
		});
		dataSource.push({
			transaction: "Materninty Leave - Employee Deduction",
			periodAmount: formatNumber(receivedObject.matLeaveEmployeeDed),
		});
		dataSource.push({
			transaction: "SFAR",
			periodAmount: formatNumber(receivedObject.SFAR),
		});
		dataSource.push({
			transaction: "Teller Shortage Deductions",
			periodAmount: formatNumber(receivedObject.shortageDeductions),
		});
		dataSource.push({
			transaction: "P.A.Y.E",
			periodAmount: formatNumber(receivedObject.PAYE),
		});
		dataSource.push({
			transaction: "Staff Loan consolidated",
			periodAmount: formatNumber(receivedObject.staffLoansConsolidated),
		});
		dataSource.push({
			transaction: "Staff Savings - Consolidated",
			periodAmount: formatNumber(receivedObject.staffSavingsConsolidated),
		});

		dataSource.push({
			transaction: "CSR Employee Deduction",
			periodAmount: formatNumber(receivedObject.CSREmployeeDeduction),
		});
		dataSource.push({
			transaction: "Maternity Leave - Company Contribution",
			periodAmount: formatNumber(receivedObject.matLeaveCompContrib),
		});

		dataSource.push({
			transaction: "CSR Employer Contribution",
			periodAmount: formatNumber(receivedObject.CSREmployerContr),
		});
		dataSource.push({
			transaction: "Community Healthy Based Scheme",
			periodAmount: formatNumber(
				receivedObject.communityHealthyBasedScheme
			),
		});
		dataSource.push({
			transaction: "Total Deductions",
			periodAmount: formatNumber(receivedObject.totalDeductions),
		});
		dataSource.push({
			transaction: "Net Salary",
			periodAmount: formatNumber(receivedObject.netSalary),
		});

		setSummaryData(dataSource);
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

	const exportSalarySummary = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/paySummarySignature`,
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
				Array.isArray(response.data.summarySalaryReport) &&
				response.data.summarySalaryReport.length > 0
			) {
				let csvContent = response.data.summarySalaryReport
					.map((e) => e.join(","))
					.join("\n");
				const encodedUri =
					"data:text/csv;charset=utf-8," +
					encodeURIComponent(csvContent);
				const link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "salarySummary.csv");
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
						onClick={getSalarySummary}
						className="btn btn-outline-success btn-block"
						title="View salary summary of selected period."
					>
						View
					</button>
				</div>
				<div className="col-md-2 mt-1">
					<button
						onClick={exportSalarySummary}
						className="btn btn-outline-danger btn-block"
						title="Generate Excel file containing salary summary of selected period."
					>
						Export To Excel
					</button>
				</div>
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Summary of the Salary</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addSalaryForm()}</div>
				</div>
				<div className="row alert alert-secondary ">
					<div className="col-md-4 offset-4">
						<Table dataSource={summaryData} columns={columns} />
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

			{/* {JSON.stringify(summaryData)} */}
		</Layout>
	);
};
export default withAccountant(reportSalarySummary);
