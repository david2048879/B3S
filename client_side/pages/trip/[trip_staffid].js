import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	MinusCircleOutlined,
	EditOutlined,
	EyeOutlined,
	FilePdfOutlined,
	ArrowUpOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";

import Layout from "../../components/Layout";
import withStaff from "../staff/withStaff";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";

const employeeTrips = ({ token, user }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [managerTrips, setManagerTrips] = useState(false);
	const [destinationTrips, setDestinationTrips] = useState(false);
	const [staffTrips, setStaffTrips] = useState([]);
	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { error, success } = state;

	useEffect(() => {
		getStaffTrips();
		getLineManagerTrips();
		getDestinationManagerTrips();
	}, [router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const getStaffTrips = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/ownTripRequest/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setStaffTrips(response.data.tripRequests);
		setLoading(false);
	};

	const getLineManagerTrips = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/allTripRequestsPerManager/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (
			response.data &&
			response.data.tripRequests &&
			response.data.tripRequests.length > 0
		) {
			setManagerTrips(true);
		}
		setLoading(false);
	};

	const getDestinationManagerTrips = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/destinationManagerTrips/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (
			response.data &&
			response.data.tripRequests &&
			response.data.tripRequests.length > 0
		) {
			setDestinationTrips(true);
		}
		setLoading(false);
	};

	const removeTrip = async (trip) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/deleteTrip/${trip._id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			getStaffTrips();
			setState({ ...state, success: "The trip is successfuly deleted" });
		} catch (error) {
			setLoading(false);
			setState({ ...state, error: "Unable to delete the trip" });
		}
	};

	const tripForm = () => (
		<Fragment>
			<div className="row alert bg-light">
				{managerTrips && (
					<div className="col-md-12 mt-1">
						<button
							className="btn btn-warning btn-block"
							onClick={() => router.push(`/trip/tripApproval/`)}
						>
							Approval of field visit requests. You can also make
							comment on avalable field visit reports.
						</button>
					</div>
				)}
				{/* {managerTrips && (
					<div className="col-md-12 mt-1">
						<button
							className="btn btn-primary btn-block"
							// onClick={() => router.push(`/trip/tripApproval/`)}
						>
							Make comment on field visit reports.
						</button>
					</div>
				)} */}

				{destinationTrips && (
					<div className="col-md-12 mt-1">
						<button
							className="btn btn-success btn-block"
							onClick={() =>
								router.push(`/trip/destinationManagerComment/`)
							}
						>
							Add comment on field visits as destination authority
						</button>
					</div>
				)}
				{user.role === "Logistics" && (
					<div className="col-md-12 mt-1">
						<button
							className="btn btn-primary btn-block"
							onClick={() => router.push(`/trip/transportFee/`)}
						>
							Add transport fee to field visit requests
						</button>
					</div>
				)}
				{user.role === "HR Staff" && (
					<div className="col-md-12 mt-1">
						<button
							className="btn btn-primary btn-block"
							onClick={() => router.push(`/trip/perdiemFee/`)}
						>
							Add perdiem to field visit requests
						</button>
					</div>
				)}
				<div className="col-md-12 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push(`/trip/newTrip/`)}
					>
						Post a new field visit request
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listOwnTrips = () =>
		staffTrips &&
		staffTrips.length > 0 &&
		staffTrips.map((trip, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					From&emsp;
					<span className="text-muted">
						{trip.startDate ? formatDate(trip.startDate) : "--"}
					</span>
					&emsp;To&emsp;
					<span className="text-muted">
						{trip.endDate ? formatDate(trip.endDate) : "--"}
					</span>
					&emsp;--&emsp;
					<span className="text-muted">
						{trip.tripDestination
							? trip.tripDestination
							: "Trip destination was not recorded"}
					</span>
					{trip.requestStatus === "PENDING" && (
						<span
							className="btn btn-sm float-right"
							onClick={() => removeTrip(trip)}
							title="Delete this trip request."
						>
							<MinusCircleOutlined className="text-danger" />
						</span>
					)}
					{trip.requestStatus === "PENDING" && (
						<span
							className="btn btn-sm float-right"
							onClick={() =>
								router.push(`/trip/editTrip/${trip._id}`)
							}
							title="Edit this trip request."
						>
							<EditOutlined className="text-primary" />
						</span>
					)}
					{/* <span
						className="btn btn-sm float-right"
						// onClick={() => router.push(`/trip/${trip._id}`)}
						title="Add document to this trip request."
					>
						<FilePdfOutlined className="text-primary" />
					</span> */}
					{!trip.destinationManagerEmpCode && (
						<span
							className="btn btn-sm float-right"
							onClick={() =>
								router.push(
									`/trip/destinationManager/${trip._id}`
								)
							}
							title="Send this trip form to the destination manager."
						>
							<ArrowRightOutlined className="text-info" />
						</span>
					)}
					{!trip.lineManagerEmpCode && (
						<span
							className="btn btn-sm float-right"
							onClick={() =>
								router.push(`/trip/lineManager/${trip._id}`)
							}
							title="Send this trip request to your line manager."
						>
							<ArrowUpOutlined className="text-success" />
						</span>
					)}
					<span
						className="btn btn-sm float-right"
						onClick={() =>
							router.push(`/trip/tripDetails/${trip._id}`)
						}
						title="View details of this trip"
					>
						<EyeOutlined className="text-primary" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Field Visits</h4>
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
				{tripForm()}
				<div className="col-md-12 pt-3">
					{staffTrips.length > 0 && listOwnTrips()}
				</div>
			</div>
			{/* {JSON.stringify(user)} */}
		</Layout>
	);
};
export default withStaff(employeeTrips);
