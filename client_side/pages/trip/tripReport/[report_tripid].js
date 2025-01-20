import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { isAuth } from "../../../helpers/authToken";
import Layout from "../../../components/Layout";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const tripReport = ({ token }) => {
	const router = useRouter();
	const { report_tripid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentTrip, setCurrentTrip] = useState({});
	const [state, setState] = useState({
		tripObjective: "",
		tripDestination: "",
		tripReport: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		tripObjective,
		tripDestination,
		tripReport,
		error,
		success,
		buttonText,
	} = state;
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		getTrip();
	}, [router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const getTrip = async () => {
		const response = await axios.get(
			`${API}/oneTripRequest/${report_tripid}`,
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
			tripReport: response.data.tripRequest.tripReport,
			error: "",
			success: "",
			buttonText: "Save",
		});
		setStartDate(new Date(response.data.tripRequest.startDate));
		setEndDate(new Date(response.data.tripRequest.endDate));
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		//=========================Save trip to the db ==================
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/editTripReport/${currentTrip._id}`,
				{
					tripReport,
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

	const tripReportForm = () => (
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

			<div className="row">
				<div className="form-group col-md-12">
					<label className="text-muted ">
						Summary of field visit report:{" "}
					</label>{" "}
					<br />
					<textarea
						rows="7"
						onChange={handleChange("tripReport")}
						className="form-control"
						value={tripReport}
						// placeholder="Write your report here"
					/>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() =>
							router.push(`/trip/tripDetails/${report_tripid}`)
						}
					>
						Back
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-outline-primary btn-block"
						onClick={() =>
							router.push(`/trip/tripDocuments/${report_tripid}`)
						}
					>
						Attach document
					</button>
				</div>
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Field Visit Report</h4>
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
					<div className="col-md-12">{tripReportForm()}</div>
				</div>
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(tripReport);
