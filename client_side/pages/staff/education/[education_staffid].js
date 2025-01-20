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

const Education = ({ token }) => {
	const router = useRouter();
	const { education_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [staffEducation, setStaffEducation] = useState([]);
	const [state, setState] = useState({
		certificateInstitution: "",
		certificateName: "",
		studyLevel: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		certificateInstitution,
		certificateName,
		studyLevel,
		error,
		success,
		buttonText,
	} = state;
	const [certificateDate, setCertificateDate] = useState(null);

	useEffect(() => {
		getStaff();
	}, [router]);

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/staffProfile/${education_staffid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.myProfile);
		setStaffEducation(response.data.myProfile.educationBackground);
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

	const handleNewEducation = () => {
		setState({
			...state,
			certificateInstitution: "",
			certificateName: "",
			studyLevel: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setCertificateDate(null);
	};

	const removeEduc = async (educ) => {
		setLoading(true);
		setStaffEducation(currentStaff.educationBackground);
		const educIndex = staffEducation.findIndex(
			(education) =>
				education.certificateInstitution ===
					educ.certificateInstitution &&
				education.certificateName === educ.certificateName &&
				education.studyLevel === educ.studyLevel
		);
		if (educIndex !== -1) staffEducation.splice(educIndex, 1);

		//======================================Save array of education to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/education/${currentStaff._id}`,
				{
					staffEducation,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewEducation();
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

		//======================Adding new education to the array
		setStaffEducation(currentStaff.educationBackground);
		if (!certificateDate || certificateDate === null) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Certificate date is required!",
			});
			return;
		}

		const educIndex = staffEducation.findIndex(
			(education) =>
				education.certificateInstitution === certificateInstitution &&
				education.certificateName === certificateName &&
				education.studyLevel === studyLevel
		);
		if (educIndex !== -1) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Looks like that education level has been recorded!",
			});
			return;
		} else {
			let newEducation = {};
			newEducation.certificateInstitution = certificateInstitution;
			newEducation.certificateName = certificateName;
			newEducation.studyLevel = studyLevel;
			newEducation.certificateDate = certificateDate;
			staffEducation.push(newEducation);
		}

		//======================================Save array of education to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/staffEducation/${currentStaff._id}`,
				{
					staffEducation,
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
			handleNewEducation();
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

	const educationForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Institution: </label> <br />
					<input
						type="text"
						onChange={handleChange("certificateInstitution")}
						className="form-control"
						value={certificateInstitution}
					/>
				</div>

				<div className="form-group col-md-6">
					<label className="text-muted ">Certificate Name: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("certificateName")}
						className="form-control"
						value={certificateName}
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Certificate Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={certificateDate}
						onChange={(date) => {
							setCertificateDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
				<div className="form-group col-md-6">
					<label className="text-muted ">Study level:</label>
					<select
						className="form-control"
						onChange={handleChange("studyLevel")}
						value={studyLevel}
					>
						<option className="text-info font-italic"></option>
						<option key="PHD" value="PHD">
							PHD
						</option>
						<option key="Masters" value="Masters">
							Masters
						</option>
						<option key="Bachelor" value="Bachelor">
							Bachelor
						</option>
						<option key="Diploma" value="Diploma">
							Diploma
						</option>
						<option key="Secondary School" value="Secondary School">
							Secondary School
						</option>
						<option key="Primary School" value="Primary School">
							Primary School
						</option>
					</select>
				</div>
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
						onClick={handleNewEducation}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new education level."
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

	const listEducation = () =>
		staffEducation &&
		staffEducation.sort((a, b) => {
			let da = new Date(a.certificateDate),
				db = new Date(b.certificateDate);
			return db - da;
		}) &&
		staffEducation.map((educ, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span className="text-muted">
						{educ.certificateDate
							? formatDate(educ.certificateDate)
							: "Certificate date was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{educ.certificateName
							? educ.certificateName
							: "Certificate was not recorded"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{educ.certificateInstitution
							? educ.certificateInstitution
							: "Institution was not recorded"}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => removeEduc(educ)}
						title="Delete this education level."
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
					<h4>Education Background</h4>
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
					<div className="col-md-12">{educationForm()}</div>
				</div>
				{currentStaff &&
					currentStaff.educationBackground &&
					currentStaff.educationBackground.length > 0 &&
					listEducation()}
			</div>
			{/* {JSON.stringify(education_staffid)} */}
		</Layout>
	);
};
export default withStaff(Education);
