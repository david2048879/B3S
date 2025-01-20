import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { API } from "../../../config";
// import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { formatNumber, numToWords } from "../../../helpers/numberFormatter";
// import { formatDate } from "../../../helpers/dateFormatter";
import withExco from "../withExco";

const salaryApproval = ({ token }) => {
	const router = useRouter();
	const { approve_salary_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});

	useEffect(() => {
		getStaff();
	}, [router]);

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/profileExco/${approve_salary_staffid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.myProfile);
	};

	const listOtherAllowances = () =>
		currentStaff.currentMonthSalary.otherAllowances.map((oa, i) => (
			<div key={i} className="p-1">
				<div style={{ width: "100vh" }}>
					&emsp;
					<span>{oa.allowanceName} :</span>
					&emsp;
					<span>
						{formatNumber(oa.allowanceAmount)}&emsp;RWF (
						{numToWords(oa.allowanceAmount)})
					</span>
				</div>
			</div>
		));

	const listOtherDeductions = () =>
		currentStaff.currentMonthSalary.otherDeductions.map((od, i) => (
			<div key={i} className="p-1">
				<div style={{ width: "100vh" }}>
					&emsp;
					<span>{od.deductionName} :</span>
					&emsp;
					<span>
						{formatNumber(od.deductionAmount)}&emsp;RWF (
						{numToWords(od.deductionAmount)})
					</span>
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
				<div className="row alert alert-primary text-center">
					{currentStaff &&
						currentStaff.currentMonthSalary &&
						currentStaff.currentMonthSalary.basicSalary > 0 && (
							<div className="col-md-12 mt-1">
								<h6 style={{ color: "red" }}>
									Period:{" "}
									{currentStaff.currentMonthSalary &&
									currentStaff.currentMonthSalary.salaryMonth
										? currentStaff.currentMonthSalary
												.salaryMonth
										: "No current salary pay found for this imployee!"}{" "}
									{currentStaff.currentMonthSalary &&
									currentStaff.currentMonthSalary.salaryYear
										? currentStaff.currentMonthSalary
												.salaryYear
										: ""}
								</h6>
								<hr />
							</div>
						)}
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
						<span
							style={{ cursor: "pointer" }}
							onClick={() => router.push("/exco/approveSalary")}
							className="btn btn-sm btn-info float-right ml-3"
						>
							Back
						</span>
					</div>
				</div>

				{currentStaff &&
					currentStaff.currentMonthSalary &&
					currentStaff.currentMonthSalary.basicSalary > 0 && (
						<div className="row">
							&emsp;
							<div
								className="col-md-12 alert text-center"
								style={{ backgroundColor: "white" }}
							>
								{currentStaff &&
									currentStaff.currentMonthSalary && (
										<span
											className="font-weight-bold"
											style={{ color: "black" }}
										>
											INCOME
										</span>
									)}
							</div>
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.basicSalary >
									0 && (
									<div className="col-md-12">
										Basic Salary:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.basicSalary
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.basicSalary
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.transportAllowance > 0 && (
									<div className="col-md-12">
										Transport Allowance:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.transportAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.transportAllowance
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.technAllowance >
									0 && (
									<div className="col-md-12">
										Techn. Allowance:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.technAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.technAllowance
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.responsibilityAllowance > 0 && (
									<div className="col-md-12">
										Responsibility Allowance:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.responsibilityAllowance
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.responsibilityAllowance
										)}
										)
									</div>
								)}
							{/* {currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.totalOtherAllowances > 0 && (
									<div className="col-md-12">
										Other Allowances:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.totalOtherAllowances
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.totalOtherAllowances
										)}
										)
									</div>
								)} */}
							{listOtherAllowances()}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.grossEarnings >
									0 && (
									<div className="col-md-12 text-right font-italic">
										Gross Earnings:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.grossEarnings
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
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
								{currentStaff && currentStaff.empNames && (
									<span
										className="font-weight-bold"
										style={{ color: "black" }}
									>
										COMPANY CONTRIBUTION
									</span>
								)}
							</div>
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.cieMaternityLeave > 0 && (
									<div className="col-md-12">
										Maternity Leave:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.cieMaternityLeave
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.cieMaternityLeave
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.cieCSR > 0 && (
									<div className="col-md-12">
										CSR Employer Contributions:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.cieCSR
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.cieCSR
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.cieCommunityHealth > 0 && (
									<div className="col-md-12">
										Community Healthy Based Scheme
										0.5%:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.cieCommunityHealth
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.cieCommunityHealth
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.cieTotalContribution > 0 && (
									<div className="col-md-12 text-right font-italic">
										Total Company Cotribution:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.cieTotalContribution
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
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
								{currentStaff && currentStaff.empNames && (
									<span
										className="font-weight-bold"
										style={{ color: "black" }}
									>
										DEDUCTIONS
									</span>
								)}
							</div>
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.staffMaternityLeave > 0 && (
									<div className="col-md-12">
										Mat. Leave Staff Deduction:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.staffMaternityLeave
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.staffMaternityLeave
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.payeTPR > 0 && (
									<div className="col-md-12">
										P.A.Y.E:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.payeTPR
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.payeTPR
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.staffCSR >
									0 && (
									<div className="col-md-12">
										CSR Staff Deduction:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.staffCSR
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.staffCSR
										)}
										)
									</div>
								)}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.totalOtherDeductions > 0 && (
									<div className="col-md-12">
										Other deductions (Staff Savings -
										Consolidated, etc.):&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.totalOtherDeductions
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.totalOtherDeductions
										)}
										)
									</div>
								)}
							{/* {currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary
									.totalStaffDeductions > 0 && (
									<div className="col-md-12 text-right font-italic">
										Total Deductions:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.totalStaffDeductions
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.totalStaffDeductions
										)}
										)
									</div>
								)}
							&emsp; */}
							{listOtherDeductions()}
							{currentStaff &&
								currentStaff.currentMonthSalary &&
								currentStaff.currentMonthSalary.netSalary >
									0 && (
									<div className="col-md-12 text-center alert font-weight-bold bg-warning">
										Net Pay:&emsp;
										{formatNumber(
											currentStaff.currentMonthSalary
												.netSalary
										)}
										&emsp;RWF (
										{numToWords(
											currentStaff.currentMonthSalary
												.netSalary
										)}
										)
										<br />
										{currentStaff &&
											currentStaff.currentMonthSalary &&
											currentStaff.currentMonthSalary
												.bankName && (
												<span>
													&emsp;Bank:&emsp;
													{
														currentStaff
															.currentMonthSalary
															.bankName
													}
												</span>
											)}
										{currentStaff &&
											currentStaff.currentMonthSalary &&
											currentStaff.currentMonthSalary
												.accountNumber && (
												<span>
													&emsp;Account:&emsp;
													{
														currentStaff
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
		</Layout>
	);
};
export default withExco(salaryApproval);
