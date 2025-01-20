import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import withStaff from "../withStaff";
import { isAuth } from "../../../helpers/authToken";
import { API } from "../../../config";
import { formatNumber, numToWords } from "../../../helpers/numberFormatter";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const Salary = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [currentSalary, setCurrentSalary] = useState({});
	const [state, setState] = useState({
		yearSalary: "",
		monthSalary: "",
		error: "",
		success: "",
	});
	const { yearSalary, monthSalary, error, success } = state;

	useEffect(() => {
		getStaff();
	}, [router]);

	const salaryYears = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
	const salaryMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const getStaff = async () => {
		setLoading(true);
		const response = await axios.get(
			`${API}/staff_email/${isAuth().email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.staffProfile);
		setLoading(false);
	};

	const getSalary = async () => {
		setCurrentSalary({});
		if (!yearSalary || !monthSalary) {
			setState({
				...state,
				error: "Please select a month and year of which you want to view salary!",
			});
			return;
		}
		setLoading(true);
		try {
			const response = await axios.post(
				`${API}/archivePaySlip/${currentStaff.empCode}`,
				{ yearSalary, monthSalary },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCurrentSalary(response.data);
			setLoading(false);
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

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const addPeriodForm = () => (
		<Fragment>
			<div className="row ">
				<div className="col-md-5">
					<select
						className="form-control"
						onChange={handleChange("monthSalary")}
						value={monthSalary}
						title="Select a salary month"
					>
						<option></option>
						{salaryMonths.length > 0 &&
							salaryMonths.map((im, i) => (
								<option key={i} value={im}>
									{im}
								</option>
							))}
					</select>
				</div>
				<div className="col-md-5 ">
					<select
						className="form-control"
						onChange={handleChange("yearSalary")}
						value={yearSalary}
						title="Select a salary year"
					>
						<option></option>
						{salaryYears.length > 0 &&
							salaryYears.map((iy, i) => (
								<option key={i} value={iy}>
									{iy}
								</option>
							))}
					</select>
				</div>
				<div className="col-md-2 mt-1 ">
					<span
						style={{ cursor: "pointer" }}
						onClick={getSalary}
						className="btn btn-sm btn-warning ml-3"
					>
						View
					</span>
				</div>
			</div>
		</Fragment>
	);
	const listOtherAllowances = () =>
		currentSalary.currentMonthSalary.otherAllowances.map((oa, i) => (
			<div key={i} className="p-1">
				<div>
					&emsp;
					<span>{oa.allowanceName} :</span>
					&emsp;
					<span>
						{formatNumber(oa.allowanceAmount)}&emsp;RWF (
						{numToWords(oa.allowanceAmount)})
					</span>
					&emsp;&emsp;&emsp;&emsp;
				</div>
			</div>
		));

	const listOtherDeductions = () =>
		currentSalary.currentMonthSalary.otherDeductions.map((od, i) => (
			<div key={i} className="p-1">
				<div>
					&emsp;
					<span>{od.deductionName} :</span>
					&emsp;
					<span>
						{formatNumber(od.deductionAmount)}&emsp;RWF (
						{numToWords(od.deductionAmount)})
					</span>
					&emsp;&emsp;&emsp;&emsp;
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Salary Details</h4>
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
				<div className="row alert alert-primary text-center">
					<div className="col-md-12 mt-1">
						<h6
							className="font-weight-bold"
							style={{ color: "black" }}
						>
							{currentStaff.empNames}
						</h6>
					</div>
					<div className="col-12">
						<span style={{ color: "black" }}>
							Employee Code:{" "}
							{currentStaff.empCode ? currentStaff.empCode : ""}
						</span>
						&emsp;
						{currentStaff.phone && (
							<span>
								Phone Number:{" "}
								{currentStaff.phone ? currentStaff.phone : ""}
							</span>
						)}
						&emsp;
						<span style={{ color: "black" }}>
							Email:{" "}
							{currentStaff.email ? currentStaff.email : ""}
						</span>
						&emsp;
						<span style={{ color: "black" }}>
							Job Title:{" "}
							{currentStaff.currentAppointment &&
							currentStaff.currentAppointment.jobTitle
								? currentStaff.currentAppointment.jobTitle
								: ""}
						</span>
						&emsp;
						<span style={{ color: "black" }}>
							Department:{" "}
							{currentStaff.currentAppointment &&
							currentStaff.currentAppointment.department
								? currentStaff.currentAppointment.department
								: ""}
						</span>
					</div>
					<div className="col-md-12 mt-1">
						<hr />
						{addPeriodForm()}
					</div>
				</div>

				<div className="row">
					<div className="col-md-12">
						<span
							style={{ cursor: "pointer" }}
							onClick={() => router.push("/dashboard")}
							className="btn btn-sm btn-info float-right ml-3"
						>
							Back
						</span>
					</div>
				</div>

				<div className="row alert text-center">
					{currentSalary &&
						currentSalary.currentMonthSalary &&
						currentSalary.currentMonthSalary.netSalary > 0 && (
							<div className="col-md-12">
								<h6
									style={{ color: "red", fontWeight: "bold" }}
								>
									{currentSalary.currentMonthSalary &&
									currentSalary.currentMonthSalary.salaryMonth
										? currentSalary.currentMonthSalary
												.salaryMonth
										: "No current salary pay found for this imployee!"}{" "}
									{currentSalary.currentMonthSalary &&
									currentSalary.currentMonthSalary.salaryYear
										? currentSalary.currentMonthSalary
												.salaryYear
										: ""}
								</h6>
								<hr />
							</div>
						)}
				</div>
				{currentSalary &&
					currentSalary.currentMonthSalary &&
					currentSalary.currentMonthSalary.netSalary > 0 && (
						<div className="row">
							<div
								className="col-md-12 alert text-center"
								style={{ backgroundColor: "white" }}
							>
								{currentSalary &&
									currentSalary.currentMonthSalary && (
										<span
											className="font-weight-bold"
											style={{ color: "black" }}
										>
											INCOME
										</span>
									)}
							</div>
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.basicSalary >
									0 && (
									<div className="col-md-12">
										Basic Salary:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.basicSalary
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.basicSalary
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.transportAllowance > 0 && (
									<div className="col-md-12">
										Transport Allowance:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.transportAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.transportAllowance
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.technAllowance > 0 && (
									<div className="col-md-12">
										Techn. Allowance:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.technAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.technAllowance
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.rentalCostAllowance > 0 && (
									<div className="col-md-12">
										Rental Cost Allowance:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.rentalCostAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.rentalCostAllowance
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.responsibilityAllowance > 0 && (
									<div className="col-md-12">
										Responsibility Allowance:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.responsibilityAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.responsibilityAllowance
										)}
										)
									</div>
								)}
							{/* currentStaff &&
								currentStaff.currentMonthSalary && */}
							{currentSalary.currentMonthSalary
								.totalOtherAllowances > 0 && (
								<div className="col-md-12">
									Other Allowances:&emsp;
									{formatNumber(
										currentSalary.currentMonthSalary
											.totalOtherAllowances
									)}
									&emsp;RWF (
									{numToWords(
										currentSalary.currentMonthSalary
											.totalOtherAllowances
									)}
									)
								</div>
							)}
							{listOtherAllowances()}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.grossEarnings >
									0 && (
									<div className="col-md-12 text-right font-italic">
										Gross Earnings:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.grossEarnings
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.grossEarnings
										)}
										)
									</div>
								)}
							&emsp;
							<div
								className="col-md-12 alert text-center"
								style={{ backgroundColor: "white" }}
							>
								{currentSalary && currentSalary.empNames && (
									<span
										className="font-weight-bold"
										style={{ color: "black" }}
									>
										COMPANY CONTRIBUTION
									</span>
								)}
							</div>
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.cieMaternityLeave > 0 && (
									<div className="col-md-12">
										Maternity Leave:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.cieMaternityLeave
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.cieMaternityLeave
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.cieCSR > 0 && (
									<div className="col-md-12">
										CSR Employer Contributions:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.cieCSR
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.cieCSR
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.cieCommunityHealth > 0 && (
									<div className="col-md-12">
										Community Healthy Based Scheme
										0.5%:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.cieCommunityHealth
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.cieCommunityHealth
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.cieTotalContribution > 0 && (
									<div className="col-md-12 text-right font-italic">
										Total Company Cotribution:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.cieTotalContribution
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.cieTotalContribution
										)}
										)
									</div>
								)}
							&emsp;
							<div
								className="col-md-12 alert text-center"
								style={{ backgroundColor: "white" }}
							>
								{currentSalary && currentSalary.empNames && (
									<span
										className="font-weight-bold"
										style={{ color: "black" }}
									>
										DEDUCTIONS
									</span>
								)}
							</div>
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary
									.staffMaternityLeave > 0 && (
									<div className="col-md-12">
										Mat. Leave Staff Deduction:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.staffMaternityLeave
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.staffMaternityLeave
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.payeTPR >
									0 && (
									<div className="col-md-12">
										P.A.Y.E:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.payeTPR
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.payeTPR
										)}
										)
									</div>
								)}
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.staffCSR >
									0 && (
									<div className="col-md-12">
										CSR Staff Deduction:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.staffCSR
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.staffCSR
										)}
										)
									</div>
								)}
							{/* currentSalary &&
								currentSalary.currentMonthSalary && */}
							{currentSalary.currentMonthSalary
								.totalOtherDeductions > 0 && (
								<div className="col-md-12">
									Other deductions (Staff Savings -
									Consolidated, etc.):&emsp;
									{formatNumber(
										currentSalary.currentMonthSalary
											.totalOtherDeductions
									)}
									&emsp;RWF (
									{numToWords(
										currentSalary.currentMonthSalary
											.totalOtherDeductions
									)}
									)
								</div>
							)}
							{listOtherDeductions()}
							{/* currentSalary &&
								currentSalary.currentMonthSalary && */}
							{currentSalary.currentMonthSalary
								.totalStaffDeductions > 0 && (
								<div className="col-md-12 text-right font-italic">
									Total Deductions:&emsp;
									{formatNumber(
										currentSalary.currentMonthSalary
											.totalStaffDeductions
									)}
									&emsp;RWF (
									{numToWords(
										currentSalary.currentMonthSalary
											.totalStaffDeductions
									)}
									)
								</div>
							)}
							&emsp;
							{currentSalary &&
								currentSalary.currentMonthSalary &&
								currentSalary.currentMonthSalary.netSalary >
									0 && (
									<div className="col-md-12 text-center alert font-weight-bold bg-warning">
										Net Pay:&emsp;
										{formatNumber(
											currentSalary.currentMonthSalary
												.netSalary
										)}
										&emsp;RWF (
										{numToWords(
											currentSalary.currentMonthSalary
												.netSalary
										)}
										)
										<br />
										{currentSalary &&
											currentSalary.currentMonthSalary &&
											currentSalary.currentMonthSalary
												.bankName && (
												<span>
													&emsp;Bank:&emsp;
													{
														currentSalary
															.currentMonthSalary
															.bankName
													}
												</span>
											)}
										{currentSalary &&
											currentSalary.currentMonthSalary &&
											currentSalary.currentMonthSalary
												.accountNumber && (
												<span>
													&emsp;Account:&emsp;
													{
														currentSalary
															.currentMonthSalary
															.accountNumber
													}
												</span>
											)}
									</div>
								)}
						</div>
					)}
			</div>
			{/* {JSON.stringify(currentSalary)} */}
		</Layout>
	);
};
export default withStaff(Salary);
