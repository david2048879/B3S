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
import { formatNumber } from "../../../helpers/numberFormatter";

const Appointment = ({ token }) => {
	const router = useRouter();
	const { staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [newApppointment, setNewAppointment] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [contractTypes, setContractTypes] = useState([]);
	const [executives, setExecutives] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [divisions, setDivisions] = useState([]);
	const [jobTitles, setJobTitles] = useState([]);
	const [locations, setLocations] = useState([]);
	const [branches, setBranches] = useState([]);
	const [state, setState] = useState({
		contractType: "",
		department: "",
		division: "",
		jobTitle: "",
		location: "",
		locationType: "",
		branch: "",
		executive: "",
		reportTo: "",
		entitledBasicSalary: 0,
		// entitledRentalCostAllowance: 0,
		entitledTechnAllowance: 0,
		entitledResponsibilityAllowance: 0,
		entitledTransportAllowance: 0,
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		contractType,
		department,
		division,
		jobTitle,
		location,
		locationType,
		branch,
		executive,
		reportTo,
		entitledBasicSalary,
		// entitledRentalCostAllowance,
		entitledTechnAllowance,
		entitledResponsibilityAllowance,
		entitledTransportAllowance,
		error,
		success,
		buttonText,
	} = state;
	const [appointmentDate, setAppointmentDate] = useState(null);
	const [contractEndDate, setContractEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		loadContractTypes();
		loadBranches();
		loadDivisions();
		loadDepartments();
		loadExecutives();
		loadJobTitles();
		loadLocations();
	}, [router]);

	const getStaff = async () => {
		const response = await axios.get(`${API}/profile/${staffid}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentStaff(response.data.myProfile);
		setState({ ...state, ...response.data.myProfile.currentAppointment });
		setAppointmentDate(
			response.data.myProfile.currentAppointment &&
				response.data.myProfile.currentAppointment.appointedDate &&
				new Date(
					response.data.myProfile.currentAppointment.appointedDate
				)
		);
		setContractEndDate(
			response.data.myProfile.currentAppointment &&
				response.data.myProfile.currentAppointment.contractEndDate &&
				new Date(
					response.data.myProfile.currentAppointment.contractEndDate
				)
		);
	};

	const loadContractTypes = async () => {
		const response = await axios.get(`${API}/contracttypes`);
		setContractTypes(response.data.contracttypes);
	};

	const loadDivisions = async () => {
		const response = await axios.get(`${API}/divisions`);
		setDivisions(response.data.divisions);
	};

	const loadDepartments = async () => {
		const response = await axios.get(`${API}/departments`);
		setDepartments(response.data.departments);
	};

	const loadJobTitles = async () => {
		const response = await axios.get(`${API}/jobtitles`);
		setJobTitles(response.data.jobtitles);
	};

	const loadLocations = async () => {
		const response = await axios.get(`${API}/locations`);
		setLocations(response.data.locations);
	};

	const loadBranches = async () => {
		const response = await axios.get(`${API}/branches`);
		setBranches(response.data.branches);
	};

	const loadExecutives = async () => {
		const response = await axios.get(`${API}/executives`);
		setExecutives(response.data.executives);
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

	const handleNewAppointment = () => {
		setState({
			...state,
			contractType: "",
			department: "",
			division: "",
			jobTitle: "",
			location: "",
			locationType: "",
			branch: "",
			executive: "",
			reportTo: "",
			entitledBasicSalary: 0,
			entitledTechnAllowance: 0,
			// entitledRentalCostAllowance: 0,
			entitledResponsibilityAllowance: 0,
			entitledTransportAllowance: 0,
			error: "",
			success: "",
			buttonText: "Save",
		});
		setAppointmentDate(null);
		setContractEndDate(null);
		setNewAppointment(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/addAppointment/${currentStaff._id}`,
				{
					appointedDate: appointmentDate
						? new Date(appointmentDate)
						: new Date(),
					contractType,
					department,
					division,
					jobTitle,
					location,
					locationType,
					branch,
					executive,
					reportTo,
					entitledBasicSalary,
					// entitledRentalCostAllowance,
					entitledTechnAllowance,
					entitledResponsibilityAllowance,
					entitledTransportAllowance,
					contractEndDate: contractEndDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewAppointment();
			setLoading(false);
			setNewAppointment(false);
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
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
			// console.log(new Date(appointmentDate));
			const response = await axios.put(
				`${API}/appointment/${currentStaff._id}`,
				{
					appointedDate: new Date(appointmentDate),
					contractType,
					department,
					division,
					jobTitle,
					location,
					locationType,
					branch,
					executive,
					reportTo,
					entitledBasicSalary,
					// entitledRentalCostAllowance,
					entitledTechnAllowance,
					entitledResponsibilityAllowance,
					entitledTransportAllowance,
					contractEndDate: contractEndDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			handleNewAppointment();
			setLoading(false);
			setNewAppointment(false);
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
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

	const appointmentForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Appointment Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={appointmentDate}
						onChange={(date) => {
							setAppointmentDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Contract End Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={contractEndDate}
						onChange={(date) => {
							setContractEndDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Contract Type: </label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("contractType")}
						value={contractType}
					>
						<option></option>
						{contractTypes.length > 0 &&
							contractTypes.map((cType, i) => (
								<option key={i} value={cType.ContractType}>
									{cType.ContractType}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Division: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("division")}
						value={division}
						title="Division"
					>
						<option></option>
						{divisions.length > 0 &&
							divisions.map((dvn, i) => (
								<option key={i} value={dvn.division}>
									{dvn.division}
								</option>
							))}
					</select>
					{/* <input
						type="text"
						onChange={handleChange("division")}
						className="form-control"
						value={division}
					/> */}
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Department: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("department")}
						value={department}
						title="Division"
					>
						<option></option>
						{departments.length > 0 &&
							departments.map((dptm, i) => (
								<option key={i} value={dptm.department}>
									{dptm.department}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Job Title: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("jobTitle")}
						value={jobTitle}
					>
						<option></option>
						{jobTitles.length > 0 &&
							jobTitles.map((jTitle, i) => (
								<option key={i} value={jTitle.JobTitle}>
									{jTitle.JobTitle}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Location: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("location")}
						value={location}
					>
						<option></option>
						{locations.length > 0 &&
							locations.map((location, i) => (
								<option key={i} value={location.Location}>
									{location.Location}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Location Type: </label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("locationType")}
						value={locationType}
					>
						<option></option>
						<option key="Up Country" value="Up Country">
							Up Country
						</option>
						<option key="Kigali" value="Kigali">
							Kigali
						</option>
					</select>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Basic Salary: </label> <br />
					<input
						type="number"
						onChange={handleChange("entitledBasicSalary")}
						className="form-control"
						value={entitledBasicSalary}
						title={formatNumber(entitledBasicSalary)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Transport Allowance: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("entitledTransportAllowance")}
						className="form-control"
						value={entitledTransportAllowance}
						title={formatNumber(entitledTransportAllowance)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Techn. Allowance: </label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange("entitledTechnAllowance")}
						className="form-control"
						value={entitledTechnAllowance}
						title={formatNumber(entitledTechnAllowance)}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">
						Responsibility Allowance:{" "}
					</label>{" "}
					<br />
					<input
						type="number"
						onChange={handleChange(
							"entitledResponsibilityAllowance"
						)}
						className="form-control"
						value={entitledResponsibilityAllowance}
						title={formatNumber(entitledResponsibilityAllowance)}
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">Branch: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("branch")}
						value={branch}
					>
						<option></option>
						{branches.length > 0 &&
							branches.map((brch, i) => (
								<option key={i} value={brch.branchName}>
									{brch.branchName}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Executive: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("executive")}
						value={executive}
					>
						<option></option>
						{executives.length > 0 &&
							executives.map((extv, i) => (
								<option key={i} value={extv.Executive}>
									{extv.Executive}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Report To: </label> <br />
					<input
						type="text"
						onChange={handleChange("reportTo")}
						className="form-control"
						value={reportTo}
					/>
				</div>
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
						onClick={handleNewAppointment}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new employee."
					>
						New
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={newApppointment ? handleSubmit : handleUpdate}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listAppointments = () =>
		currentStaff &&
		currentStaff.appointments &&
		currentStaff.appointments.map((sta, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					From&emsp;
					<span className="text-muted">
						{sta.appointedDate
							? formatDate(sta.appointedDate)
							: "Appointment date is not recorded"}
					</span>
					&emsp;To&emsp;
					<span className="text-muted">
						{sta.contractEndDate
							? formatDate(sta.contractEndDate)
							: "Contract end date is not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{sta.jobTitle
							? sta.jobTitle
							: "Position was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{sta.branch ? sta.branch : "Branch was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{sta.comment ? sta.comment : "No comment"}
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
					<h4>Appointments</h4>
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
					<div className="col-md-12">{appointmentForm()}</div>
				</div>
				{currentStaff &&
					currentStaff.appointments &&
					currentStaff.appointments.length > 0 && (
						<h6
							style={{
								fontSize: "16px",
								color: "purple",
								fontWeight: "bold",
							}}
						>
							PREVIOUS APPOINTMENTS
						</h6>
					)}
				{currentStaff &&
					currentStaff.appointments &&
					currentStaff.appointments.length > 0 &&
					listAppointments()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withHR(Appointment);
