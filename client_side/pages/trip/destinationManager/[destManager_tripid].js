import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { isAuth } from "../../../helpers/authToken";
import Layout from "../../../components/Layout";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { formatDate } from "../../../helpers/dateFormatter";

const destManagerTrip = ({ token }) => {
	const router = useRouter();
	const { destManager_tripid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [currentTrip, setCurrentTrip] = useState({});
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);
	const [state, setState] = useState({
		tripObjective: "",
		tripDestination: "",
		destinationManagerNames: "",
		destinationManagerEmpCode: "",
		destinationManagerEmail: "",
		destinationManagerPhone: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		tripObjective,
		tripDestination,
		destinationManagerNames,
		destinationManagerEmpCode,
		destinationManagerEmail,
		destinationManagerPhone,
		error,
		success,
		buttonText,
	} = state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		getTrip();
		getProfiles();
	}, [router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

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

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const getTrip = async () => {
		const response = await axios.get(
			`${API}/oneTripRequest/${destManager_tripid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentTrip(response.data.tripRequest);
		setState({
			...state,
			tripObjective: response.data.tripRequest.tripObjective,
			tripDestination: response.data.tripRequest.tripDestination,
			destinationManagerNames:
				response.data.tripRequest.destinationManagerNames,
			destinationManagerEmail:
				response.data.tripRequest.destinationManagerEmail,
			destinationManagerPhone:
				response.data.tripRequest.destinationManagerPhone,
			destinationManagerEmpCode:
				response.data.tripRequest.destinationManagerEmpCode,
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(new Date(response.data.tripRequest.startDate));
		setEndDate(new Date(response.data.tripRequest.endDate));
	};

	const getProfiles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/branchManagerEmployees`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
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
			`${API}/searchProfilesStaff`,
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
		setSearchText("");
	};

	const selectDestinationManager = async (destinationManagerID) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/selectDestinationManager/`,
				{ destinationManagerID },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setState({
				...state,
				destinationManagerNames:
					response.data.destinationManager.empNames,
				destinationManagerEmpCode:
					response.data.destinationManager.empCode,
				destinationManagerEmail: response.data.destinationManager.email,
				destinationManagerPhone: response.data.destinationManager.phone,
			});
			setLoading(false);
			window.scroll(0, 0);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error: "Unable to select the destination manager",
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		//=========================Save trip to the db ==================
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/destinationManager/${currentTrip._id}`,
				{
					destinationManagerEmpCode,
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

	const editDestinationManagerForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Start Date:</label>
					<br />
					<DatePicker
						dateFormat="dd-MM-yyyy"
						selected={startDate}
						disabled
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
						disabled
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
				<div className="form-group col-md-6">
					<label className="text-muted ">Trip Destination: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("tripDestination")}
						className="form-control"
						value={tripDestination}
						disabled
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-12">
					{/* <label className="text-muted ">Trip Objective: </label>{" "} */}
					<br />
					<textarea
						rows="3"
						onChange={handleChange("tripObjective")}
						className="form-control"
						value={tripObjective}
						placeholder="Trip Objective"
						disabled
					/>
				</div>
			</div>
			<label style={{ color: "purple", fontWeight: "bold" }}>
				Destination Manager{" "}
			</label>{" "}
			<br />
			<div className="row">
				<div className="form-group col-md-4">
					<input
						type="text"
						onChange={handleChange("destinationManagerNames")}
						className="form-control"
						value={destinationManagerNames}
						disabled
					/>
				</div>
				<div className="form-group col-md-4">
					<input
						type="text"
						onChange={handleChange("destinationManagerEmail")}
						className="form-control"
						value={destinationManagerEmail}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<input
						type="text"
						onChange={handleChange("destinationManagerPhone")}
						className="form-control"
						value={destinationManagerPhone}
						disabled
					/>
				</div>
				<div className="form-group col-md-2">
					<input
						type="text"
						onChange={handleChange("destinationManagerEmpCode")}
						className="form-control"
						value={destinationManagerEmpCode}
						disabled
					/>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-6 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() =>
							router.push(`/trip/${currentStaff.empCode}`)
						}
					>
						Back
					</button>
				</div>

				<div className="col-md-6 mt-1">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
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
					<span
						onClick={() => selectDestinationManager(pfl.empCode)}
						className="btn btn-sm float-right"
						title="Select this employee as your line manager"
					>
						<CheckOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Select Trip Destination Manager</h4>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">
						{editDestinationManagerForm()}
					</div>
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
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(destManagerTrip);
