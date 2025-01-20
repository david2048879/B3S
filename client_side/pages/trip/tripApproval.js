import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CheckCircleOutlined, FileOutlined } from "@ant-design/icons";
import { isAuth } from "../../helpers/authToken";
import Layout from "../../components/Layout";
import withStaff from "../staff/withStaff";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";

const tripApproval = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [currentTrip, setCurrentTrip] = useState({});
	const [currentStaff, setCurrentStaff] = useState({});
	const [managerTrips, setManagerTrips] = useState([]);
	const [state, setState] = useState({
		tripObjective: "",
		tripDestination: "",
		destinationManagerNames: "",
		destinationManagerEmpCode: "",
		destinationManagerEmail: "",
		destinationManagerPhone: "",
		lineManagerTripComment: "",
		requestStatus: "",
		error: "",
		success: "",
	});
	const {
		tripObjective,
		tripDestination,
		destinationManagerNames,
		destinationManagerEmpCode,
		destinationManagerEmail,
		destinationManagerPhone,
		lineManagerTripComment,
		error,
		success,
	} = state;

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
		getLineManagerTrips();
	}, [router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const getLineManagerTrips = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/allTripRequestsPerManager/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setManagerTrips(response.data.tripRequests);
		setLoading(false);
	};

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

	const getTrip = async (tripid) => {
		clearFields();
		const response = await axios.get(`${API}/oneTripRequest/${tripid}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
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
			lineManagerTripComment:
				response.data.tripRequest.lineManagerTripComment,
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(new Date(response.data.tripRequest.startDate));
		setEndDate(new Date(response.data.tripRequest.endDate));
	};

	const clearFields = () => {
		setState({
			...state,
			tripObjective: "",
			tripDestination: "",
			destinationManagerNames: "",
			destinationManagerEmpCode: "",
			destinationManagerEmail: "",
			destinationManagerPhone: "",
			lineManagerTripComment: "",
			requestStatus: "",
			// error: "",
			// success: "",
		});
	};

	const handleApprove = async (e) => {
		e.preventDefault();

		if (!currentTrip && !currentTrip._id) {
			setState({
				...state,
				error: "Please select a trip request first!",
			});
			return;
		}
		if (currentTrip && currentTrip.requestStatus !== "PENDING") {
			setState({
				...state,
				error: `This request is ${currentTrip.requestStatus}. To change this status,  please contact the system administrator.`,
			});
			return;
		}
		if (!lineManagerTripComment || lineManagerTripComment.length < 2) {
			setState({
				...state,
				error: `Please provide meaningfull comment on the trip decision.`,
			});
			return;
		}
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/editRequestStatus/${currentTrip._id}`,
				{
					requestStatus: "APPROVED",
					lineManagerTripComment,
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
				success: response.data && response.data.message,
			});
			clearFields();
			getLineManagerTrips();
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
			clearFields();
		}
	};

	const handleReject = async (e) => {
		e.preventDefault();

		if (!currentTrip && !currentTrip._id) {
			setState({
				...state,
				error: "Please select a trip request first!",
			});
			return;
		}
		if (currentTrip && currentTrip.requestStatus !== "PENDING") {
			setState({
				...state,
				error: `This request is ${currentTrip.requestStatus}. To change this status,  please contact the system administrator.`,
			});
			return;
		}
		if (!lineManagerTripComment || lineManagerTripComment.length < 2) {
			setState({
				...state,
				error: `Please provide meaningfull comment on the trip decision.`,
			});
			return;
		}
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/editRequestStatus/${currentTrip._id}`,
				{
					requestStatus: "REJECTED",
					lineManagerTripComment,
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
			clearFields();
			getLineManagerTrips();
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
			clearFields();
		}
	};

	const approveTripForm = () => (
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
			<div className="row">
				<div className="form-group col-md-12">
					<br />
					<textarea
						rows="3"
						onChange={handleChange("lineManagerTripComment")}
						className="form-control"
						value={lineManagerTripComment}
						placeholder="Line manager comment"
					/>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() =>
							router.push(`/trip/${currentStaff.empCode}`)
						}
					>
						Back
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleReject}
						className="btn btn-outline-danger btn-block"
					>
						Reject
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleApprove}
						className="btn btn-outline-success btn-block"
					>
						Approve
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listManagerTrips = () =>
		managerTrips &&
		managerTrips.length > 0 &&
		managerTrips.map((trip, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>
						{trip.staffNames}&emsp;{trip.staffEmail}&emsp;
						{trip.staffPhone}&emsp;&emsp;{" "}
					</span>
					<span className="text-muted" style={{ fontSize: 12 }}>
						{trip.startDate ? formatDate(trip.startDate) : "--"}
					</span>
					&emsp; - &emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{trip.endDate ? formatDate(trip.endDate) : "--"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted" style={{ fontSize: 12 }}>
						{trip.tripDestination
							? trip.tripDestination
							: "Trip destination was not recorded"}
					</span>
					&emsp;&emsp;
					{trip.requestStatus === "PENDING" && (
						<span
							style={{
								fontWeight: "bold",
								fontSize: 12,
								color: "blue",
							}}
						>
							{trip.requestStatus}
						</span>
					)}
					&emsp;&emsp;
					{trip.requestStatus === "APPROVED" && (
						<span
							style={{
								color: "green",
								fontWeight: "bold",
								fontSize: 12,
							}}
						>
							{trip.requestStatus}
						</span>
					)}
					&emsp;&emsp;
					{trip.requestStatus === "REJECTED" && (
						<span
							style={{
								color: "purple",
								fontWeight: "bold",
								fontSize: 12,
							}}
						>
							{trip.requestStatus}
						</span>
					)}
					{trip.tripReport && (
						<span
							onClick={() =>
								router.push(
									`/trip/tripReportLineManagerComment/${trip._id}`
								)
							}
							className="btn btn-sm float-right"
							title="Add comment on the field visit report"
						>
							<FileOutlined className="text-primary" />
						</span>
					)}
					<span
						onClick={() => getTrip(trip._id)}
						className="btn btn-sm float-right"
						title="Select this trip to add comment"
					>
						<CheckCircleOutlined className="text-success" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Approve Field Visits</h4>
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

				<div className="row alert alert-secondary">
					<div className="col-md-12">{approveTripForm()}</div>
				</div>
				{listManagerTrips()}
			</div>
			{/* {JSON.stringify(managerTrips)} */}
		</Layout>
	);
};
export default withStaff(tripApproval);
