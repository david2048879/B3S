import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../../components/Layout";
import { isAuth } from "../../../helpers/authToken";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const staffProfile = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [staffProfile, setStaffProfile] = useState({});
	const [countries, setCountries] = useState([]);
	const [maritalStatuses, setMaritalStatuses] = useState([]);
	const [state, setState] = useState({
		empCode: "",
		empNames: "",
		email: "",
		phone: "",
		rssbNumber: "",
		idType: "",
		idNumber: "",
		nationality: "",
		gender: "",
		maritalStatus: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		empCode,
		empNames,
		email,
		phone,
		rssbNumber,
		idType,
		idNumber,
		nationality,
		gender,
		maritalStatus,
		error,
		success,
		buttonText,
	} = state;

	const [dobDate, setDoBDate] = useState(null);


	useEffect(() => {
		getProfile();
		loadCountries();
		loadMaritalStatus();
	}, []);

	const loadCountries = async () => {
		const response = await axios.get(`${API}/countries`);
		setCountries(response.data.countries);
	};

	const loadMaritalStatus = async () => {
		const response = await axios.get(`${API}/maritalStatuses`);
		setMaritalStatuses(response.data.maritalStatuses);
	};

	const getProfile = async () => {
		setLoading(true);
		if (isAuth() && isAuth().email) {
			const response = await axios.get(
				`${API}/staff_email/${isAuth().email}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStaffProfile(response.data.staffProfile);
			setState({
				...state,
				...response.data.staffProfile,
				idNumber:
					response.data.staffProfile.idDetails &&
					response.data.staffProfile.idDetails.idNumber,
				idType:
					response.data.staffProfile.idDetails &&
					response.data.staffProfile.idDetails.idType,
			});
			setDoBDate(
				response.data.staffProfile.dob &&
					Date.parse(response.data.staffProfile.dob)
			);
		}
		window.scrollTo(0, 0);
		setLoading(false);
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

	const handleUpdate = async (e) => {
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/staffProfile/${staffProfile._id}`,
				{
					empCode,
					empNames,
					email,
					phone,
					rssbNumber,
					idType,
					idNumber,
					nationality,
					gender,
					maritalStatus,
					dob: dobDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// getProfile();
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
		} catch (error) {
			// console.log(error);
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

	const staffProfileForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Code: </label> <br />
					<input
						type="text"
						onChange={handleChange("empCode")}
						className="form-control"
						value={empCode}
						disabled
						name="empCode"
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Names: </label> <br />
					<input
						type="text"
						onChange={handleChange("empNames")}
						className="form-control"
						value={empNames}
						disabled
						name="empNames"
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Email: </label> <br />
					<input
						type="text"
						onChange={handleChange("email")}
						className="form-control"
						value={email}
						disabled
						name="email"
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">RSSB Number: </label> <br />
					<input
						type="text"
						onChange={handleChange("rssbNumber")}
						className="form-control"
						value={rssbNumber}
						disabled
						name="rssbNumber"
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Phone Number: </label> <br />
					<input
						type="text"
						onChange={handleChange("phone")}
						className="form-control"
						value={phone}
						name="phone"
					/>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Document Type: </label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("idType")}
						value={idType}
						name="idType"
						title="Type of identification document"
					>
						<option></option>
						<option key="NID Card" value="NID Card">
							NID Card
						</option>
						<option key="Passport" value="Passport">
							Passport
						</option>
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">ID Number: </label> <br />
					<input
						type="text"
						onChange={handleChange("idNumber")}
						className="form-control"
						value={idNumber}
						name="idNumber"
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Nationality: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("nationality")}
						value={nationality}
						name="nationality"
						title="Nationality"
					>
						<option></option>
						{countries.length > 0 &&
							countries.map((country, i) => (
								<option key={i} value={country.countryName}>
									{country.countryName}
								</option>
							))}
					</select>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">Gender: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("gender")}
						value={gender}
						name="gender"
						title="Gender of the employee"
					>
						<option></option>
						<option key="Female" value="Female">
							Female
						</option>
						<option key="Male" value="Male">
							Male
						</option>
					</select>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Date of birth:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={dobDate}
						onChange={(date) => {
							setDoBDate(date);
							setState({
								...state,
								buttonText: "Save",
								error: "",
							});
						}}
					/>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Marital Status: </label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("maritalStatus")}
						value={maritalStatus}
						name="maritalStatus"
						title="Marital Status"
					>
						<option></option>
						{maritalStatuses.length > 0 &&
							maritalStatuses.map((ms, i) => (
								<option key={i} value={ms.MaritalStatus}>
									{ms.MaritalStatus}
								</option>
							))}
					</select>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={handleUpdate}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={() =>
							router.push(`/staff/education/${staffProfile._id}`)
						}
						className="btn btn-outline-success btn-block"
					>
						Education
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={() =>
							router.push(`/staff/experience/${staffProfile._id}`)
						}
						className="btn btn-outline-success btn-block"
					>
						Experience
					</button>
				</div>
				{/* <div className="col-md-3 mt-1">
					<button
						// onClick={handleUpdate}
						className="btn btn-outline-primary btn-block"
					>
						Change Photo
					</button>
				</div> */}
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>My Profile</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert alert-secondary">
					<div className="col-md-12">{staffProfileForm()}</div>
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
			{/* {JSON.stringify(isAuth())} */}
		</Layout>
	);
};
export default staffProfile;
