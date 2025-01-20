import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CheckCircleOutlined } from "@ant-design/icons";
import { isAuth } from "../../helpers/authToken";
import Layout from "../../components/Layout";
import withStaff from "../staff/withStaff";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";
import { formatNumber } from "../../helpers/numberFormatter";

const perdiemFee = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [currentTrip, setCurrentTrip] = useState({});
	const [currentStaff, setCurrentStaff] = useState({});
	const [perdiemTrips, setPerdiemTrips] = useState([]);
	const [currencies, setCurrencies] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [state, setState] = useState({
		tripObjective: "",
		tripDestination: "",
		destinationManagerNames: "",
		destinationManagerEmpCode: "",
		destinationManagerEmail: "",
		destinationManagerPhone: "",
		lineManagerTripComment: "",
		requestStatus: "",
		perdiemAmount: 0,
		perdiemCurrency: "",
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
		perdiemAmount,
		perdiemCurrency,
		error,
		success,
	} = state;

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		loadCurrency();
		getStaff();
		getPerdiemTrips();
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
		});
	};

	const loadCurrency = async () => {
		const response = await axios.get(`${API}/currencies`);
		setCurrencies(response.data);
	};

	const getPerdiemTrips = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/perdiemTrips/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setPerdiemTrips(response.data.tripRequests);
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
			perdiemAmount: response.data.tripRequest.perdiemAmount,
			perdiemCurrency: response.data.tripRequest.perdiemCurrency,
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
			perdiemAmount: 0,
			perdiemCurrency: "",
			startDate: "",
			endDate: "",
		});
	};
	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchTripRequest`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setPerdiemTrips(response.data.tripRequests);
		setLoading(false);
		setSearchText("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!currentTrip && !currentTrip._id) {
			setState({
				...state,
				error: "Please select a trip request first!",
			});
			return;
		}
		if (
			!perdiemCurrency ||
			perdiemCurrency === "" ||
			!perdiemAmount ||
			perdiemAmount === 0 ||
			perdiemAmount === "0"
		) {
			setState({
				...state,
				error: `Please provide valid amount and currency.`,
			});
			return;
		}
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/tripPerdiem/${currentTrip._id}`,
				{
					perdiemAmount,
					perdiemCurrency,
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
			getPerdiemTrips();
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

	const perdiemFeeForm = () => (
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
				<div className="form-group col-md-5">
					<label className="text-muted ">Amount: </label> <br />
					<input
						type="number"
						onChange={handleChange("perdiemAmount")}
						className="form-control"
						value={perdiemAmount}
						required
					/>
				</div>

				<div className="form-group col-md-7">
					<label className="text-muted ">Currency: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("perdiemCurrency")}
						value={perdiemCurrency}
						required
					>
						<option></option>
						{currencies.length > 0 &&
							currencies.map((c, i) => (
								<option key={i} value={c.currency_code}>
									{c.currency}
								</option>
							))}
					</select>
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
						Save
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listPerdiemTrips = () =>
		perdiemTrips &&
		perdiemTrips.length > 0 &&
		perdiemTrips.map((trip, i) => (
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
					{trip.perdiemAmount > 0 && (
						<span
							style={{
								fontWeight: "bold",
								fontSize: 12,
								color: "purple",
							}}
						>
							{formatNumber(trip.perdiemAmount)}&emsp;
							{trip.perdiemCurrency}
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
					<h4>Perdiem for Field Visits</h4>
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
					<div className="col-md-12">{perdiemFeeForm()}</div>
				</div>
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
				{listPerdiemTrips()}
			</div>
			{/* {JSON.stringify(currentTrip)} */}
		</Layout>
	);
};
export default withStaff(perdiemFee);
