import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	EditOutlined,
	ReadOutlined,
	CreditCardOutlined,
	MinusCircleOutlined,
	SolutionOutlined,
	DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";

const Payroll = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [modal, setModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [countries, setCountries] = useState([]);
	const [maritalStatuses, setMaritalStatuses] = useState([]);
	const [currentProfile, setCurrentProfile] = useState({});
	const [state, setState] = useState({
		empNames: "",
		empCode: null,
		officerCode: null,
		rssbNumber: null,
		email: "",
		phone: "",
		idNumber: "",
		idType: "",
		gender: "",
		nationality: "",
		maritalStatus: "",
		comment: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		empNames,
		empCode,
		officerCode,
		rssbNumber,
		email,
		phone,
		idNumber,
		idType,
		gender,
		nationality,
		maritalStatus,
		comment,
		error,
		success,
		buttonText,
	} = state;

	const [dobDate, setDoBDate] = useState(null);
	const [contractEndDate, setContractEndDate] = useState(null);

	useEffect(() => {
		getProfiles();
		loadCountries();
		loadMaritalStatus();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const loadCountries = async () => {
		const response = await axios.get(`${API}/countries`);
		setCountries(response.data.countries);
	};

	const loadMaritalStatus = async () => {
		const response = await axios.get(`${API}/maritalStatuses`);
		setMaritalStatuses(response.data.maritalStatuses);
	};

	const handleNewProfile = () => {
		setCurrentProfile({});
		setState({
			...state,
			empNames: "",
			empCode: -1,
			officerCode: -1,
			rssbNumber: -1,
			email: "",
			phone: "",
			idNumber: "",
			idType: "",
			gender: "",
			nationality: "",
			maritalStatus: "",
			comment: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setDoBDate(null);
		setContractEndDate(null);
		setSearchText("");
	};

	const getProfile = async (profileID) => {
		handleNewProfile();
		const response = await axios.get(`${API}/profile/${profileID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentProfile(response.data.myProfile);
		setState({
			...state,
			...response.data.myProfile,
			idNumber:
				response.data.myProfile.idDetails &&
				response.data.myProfile.idDetails.idNumber,
			idType:
				response.data.myProfile.idDetails &&
				response.data.myProfile.idDetails.idType,
			email: response.data.myProfile && response.data.myProfile.email,
			gender: response.data.myProfile && response.data.myProfile.gender,
			nationality:
				response.data.myProfile && response.data.myProfile.nationality,
			maritalStatus:
				response.data.myProfile &&
				response.data.myProfile.maritalStatus,
		});
		setDoBDate(
			response.data.myProfile.dob &&
				Date.parse(response.data.myProfile.dob)
		);
		window.scrollTo(0, 0);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getProfiles = async () => {
		handleNewProfile();
		setLoading(true);
		const response = await axios.get(`${API}/profiles`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setIsActive(true);
		setLoading(false);
	};

	const getProfilesEndedContract = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profilesEndedContract`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setIsActive(false);
		setLoading(false);
	};

	const getProfilesEndedingContract = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profilesEndedingContract`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setIsActive(true);
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

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchProfiles`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setProfiles(response.data.myProfiles);
		setLoading(false);
		setIsActive(true);
		handleNewProfile();
		setSearchText("");
	};

	const toggle = (profile) => {
		setModal(!modal);
		setCurrentProfile(profile);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>Ending Contract</ModalHeader>
					<ModalBody>
						<div>
							Employee:{" "}
							<strong>
								"{currentProfile && currentProfile.empNames}"
							</strong>
							.{" "}
							<span className="text-danger">
								This will remove the employee from the payroll
								until he/she is given a new contract!
							</span>
							<hr />
							<div className="form-group ">
								<label className="text-muted ">
									End Contract Date:
								</label>
								<br />
								<DatePicker
									dateFormat="dd-MM-yyyy"
									selected={contractEndDate}
									onChange={(date) => {
										setContractEndDate(date);
									}}
								/>
							</div>
							<div className="form-group">
								{/* <label className='text-muted'>Reason:</label> */}
								<textarea
									rows="3"
									onChange={handleChange("comment")}
									className="form-control"
									name="comment"
									value={comment}
									placeholder="Enter the reason why the contract is discontinued"
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="warning" onClick={handleDelete}>
							Continue
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const handleDelete = async () => {
		try {
			window.scrollTo(0, 0);
			setLoading(true);
			setModal(!modal);
			const response = await axios.put(
				`${API}/stopAppointment/${currentProfile._id}`,
				{ contractEndDate, comment },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getProfiles();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: error.response.data.error,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/profile`,
				{
					empNames,
					empCode,
					officerCode,
					rssbNumber,
					email,
					phone,
					idNumber,
					idType,
					gender,
					nationality,
					maritalStatus,
					dob: dobDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getProfiles();
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: response && response.data.message,
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

	const handleUpdate = async () => {
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/profile/${currentProfile._id}`,
				{
					empNames,
					empCode,
					officerCode,
					rssbNumber,
					email,
					phone,
					idNumber,
					idType,
					gender,
					nationality,
					maritalStatus,
					dob: dobDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getProfiles();
			setLoading(false);
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

	const addProfileForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-8">
					<input
						type="text"
						onChange={handleChange("empNames")}
						className="form-control"
						value={empNames}
						required
						title="Enter names here"
						placeholder="Names"
					/>
				</div>
				<div className="form-group col-md-4">
					<input
						type="email"
						onChange={handleChange("email")}
						className="form-control"
						value={email}
						title="Enter Email here"
						placeholder="Email"
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Employe ID: </label> <br />
					<input
						type="number"
						onChange={handleChange("empCode")}
						className="form-control"
						value={empCode}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Officer Code: </label> <br />
					<input
						type="number"
						onChange={handleChange("officerCode")}
						className="form-control"
						value={officerCode}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">RSSB Number: </label> <br />
					<input
						type="number"
						onChange={handleChange("rssbNumber")}
						className="form-control"
						value={rssbNumber}
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Phone Number: </label> <br />
					<input
						type="text"
						onChange={handleChange("phone")}
						className="form-control"
						value={phone}
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-4">
					<label className="text-muted ">NID/Passport Number: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("idNumber")}
						className="form-control"
						value={idNumber}
					/>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Document Type: </label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("idType")}
						value={idType}
						// name='idType'
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
				<div className="form-group col-md-4">
					<label className="text-muted ">Gender: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("gender")}
						value={gender}
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
			</div>
			<div className="row">
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
				<div className="form-group col-md-4">
					<label className="text-muted ">Nationality: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("nationality")}
						value={nationality}
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
			<hr />
			<div className="row">
				<div className="col-md-1 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard")}
					>
						Back
					</button>
				</div>
				<div className="col-md-1 mt-1">
					<button
						onClick={handleNewProfile}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new employee."
					>
						New
					</button>
				</div>

				<div className="col-md-1 mt-1">
					<button
						onClick={
							currentProfile && currentProfile._id
								? handleUpdate
								: handleSubmit
						}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={getProfilesEndedingContract}
						className="btn btn-outline-danger btn-block"
						title="List staff with contract that are ending in less than 30 days."
					>
						Ending Contracts
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						onClick={getProfilesEndedContract}
						className="btn btn-outline-secondary btn-block"
						title="List staff with ended contracts."
					>
						Ended contracts
					</button>
				</div>

				<div className="col-md-3 mt-1">
					<button
						className="btn btn-outline-primary btn-block"
						title="Calculate salary for each employee based on parameters set."
						onClick={() => router.push(`/personnel/monthlySalary`)}
					>
						Monthly Payroll
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listProfiles = () =>
		profiles.map((pfl, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{pfl.empNames.length <= 67
							? pfl.empNames
							: pfl.empNames.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{pfl.currentAppointment.jobTitle
							? pfl.currentAppointment.jobTitle + " - "
							: ""}
						{pfl.currentAppointment.contractType === undefined ||
						pfl.currentAppointment.contractType === "Permanent"
							? ""
							: pfl.currentAppointment.contractType + " - "}
						{pfl.currentAppointment.branch
							? pfl.currentAppointment.branch
							: ""}
					</span>
					<span className="text-danger" style={{ fontSize: "13px" }}>
						&emsp;
						{pfl.currentAppointment.contractEndDate
							? formatDate(pfl.currentAppointment.contractEndDate)
							: ""}
					</span>
					{isActive && (
						<span
							className="btn btn-sm float-right"
							onClick={() => toggle(pfl)}
							title="Halt the current contract of this employee."
						>
							<MinusCircleOutlined className="text-danger" />
						</span>
					)}
					{isActive && (
						<span
							className="btn btn-sm float-right"
							onClick={() => getProfile(pfl._id)}
							title="Edit Employee data"
						>
							<EditOutlined className="text-info" />
						</span>
					)}
					<span
						onClick={() =>
							router.push(`/personnel/appointment/${pfl._id}`)
						}
						className="btn btn-sm float-right"
						title="Appointments and Contracts"
					>
						<DeploymentUnitOutlined className="text-success" />
					</span>
					{/* {isActive && ( */}
					<span
						onClick={() =>
							router.push(`/personnel/experience/${pfl._id}`)
						}
						className="btn btn-sm float-right"
						title="Professional experience"
					>
						<SolutionOutlined className="text-success" />
					</span>
					{/* // )} */}
					{/* {isActive && ( */}
					<span
						onClick={() =>
							router.push(`/personnel/education/${pfl._id}`)
						}
						className="btn btn-sm float-right"
						title="Education background"
					>
						<ReadOutlined className="text-success" />
					</span>
					{/* // )} */}
					{/* {isActive && (
						<span
							onClick={() =>
								router.push(`/personnel/loanaccount/${pfl._id}`)
							}
							className="btn btn-sm float-right"
							title="Loan Account"
						>
							<CreditCardOutlined className="text-success" />
						</span>
					)} */}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Employees</h4>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addProfileForm()}</div>
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

				<div className="row ">
					<form
						className="form-inline col bg-info mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder='Type here part of name or full employee code or employee email, then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of name or full employee code or employee email, then press "Enter" to search.'
						/>
					</form>
				</div>

				{listProfiles()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(currentProfile)} */}
		</Layout>
	);
};
export default withHR(Payroll);
