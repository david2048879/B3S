import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { isAuth } from "../../helpers/authToken";
import Layout from "../../components/Layout";
import withStaff from "../staff/withStaff";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const newTrip = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [state, setState] = useState({
		tripObjective: "",
		tripDestination: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const { tripObjective, tripDestination, error, success, buttonText } =
		state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getStaff();
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

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const handleNewTrip = () => {
		setState({
			...state,
			tripObjective: "",
			tripDestination: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(null);
		setEndDate(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!startDate || !endDate) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Starting and ending dates of trip are required!",
			});
			return;
		}
		if (!tripObjective || !tripDestination) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Objective and destination of the trip are required!",
			});
			return;
		}
		let dayStart = new Date(startDate).getDate();
		let dayEnd = new Date(endDate).getDate();
		if (dayEnd < dayStart) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Start date must be earlier than end date!",
			});
			return;
		}

		//=========================Save trip to the db ==================
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/newTrip/`,
				{
					tripObjective,
					tripDestination,
					startDate,
					endDate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setLoading(false);
			handleNewTrip();
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

	const newTripForm = () => (
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
				<div className="form-group col-md-6">
					<label className="text-muted ">Trip Destination: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("tripDestination")}
						className="form-control"
						value={tripDestination}
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

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>New Trip</h4>
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
					<div className="col-md-12">{newTripForm()}</div>
				</div>
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(newTrip);
