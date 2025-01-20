import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import withCEO from "./withCEO";
import { API } from "../../config";
import { showErrorMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";
import { formatNumber } from "../../helpers/numberFormatter";

const staffDetails = ({ token }) => {
	const router = useRouter();
	const { staff_id_details } = router.query;
	const [loading, setLoading] = useState(false);
	const [staffDetails, setStaffDetails] = useState({});

	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { error, success } = state;

	useEffect(() => {
		getStaffDetails();
	}, []);

	const getStaffDetails = async () => {
		setLoading(true);
		const response = await axios.get(
			`${API}/ceo_profileEmpCode/${staff_id_details}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setStaffDetails(response.data.myProfile);
		setLoading(false);
	};

	const viewCurrentAppointment = () => (
		<div className="row alert alert-secondary">
			<div className="col-md-12">
				&emsp;
				<span title="Job Title" style={{ fontSize: "16px" }}>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.jobTitle}
				</span>
				&emsp;&emsp;
				<span
					title="Appointment Date"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.appointedDate &&
						formatDate(
							staffDetails.currentAppointment.appointedDate
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Branch"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.branch &&
						staffDetails.currentAppointment.branch}
				</span>
				&emsp;&emsp;
				<span
					title="Contract Type"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.contractType &&
						staffDetails.currentAppointment.contractType}
				</span>
				&emsp;&emsp;
				<span
					title="Division"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.division &&
						staffDetails.currentAppointment.division}
				</span>
				&emsp;&emsp;
				<span
					title="Department"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.department &&
						staffDetails.currentAppointment.department}
				</span>
				&emsp;&emsp;
				<span
					title="Contract End Date"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.contractEndDate &&
						formatDate(
							staffDetails.currentAppointment.contractEndDate
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Basic Salary"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.entitledBasicSalary &&
						formatNumber(
							staffDetails.currentAppointment.entitledBasicSalary
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Responsibility Allowance"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						// staffDetails.currentAppointment
						// 	.entitledResponsibilityAllowance &&
						staffDetails.currentAppointment
							.entitledResponsibilityAllowance > 0 &&
						formatNumber(
							staffDetails.currentAppointment
								.entitledResponsibilityAllowance
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Transport Allowance"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						// staffDetails.currentAppointment
						// // 	.entitledTransportAllowance &&
						staffDetails.currentAppointment
							.entitledTransportAllowance > 0 &&
						formatNumber(
							staffDetails.currentAppointment
								.entitledTransportAllowance
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Transport Allowance"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentAppointment &&
						// staffDetails.currentAppointment
						// // 	.entitledTransportAllowance &&
						staffDetails.currentAppointment
							.entitledRentalCostAllowance > 0 &&
						formatNumber(
							staffDetails.currentAppointment
								.entitledRentalCostAllowance
						)}
				</span>
			</div>
		</div>
	);

	const viewStaffSalary = () => (
		<div className="row alert alert-secondary">
			<div className="col-md-12">
				&emsp;
				<span title="Job Title" style={{ fontSize: "16px" }}>
					{staffDetails &&
						staffDetails.currentAppointment &&
						staffDetails.currentAppointment.jobTitle}
				</span>
				&emsp;&emsp;
				<span
					title="Gross"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentMonthSalary &&
						staffDetails.currentMonthSalary.grossEarnings &&
						formatNumber(
							staffDetails.currentMonthSalary.grossEarnings
						)}
				</span>
				&emsp;&emsp;
				<span
					title="P.A.Y.E - Pay as you earn"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentMonthSalary &&
						staffDetails.currentMonthSalary.payeTPR &&
						formatNumber(staffDetails.currentMonthSalary.payeTPR)}
				</span>
				&emsp;&emsp;
				<span
					title="CSR - Caisse sociale du Rwanda"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentMonthSalary &&
						staffDetails.currentMonthSalary.staffCSR &&
						formatNumber(staffDetails.currentMonthSalary.staffCSR)}
				</span>
				&emsp;&emsp;
				<span
					title="Maternity leave contribution"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentMonthSalary &&
						staffDetails.currentMonthSalary.staffMaternityLeave &&
						formatNumber(
							staffDetails.currentMonthSalary.staffMaternityLeave
						)}
				</span>
				&emsp;&emsp;
				<span
					title="Net Salary"
					style={{ fontSize: "12px" }}
					className="text-muted"
				>
					{staffDetails &&
						staffDetails.currentMonthSalary &&
						staffDetails.currentMonthSalary.netSalary &&
						formatNumber(staffDetails.currentMonthSalary.netSalary)}
				</span>
			</div>
		</div>
	);

	const viewPreviousAppointments = () =>
		staffDetails.appointments &&
		staffDetails.appointments.length > 0 &&
		staffDetails.appointments.map((appmt, i) => (
			<div key={i} className="row alert alert-secondary">
				<div className="col-md-12">
					&emsp;
					<span title="Appointment Date" style={{ fontSize: "16px" }}>
						{appmt.jobTitle}
					</span>
					&emsp;&emsp;
					<span style={{ fontSize: "12px" }}>
						{formatDate(appmt.appointedDate)}
					</span>
					&emsp;&emsp;
					<span
						title="Contract Type"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{appmt.contractType}
					</span>
					&emsp;&emsp;
					<span
						title="Branch"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{appmt.branch}
					</span>
					&emsp;&emsp;
					<span
						title="Division"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{appmt.division}
					</span>
					&emsp;&emsp;
					<span
						title="Department"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{appmt.department}
					</span>
					&emsp;&emsp;
					<span
						title="Date end contract"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{appmt.contractEndDate &&
							formatDate(appmt.contractEndDate)}
					</span>
				</div>
			</div>
		));

	const viewStaffEducation = () =>
		staffDetails.educationBackground &&
		staffDetails.educationBackground.length > 0 &&
		staffDetails.educationBackground.map((educ, i) => (
			<div key={i} className="row alert alert-secondary">
				<div className="col-md-12">
					&emsp;
					<span title="Study Level" style={{ fontSize: "16px" }}>
						{educ.studyLevel}
					</span>
					&emsp;&emsp;
					<span
						title="Certificate or field of studies"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{educ.certificateName}
					</span>
					&emsp;&emsp;
					<span
						title="Learning Institution"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{educ.certificateInstitution}
					</span>
					&emsp;&emsp;
					<span
						title="Completion Date"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{educ.certificateDate &&
							formatDate(educ.certificateDate)}
					</span>
				</div>
			</div>
		));

	const viewStaffExperience = () =>
		staffDetails.workExperience &&
		staffDetails.workExperience.length > 0 &&
		staffDetails.workExperience.map((exp, i) => (
			<div key={i} className="row alert alert-secondary">
				<div className="col-md-12">
					&emsp;
					<span title="Institution" style={{ fontSize: "16px" }}>
						{exp.workInstitution}
					</span>
					&emsp;&emsp;
					<span
						title="Job Position"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{exp.workPosition}
					</span>
					&emsp;&emsp;
					<span
						title="Start Date"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{exp.startDate && formatDate(exp.startDate)}
					</span>
					&emsp;&emsp;
					<span
						title="End Date"
						className="text-muted"
						style={{ fontSize: "12px" }}
					>
						{exp.endDate && formatDate(exp.endDate)}
					</span>
				</div>
			</div>
		));

	const viewStaffDocuments = () =>
		staffDetails.cvDocuments &&
		staffDetails.cvDocuments.length > 0 &&
		staffDetails.cvDocuments.map((doc, i) => (
			<div key={i} className="row alert alert-secondary">
				<div className="col-md-12">
					&emsp;
					<span style={{ fontSize: "16px" }}>
						{doc.content && (
							<a href={doc.content.url} target="_blank">
								{doc.title}
							</a>
						)}
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Employee Details</h4>
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
				<div className="row alert alert-primary text-center">
					<div className="col-md-12">
						<h5>{staffDetails && staffDetails.empNames}</h5>
					</div>
					<div className="col-md-12">
						<span
							style={{
								fontWeight: 100,
								color: "black",
								fontSize: "16px",
							}}
						>
							{staffDetails && staffDetails.empCode}&emsp;&emsp;
							{staffDetails && staffDetails.email}&emsp;&emsp;
							{staffDetails && staffDetails.phone}
						</span>
					</div>
					<div className="col-md-12 mt-1">
						<span
							style={{
								fontWeight: "bold",
								color: "green",
								fontSize: "16px",
							}}
						>
							{staffDetails &&
								staffDetails.currentAppointment &&
								staffDetails.currentAppointment.jobTitle}
							&emsp;&emsp;
							{staffDetails &&
								staffDetails.currentAppointment &&
								staffDetails.currentAppointment.branch}
						</span>
					</div>
					<div className="col-md-12 mt-1">
						<hr />
						<span
							style={{ cursor: "pointer" }}
							onClick={() => router.push("/ceo")}
							className="btn btn-sm btn-info float-right ml-3"
						>
							Back
						</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						{staffDetails && staffDetails.currentAppointment && (
							<span className="font-weight-bold">
								CURRENT APPOINTMENT
							</span>
						)}
						<br />
						{viewCurrentAppointment()}
					</div>
					<div className="col-md-12">
						{staffDetails.appointments &&
							staffDetails.appointments.length > 0 && (
								<span className="font-weight-bold">
									PREVIOUS APPOINTMENTS
								</span>
							)}
						{viewPreviousAppointments()}
					</div>
					<div className="col-md-12">
						{staffDetails &&
							staffDetails.currentMonthSalary &&
							staffDetails.currentMonthSalary.grossEarnings >
								0 && (
								<span className="font-weight-bold">SALARY</span>
							)}
						<br />
						{staffDetails.currentMonthSalary &&
							staffDetails.currentMonthSalary.grossEarnings > 0 &&
							viewStaffSalary()}
					</div>
					<div className="col-md-12">
						{staffDetails &&
							staffDetails.educationBackground &&
							staffDetails.educationBackground.length > 0 && (
								<span className="font-weight-bold">
									EDUCATION BACKGROUND
								</span>
							)}
						<br />
						{viewStaffEducation()}
					</div>
					<div className="col-md-12">
						{staffDetails &&
							staffDetails.workExperience &&
							staffDetails.workExperience.length > 0 && (
								<span className="font-weight-bold">
									EXPERIENCE
								</span>
							)}
						<br />
						{viewStaffExperience()}
					</div>
					<div className="col-md-12">
						{staffDetails &&
							staffDetails.cvDocuments &&
							staffDetails.cvDocuments.length > 0 && (
								<span className="font-weight-bold">
									OFFICIAL DOCUMENTS
								</span>
							)}
						<br />
						{viewStaffDocuments()}
					</div>
				</div>
			</div>
			{/* {JSON.stringify(staffDetails)} */}
		</Layout>
	);
};
export default withCEO(staffDetails);
