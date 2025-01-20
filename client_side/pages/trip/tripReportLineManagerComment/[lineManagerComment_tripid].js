import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../../components/Layout";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const lineManagerComment = ({ token }) => {
	const router = useRouter();
	const { lineManagerComment_tripid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentTrip, setCurrentTrip] = useState({});
	const [tripDocuments, setTripDocuments] = useState([]);
	const [state, setState] = useState({
		staffNames: "",
		tripObjective: "",
		tripDestination: "",
		tripReport: "",
		lineManagerReportComment: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		staffNames,
		tripObjective,
		tripDestination,
		tripReport,
		lineManagerReportComment,
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
			`${API}/oneTripRequest/${lineManagerComment_tripid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentTrip(response.data.tripRequest);
		setTripDocuments(response.data.tripRequest.tripDocuments);
		setState({
			...state,
			staffNames: response.data.tripRequest.staffNames,
			tripObjective: response.data.tripRequest.tripObjective,
			tripDestination: response.data.tripRequest.tripDestination,
			tripReport: response.data.tripRequest.tripReport,
			lineManagerReportComment:
				response.data.tripRequest.lineManagerReportComment,
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
				`${API}/editTripReportComment/${currentTrip._id}`,
				{
					lineManagerReportComment,
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

	const lineManagerCommentForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label style={{ color: "black", fontWeight: "bold" }}>
						Staff Names:{" "}
					</label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("staffNames")}
						className="form-control"
						value={staffNames}
						disabled
					/>
				</div>
				<div className="form-group col-md-3">
					<label style={{ color: "black", fontWeight: "bold" }}>
						Start Date:
					</label>
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
					<label style={{ color: "black", fontWeight: "bold" }}>
						End Date:
					</label>
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
				<div className="form-group col-md-3">
					<label style={{ color: "black", fontWeight: "bold" }}>
						Trip Destination:{" "}
					</label>{" "}
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
					<label style={{ color: "black", fontWeight: "bold" }}>
						Trip Objective:{" "}
					</label>{" "}
					<br />
					<textarea
						rows="3"
						onChange={handleChange("tripObjective")}
						className="form-control"
						value={tripObjective}
						disabled
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-12">
					<label style={{ color: "black", fontWeight: "bold" }}>
						Summary of field visit report:{" "}
					</label>{" "}
					<br />
					<textarea
						rows="7"
						onChange={handleChange("tripReport")}
						className="form-control"
						value={tripReport}
						disabled
					/>
				</div>
			</div>
			<div className="row">
				{currentTrip.tripDocuments &&
					currentTrip.tripDocuments.length > 0 && (
						<div className="col-md-12 mt-1">
							<label
								style={{ color: "black", fontWeight: "bold" }}
							>
								Attached Documents{" "}
							</label>{" "}
						</div>
					)}
			</div>

			{tripDocuments && tripDocuments.length > 0 && listTripDocument()}
			<hr />
			<div className="row">
				<div className="form-group col-md-12">
					<label style={{ color: "black", fontWeight: "bold" }}>
						Line manager's comment of the field visit report:{" "}
					</label>{" "}
					<br />
					<textarea
						rows="3"
						onChange={handleChange("lineManagerReportComment")}
						className="form-control"
						value={lineManagerReportComment}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-md-6 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push(`/trip/tripApproval/`)}
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

	const listTripDocument = () =>
		tripDocuments &&
		tripDocuments.map((doc, i) => (
			<div key={i} className="row mb-3">
				<div className="col">
					{doc.content ? (
						<a
							href={doc.content.url}
							target="_blank"
							className="text-info"
							rel="noopener noreferrer"
						>
							{doc.title.length <= 500
								? doc.title
								: doc.title.substring(0, 500) + "..."}
						</a>
					) : (
						""
					)}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Line Manager's Comment on Field Visit Report</h4>
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
					<div className="col-md-12">{lineManagerCommentForm()}</div>
				</div>
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(lineManagerComment);
