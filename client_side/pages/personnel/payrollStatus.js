import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { formatDate } from "../../helpers/dateFormatter";

const payrollStatus = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [oneStaff, setOneStaff] = useState({});

	useEffect(() => {
		getPayrollStatus();
	}, [router]);

	const getPayrollStatus = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/payrollStatus/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setOneStaff(response.data.myPayrollStatus);
		setLoading(false);
	};

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Payroll Status</h4>
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
				<div className="row alert bg-light">
					{oneStaff &&
						oneStaff.currentMonthSalary &&
						oneStaff.currentMonthSalary.salaryStatus && (
							<div className="col-md-12 mt-1 text-center">
								<span className="font-weight-bold text-danger">
									{oneStaff.currentMonthSalary.salaryStatus
										? oneStaff.currentMonthSalary
												.salaryStatus
										: ""}
								</span>
							</div>
						)}
				</div>
				<div className="row alert alert-success ">
					{" "}
					<strong>VALIDATATION</strong>{" "}
				</div>
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.validatedBy && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>By:</strong>{" "}
								{oneStaff.currentMonthSalary.validatedBy
									? oneStaff.currentMonthSalary.validatedBy
									: ""}
							</span>
						</div>
					)}

				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.validatedDate && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Date:</strong>{" "}
								{oneStaff.currentMonthSalary.validatedDate
									? formatDate(
											oneStaff.currentMonthSalary
												.validatedDate
									  )
									: ""}
							</span>
						</div>
					)}
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.validatedComment && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Comment:</strong>{" "}
								{oneStaff.currentMonthSalary.validatedComment
									? oneStaff.currentMonthSalary
											.validatedComment
									: ""}
							</span>
						</div>
					)}

				<div className="col-md-12 alert alert-success mt-1">
					<span style={{ fontWeight: "bold", textAlign: "right" }}>
						APPROVAL
					</span>
				</div>
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvedBy && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>First Approval:</strong>{" "}
								{oneStaff.currentMonthSalary.approvedBy
									? oneStaff.currentMonthSalary.approvedBy
									: ""}
							</span>
						</div>
					)}

				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvalDate && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Date:</strong>{" "}
								{oneStaff.currentMonthSalary.approvalDate
									? formatDate(
											oneStaff.currentMonthSalary
												.approvalDate
									  )
									: ""}
							</span>
						</div>
					)}
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvalComment && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Comment:</strong>{" "}
								{oneStaff.currentMonthSalary.approvalComment
									? oneStaff.currentMonthSalary
											.approvalComment
									: ""}
							</span>
						</div>
					)}

				<div className="col-md-12 mt-1"></div>
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvedBy2 && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Second Approval:</strong>{" "}
								{oneStaff.currentMonthSalary.approvedBy2
									? oneStaff.currentMonthSalary.approvedBy2
									: ""}
							</span>
						</div>
					)}

				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvalDate2 && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Date:</strong>{" "}
								{oneStaff.currentMonthSalary.approvalDate2
									? formatDate(
											oneStaff.currentMonthSalary
												.approvalDate2
									  )
									: ""}
							</span>
						</div>
					)}
				{oneStaff &&
					oneStaff.currentMonthSalary &&
					oneStaff.currentMonthSalary.approvalComment2 && (
						<div className="col-md-12 mt-1">
							<span>
								<strong>Comment:</strong>{" "}
								{oneStaff.currentMonthSalary.approvalComment2
									? oneStaff.currentMonthSalary
											.approvalComment2
									: ""}
							</span>
						</div>
					)}

				<div className="col-md-12 mt-1">
					<hr />
					<span
						style={{ cursor: "pointer" }}
						onClick={() => router.push("/personnel/monthlySalary")}
						className="btn btn-sm btn-info float-right "
					>
						Back
					</span>
				</div>
			</div>
		</Layout>
	);
};
export default withHR(payrollStatus);
