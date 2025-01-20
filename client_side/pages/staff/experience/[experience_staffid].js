import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MinusCircleOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../../components/Layout";
import withStaff from "../withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { formatDate } from "../../../helpers/dateFormatter";

const Experience = ({ token }) => {
	const router = useRouter();
	const { experience_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [staffExperience, setStaffExperience] = useState([]);
	const [state, setState] = useState({
		workInstitution: "",
		workPosition: "",
		workSummary: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		workInstitution,
		workPosition,
		workSummary,
		error,
		success,
		buttonText,
	} = state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
	}, [router]);

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/staffProfile/${experience_staffid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.myProfile);
		setStaffExperience(response.data.myProfile.workExperience);
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

	const handleNewExperience = () => {
		setState({
			...state,
			workInstitution: "",
			workPosition: "",
			workSummary: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(null);
		setEndDate(null);
	};

	const removeExp = async (exp) => {
		setLoading(true);
		setStaffExperience(currentStaff.workExperience);
		const expIndex = staffExperience.findIndex(
			(experience) =>
				experience.workInstitution === exp.workInstitution &&
				experience.workPosition === exp.workPosition &&
				experience.startDate === exp.startDate
		);
		if (expIndex !== -1) staffExperience.splice(expIndex, 1);

		//======================================Save array of experience to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/experience/${currentStaff._id}`,
				{
					staffExperience,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewExperience();
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
		if (!startDate ) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Starting date of experience is required!",
			});
			return;
		}
		if (!workPosition || !workInstitution ) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Position and Institution are required!",
			});
			return;
		}
		if (endDate && (Date.parse(startDate) >= Date.parse(endDate))) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Start date must be earlier than end date!",
			});
			return;
		}
		//======================Adding new experience to the array
		setStaffExperience(currentStaff.workExperience);

		const expIndex = staffExperience.findIndex(
			(exp) =>
				exp.workInstitution === workInstitution &&
				exp.workPosition === workPosition &&
				exp.startDate === startDate
		);
		if (expIndex !== -1) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Looks like that experience has been recorded!",
			});
			return;
		} else {
			let newEperience = {};
			newEperience.workInstitution = workInstitution;
			newEperience.workPosition = workPosition;
			newEperience.workSummary = workSummary;
			newEperience.startDate = startDate;
			newEperience.endDate = endDate;
			staffExperience.push(newEperience);
		}

		//======================================Save array of experience to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/staffExperience/${currentStaff._id}`,
				{
					staffExperience,
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
			handleNewExperience();
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

	const experienceForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
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
				<div className="form-group col-md-3">
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
				<div className="form-group col-md-3">
					<label className="text-muted ">Institution: </label> <br />
					<input
						type="text"
						onChange={handleChange("workInstitution")}
						className="form-control"
						value={workInstitution}
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Position: </label> <br />
					<input
						type="text"
						onChange={handleChange("workPosition")}
						className="form-control"
						value={workPosition}
					/>
				</div>
			</div>

			<div className="form-group">
				{/* <label className="text-muted ">Brief Description:</label> */}
				<textarea
					rows="3"
					onChange={handleChange("workSummary")}
					className="form-control"
					value={workSummary}
					placeholder = "Brief Description"
				/>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push(`/staff/profile/${currentStaff.empCode}`)}
					>
						Back
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={handleNewExperience}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new experience."
					>
						New
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={() =>
							router.push(`/personnel/staffdoc/${currentStaff._id}`)
						}
						className="btn btn-outline-success btn-block"
					>
						Official Documents
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listExperience = () =>
		currentStaff.workExperience &&
		currentStaff.workExperience.map((wexp, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					From&emsp;
					<span className="text-muted">
						{wexp.startDate ? formatDate(wexp.startDate) : "--"}
					</span>
					&emsp;To&emsp;
					<span className="text-muted">
						{wexp.endDate ? formatDate(wexp.endDate) : "--"}
					</span>
					&emsp;&emsp;
					<span className="text-muted">
						{wexp.workInstitution
							? wexp.workInstitution
							: "Institution was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{wexp.workPosition
							? wexp.workPosition
							: "Position was not recorded"}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => removeExp(wexp)}
						title="Delete this work experience."
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
					<h4>Work Experience</h4>
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
					<div className="col-md-12">{experienceForm()}</div>
				</div>
				{/* {currentStaff &&
					currentStaff.workExperience &&
					currentStaff.workExperience.length > 0 && (
						<h6
							style={{
								fontSize: "16px",
								color: "purple",
								fontWeight: "bold",
							}}
						>
							PREVIOUS APPOINTMENTS
						</h6>
					)} */}
				{currentStaff &&
					currentStaff.workExperience &&
					currentStaff.workExperience.length > 0 &&
					listExperience()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(Experience);
